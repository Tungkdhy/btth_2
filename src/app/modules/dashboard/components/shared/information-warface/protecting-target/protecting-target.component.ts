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
} from '@syncfusion/ej2-angular-charts';

import { PayloadChannelData } from '../../../../models/payload-channel';
import {
  formatNumberWithDot,
  getAreaPayload,
} from 'src/app/_metronic/layout/core/common/common-utils';
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import { SupabaseMucTieuBaoVeService } from './services/supabase.service';
import { debounceTime, Observable, Subject, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
registerLocaleData(localeVi, 'vi-VN');

@Component({
  selector: 'app-protecting-target',
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
    CategoryService,
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
    NgxEchartsDirective
  ],
  templateUrl: './protecting-target.component.html',
  styleUrls: ['./protecting-target.component.scss'],
})
export class ProtectingTargetComponent implements OnInit, OnChanges, OnDestroy {
  // mục tiêu bảo vệ
  @Output() popupToggled = new EventEmitter<{
    isPopupVisible: boolean;
    typePopup: string;
  }>();
  get payload(): any {
    return this._payload;
  }

  @Input() set payload(value: any) {
    this._payload = value;
  }
  @Input() isShowMucTieuBV: boolean;
  private _payload: PayloadChannelData;

  public baoveData: Promise<any[]>;
  public protectDataChart: any;
  public protectTargetChartOption: EChartsOption;
  public baoveDataDetail: any;
  public accumulationLegendSettings: LegendSettingsModel;
  public baoveDataLabel: Object;
  public enableSmartLabels: boolean;
  public baoveColors: string[] = ['#045E2B', '#0ABF5A', '#BF0A5A'];
  public border: Object = {
    width: 2,
    radius: 10, // Apply border-radius here
  };
  colorChart: string;
  public relatedTargetTitle: string;
  private cdr = inject(ChangeDetectorRef);
  private supabaseService = inject(SupabaseMucTieuBaoVeService);
  public centerLabel?: Object;
  private eventSubject = new Subject<any>();
  private channel: any;

  isActive: boolean = false;
  selectedArea: string;

  date$: Observable<any>;

  constructor(private store: Store) { }

  async ngOnInit() {
    const area = getAreaPayload(this.payload?.payload?.data);
    this.selectedArea = area;
    this.updateData(area);
    
    this.colorChart = this.getCssVariable('body', '--colorText');
    this.initialAccumulationSettings();
    this.channel = this.supabaseService
      .getSupabase()
      .channel('schema-db-changes-10')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'TCTT_LoaiMucTieuBaoVe' },
        (payload) => {
          console.log(payload);
          this.eventSubject.next(payload);
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'TCTT_MucTieuBaoVe' },
        (payload) => {
          console.log(payload);
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
      });
  }

  getBaoveColor(index: number): string {
    const colors = ['rgba(4, 94, 43, 1)', 'rgba(28, 155, 83, 1)', 'rgba(70, 190, 130, 1)', 'rgba(170, 230, 200, 1)'];
    return colors[index % colors.length];
  }

  getTotalThongKe(data: any[]): number {
    return data.reduce((total, item) => total + item.thongke, 0);
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

      // Nếu payload thay đổi liên quan đến `Area`
      if (this.isAreaPayload(currentValue)) {
        this.isActive = true;
        const area = getAreaPayload(currentValue.payload.data);
        this.selectedArea = area;
        this.updateData(area); // Cập nhật dữ liệu với Area mới
      }
    }


  }

  ngOnDestroy() { }

  togglePopup(isPopupVisible: boolean, typePopup: string, filterString: any) {
    this.popupToggled.emit({ isPopupVisible, typePopup });
  }

  private updateData(area: string) {
    this.baoveData = this.supabaseService
      .tctt_muc_tieu_bao_ve(area)
      .then((result) => {
        const totalY = result?.reduce(
          (sum: any, item: any) => sum + item.thongke,
          0,
        );
        this.centerLabel = {
          text: `${formatNumberWithDot(totalY)}`,
          textStyle: {
            fontWeight: '700',
            size: '2em',
          },
        };
       
        this.protectTargetChartOption = {
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
                value: item.thongke,
                name: item.name,
                itemStyle: {
                  color: this.getBaoveColor(index)
                }
              })),
            },
          ],
          legend: {
            show: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '15',
            itemWidth: 14,
            itemHeight: 14,
            itemGap: 40,
            textStyle: {
              fontSize: 18,
              fontWeight: 500
            },
            icon: 'circle',
            formatter: (name: string) => {
              const seriesData = (this.protectTargetChartOption.series as any[])[0]?.data;
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
                text: totalY,
                fontSize: 18,
                fontWeight: 'bold',
                fill: '#333',
              },
            },
          ],
        };
        return result;

      })
      .finally(() => this.cdr.markForCheck());
  }

  async getChiTietMucTieu(area: string, data: any, name: any) {
    await this.supabaseService
      .tctt_detail_muc_tieu_bao_ve(area, data)
      .then((data) => {
        this.baoveDataDetail = { labelName: name, data: data };
        this.togglePopup(true, 'MucTieuBaoVe', data);
      })
      .finally(() => {
        this.cdr.markForCheck();
      });
  }

  public legendRender(args: ILegendRenderEventArgs, data: any[]): void {
    if (data && data.length > 0) {
      const currentItem = data.find((item) => item['name'] === args.text);
      if (currentItem) {
        args.text = `${currentItem['name']}: ${formatNumberWithDot(
          currentItem['thongke'],
        )}`;
      }
    }
  }

  private isAreaPayload(payload: any): boolean {
    return payload && payload.payload.type === 'area';
  }

  // public PointClick = (args: IPointEventArgs): void => {
  //   const name = args.point.x;
  //   console.log("click name: ", name);

  //   const data = this.baoveData?.then((data) => {
  //     const _foundIndex = data.findIndex((item) => item.name === name);
  //     if (_foundIndex !== -1) {
  //       return data[_foundIndex].id_type;
  //     }
  //   });

  //   this.getChiTietMucTieu(this.selectedArea, data, name);
  // };

  onChartClick(event:any){
    const name = event.name;
    const data = this.baoveData?.then((data) => {
      const _foundIndex = data.findIndex((item) => item.name === name);
      if (_foundIndex !== -1) {
        return data[_foundIndex].id_type;
      }
    });

    this.getChiTietMucTieu(this.selectedArea, data, name);
  }

  initialAccumulationSettings() {
    this.accumulationLegendSettings = {
      margin: { left: 20, right: 20 },
      width: 'fit-content',
      shapeHeight: 30,
      shapeWidth: 30,
      itemPadding: 40,
      alignment: 'Center',
      textStyle: {
        size: '2rem',
        textAlignment: 'Center',
        color: this.colorChart,
      },
      textWrap: 'Wrap',
      position: 'Bottom',
      toggleVisibility: false,
    };

    this.baoveDataLabel = {
      visible: true,
      name: 'text',
      position: 'Outside',
      template:
        '<div class=\'fw-bold custom-color-text\' style="font-size: 2rem;">${point.percentage}%</div>',
    };
  }

  
}
