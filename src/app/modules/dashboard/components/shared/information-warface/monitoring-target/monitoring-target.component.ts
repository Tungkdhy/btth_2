import {
  ChangeDetectorRef,
  Component,
  Input,
  inject,
  OnInit,
  SimpleChanges,
  EventEmitter,
  Output,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AccumulationAnnotationService,
  AccumulationChartModule,
  AccumulationDataLabelService,
  AccumulationLegendService,
  AccumulationTooltipService,
  BarSeriesService,
  CategoryService,
  ChartModule,
  ColumnSeriesService,
  DataLabelService,
  DateTimeService,
  LegendService,
  LegendSettingsModel,
  LineSeriesService,
  MultiColoredLineSeriesService,
  ParetoSeriesService,
  SplineAreaSeriesService,
  SplineSeriesService,
  StackingLineSeriesService,
  StepLineSeriesService,
  TooltipService,
  ILegendRenderEventArgs,
  IPointEventArgs,
  IAccTextRenderEventArgs,
} from '@syncfusion/ej2-angular-charts';
import { PayloadChannelData } from '../../../../models/payload-channel';
import {
  formatNumberWithDot,
  getAreaPayload,
} from 'src/app/_metronic/layout/core/common/common-utils';
import { ProtectingTargetComponent } from '../protecting-target/protecting-target.component';
import { SupabaseGiamSatService } from './services/supabase.service';
import { debounceTime, Observable, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';

@Component({
  selector: 'app-monitoring-target',
  standalone: true,
  providers: [
    AccumulationDataLabelService,
    AccumulationTooltipService,
    AccumulationLegendService,
    AccumulationAnnotationService,
    CategoryService,
    DataLabelService,
    BarSeriesService,
    LegendService,
    TooltipService,
    LineSeriesService,
    StepLineSeriesService,
    SplineSeriesService,
    StackingLineSeriesService,
    DateTimeService,
    SplineAreaSeriesService,
    MultiColoredLineSeriesService,
    ParetoSeriesService,
    ColumnSeriesService,
    provideEcharts()
  ],
  imports: [
    CommonModule,
    AccumulationChartModule,
    ChartModule,
    ProtectingTargetComponent,
    FormsModule,
    NgxEchartsDirective
  ],
  templateUrl: './monitoring-target.component.html',
  styleUrls: ['./monitoring-target.component.scss'],
})
export class MonitoringTargetComponent implements OnInit, OnChanges, OnDestroy {
  get payload(): any {
    return this._payload;
  }

  colorChart: string;
  @Input() set payload(value: any) {
    this._payload = value;
  }
  @Input() isShowMucTieuGS: boolean;
  private _payload: PayloadChannelData;

  @Output() popupToggled = new EventEmitter<{
    isPopupVisible: boolean;
    typePopup: string;
  }>();

  public filteredTargetCorrelationDataDetail: any[] = [];

  public targetCorrelationData?: Promise<any[]>;
  public targetCorrelationDataDetail?: any[] = [];
  public targetCorrelationDataLabel: Object;
  public enableSmartLabels: boolean = true;
  public accumulationLegendSettings: LegendSettingsModel;
  monitoringTargetChartOption: EChartsOption;
  public targetCorrelationColors: string[] = [
    '#850000',
    '#990000',
    '#B20000',
    '#CC0000',
    '#E60000',
    '#FF3333',
    '#FF6666',
    '#FF9999',
  ];
  public border: Object = {
    width: 2,
    radius: 10, // Apply border-radius here
  };
  public centerLabel: Object;

  private supabaseService = inject(SupabaseGiamSatService);
  private cdr = inject(ChangeDetectorRef);
  private eventSubject = new Subject<any>();
  private channel: any;
  public isDefault: boolean = true;

  isActive: boolean = false;
  selectedArea: string;

  date$: Observable<any>;

  constructor(private store: Store) { }

  ngOnInit() {
    const area = getAreaPayload(this.payload?.payload?.data);
    this.selectedArea = area;
    this.updateData(area);

    this.isDefault = true;
    this.colorChart = this.getCssVariable('body', '--colorText');
    this.initialAccumulationSettings();
    this.channel = this.supabaseService
      .getSupabase()
      .channel('schema-db-changes-10')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'TCTT_DoiTuong' },
        (payload) => {
          this.eventSubject.next(payload);
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'TCTT_DoiTuong_DonVi' },
        (payload) => {
          this.eventSubject.next(payload);
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'TCTT_DonVi' },
        (payload) => {
          this.eventSubject.next(payload);
        },
      )
      .subscribe();

    this.eventSubject
      .pipe(
        debounceTime(10 * 1000), // Điều chỉnh thời gian debounce theo nhu cầu
      )
      .subscribe(async (payload) => {
        this.updateData(this.selectedArea);
        this.updateCt86Data(this.selectedArea);
      });
  }
  getMonitoringTargetColor(index: number): string {
    const colors = [
      'rgba(102, 11, 17, 1)',
      'rgba(152, 27, 30, 1)',
      'rgba(210, 0, 26, 1)',
      'rgba(239, 62, 46, 1)',
      'rgba(243, 111, 81, 1)',
      'rgba(246, 151, 122, 1)',
      'rgba(253, 231, 220, 1)'
    ];
    return colors[index % colors.length];
  }

  toggleState() {
    this.isDefault = !this.isDefault;
    this.handleToggleChange();
  }

  handleToggleChange() {
    if (this.isDefault) {
      this.updateData(this.selectedArea);
    } else if (!this.isDefault) {
      this.updateCt86Data(this.selectedArea);
    }
  }

  private getCssVariable(selector: string, variable: string): string {
    const element = document.querySelector(selector);
    if (element) {
      return getComputedStyle(element).getPropertyValue(variable).trim();
    }
    return '';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.payload && !changes.payload.firstChange) {
      const currentValue = changes.payload.currentValue;

      if (this.isAreaPayload(currentValue)) {
        this.isActive = true;
        const area = getAreaPayload(currentValue.payload.data);
        this.selectedArea = area;
        this.updateData(area);
      } else {
        this.isActive = false;
      }
    }
  }

  ngOnDestroy() {
    // Xóa setInterval khi component bị hủy
  }

  // public PointClick = (args: IPointEventArgs): void => {
  //   const nentang = args.point.x;
  //   console.log("tên nền tảng: ", nentang);
    
  //   this.togglePopup(true, 'TQMucTieu', nentang);
  // };

  onChartClick(event:any){
    const nentang = event.name;
    this.togglePopup(true, 'TQMucTieu', nentang);
  }

  togglePopup(isPopupVisible: boolean, typePopup: string, filterString: any) {
    this.filteredTargetCorrelationDataDetail =
      this.targetCorrelationDataDetail?.filter(
        (detail) => detail.nentang === filterString,
      ) || [];
    this.popupToggled.emit({ isPopupVisible, typePopup });
  }

  private updateData(area: string) {
    this.isDefault = true;

    this.targetCorrelationData = this.supabaseService
      .tctt_tuong_quan_muc_tieu(area)
      .then((result) => {
        const totalY = result?.reduce(
          (sum: any, item: any) => sum + item.soluong,
          0,
        );
        this.monitoringTargetChartOption = {
          series: [
            {
              type: 'pie',
              radius: ['35%', '60%'],
              center: ['50%', '40%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: true,
                position: 'outside',
                formatter: (params: any) => {
                  const percent = ((params.value / totalY) * 100).toFixed(0);
                  return `${percent} %`;
                },
                fontSize: '15px',
                fontWeight: 700
              },
              data: result.map((item: any, index: number) => ({
                value: item.soluong,
                name: item.nentang,
                itemStyle: {
                  color: this.getMonitoringTargetColor(index)
                }
              })),
            },
          ],
          legend: {
            show: true,
            orient: 'horizontal', // Giữ theo hàng ngang trước
            left: 'center', // Căn giữa
            bottom: 0, // Cách đáy một chút
            width: '100%', // Trải rộng tối đa để tránh xuống dòng sớm
            itemWidth: 14,
            itemHeight: 14,
            itemGap: 20,
            textStyle: {
              fontSize: 18,
              fontWeight: 500
            },
            icon: 'circle',
            formatter: (name: string) => {
              const seriesData = (this.monitoringTargetChartOption.series as any[])[0]?.data;
              const item = seriesData?.find((d: any) => d.name === name);
              return `${name}: ${item?.value}`;
            }
          },
          graphic: [
            {
              type: 'text',
              left: 'center',
              top: '38%',
              style: {
                text: '70',
                fontSize: 18,
                fontWeight: 'bold',
                fill: '#333',
              },
            },
          ],
        };
        this.centerLabel = {
          tooltip: { enable: true },
          text: `${formatNumberWithDot(totalY)}`,
          textStyle: {
            fontWeight: '700',
            size: '2em',
            textOverflow: 'Trim',
          },
        };
        return result;
      })
      .finally(() => this.cdr.markForCheck());

    // chi tiết tương quan mục tiêu
    this.supabaseService
      .tctt_chi_tiet_doi_tuong(area)
      // chi tiết tương quan mục tiêu
      .then((data) => (this.targetCorrelationDataDetail = data))
      .finally(() => this.cdr.markForCheck());
  }

  updateCt86Data(area: string): void {
    this.targetCorrelationData = this.supabaseService
      .tctt_tuong_quan_muc_tieu_ct86(area)
      .then((result) => {
        const totalY = result?.reduce(
          (sum: any, item: any) => sum + item.soluong,
          0,
        );
        this.centerLabel = {
          text: `${formatNumberWithDot(totalY)}`,
          textStyle: {
            fontWeight: '700',
            size: '30px',
          },
        };
        return result;
      })
      .finally(() => this.cdr.markForCheck());

    // chi tiết tương quan mục tiêu
    this.supabaseService
      .tctt_chi_tiet_doi_tuong_ct86(area)
      // chi tiết tương quan mục tiêu
      .then((data) => (this.targetCorrelationDataDetail = data))
      .finally(() => this.cdr.markForCheck());
  }

  public legendRender(args: ILegendRenderEventArgs, data: any[]): void {
    if (data && data.length > 0) {
      const currentItem = data.find((item) => item['nentang'] === args.text);
      if (currentItem) {
        if (currentItem['nentang'] === 'Các trang báo điện tử') {
          args.text = `Báo điện tử: ${formatNumberWithDot(
            currentItem['soluong'],
          )}`;
        } else {
          args.text = `${currentItem['nentang']}: ${formatNumberWithDot(currentItem['soluong'])}`;
        }
      }
    }
  }

  public onTextRender(args: IAccTextRenderEventArgs): void {
    args.font.fontWeight = '600';
    args.font.size = '20px';
    args.text = args.point.x + ': ' + args.point.y;
  }

  private isAreaPayload(payload: any): boolean {
    return payload && payload.payload.type === 'area';
  }

  initialAccumulationSettings() {
    this.accumulationLegendSettings = {
      margin: { left: 20, right: 20 },
      width: '100%',
      shapeHeight: 30,
      shapeWidth: 30,
      itemPadding: 40,
      alignment: 'Center',
      textStyle: {
        size: '1.8rem',
        textAlignment: 'Center',
        color: this.colorChart,
      },
      textWrap: 'Wrap',
      position: 'Bottom',
      // toggleVisibility: false,
      // enablePages: false,
      // height: ',
    };

    this.targetCorrelationDataLabel = {
      visible: true,
      position: 'Outside',
      connectorStyle: { type: 'Curve', length: '5%' },
      font: { size: '14px', color: 'white' },
      template:
        '<div class=\'fw-bold custom-color-text\' style="font-size: 2rem;">${point.percentage}%</div>',
    };
  }
}
