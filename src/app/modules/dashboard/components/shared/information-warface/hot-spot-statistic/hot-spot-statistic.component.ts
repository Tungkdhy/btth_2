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
  formatDateTime,
  formatNumberWithDot,
  getAreaPayload,
} from 'src/app/_metronic/layout/core/common/common-utils';
import { SupabaseDiemNongService } from './services/supabase.service';
import {
  catchError,
  debounceTime,
  from,
  map,
  Observable,
  of,
  Subject,
} from 'rxjs';
import { diemNongType } from 'src/app/modules/dashboard/models/btth.interface';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';

@Component({
  selector: 'app-hot-spot-statistic',
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
  imports: [CommonModule, AccumulationChartModule, ChartModule, NgxEchartsDirective],
  templateUrl: './hot-spot-statistic.component.html',
  styleUrls: ['./hot-spot-statistic.component.scss'],
})
export class HotSpotComponent implements OnInit, OnChanges, OnDestroy {
  get payload(): any {
    return this._payload;
  }

  colorChart: string;
  @Input() set payload(value: any) {
    this._payload = value;
  }
  @Input() isShowDiemNong: boolean;
  private _payload: PayloadChannelData;
  // @Output() popupToggled = new EventEmitter<{
  //   isPopupVisible: boolean;
  //   typePopup: string;
  // }>();

  @Output() popupToggled = new EventEmitter<{
    isPopupVisible: boolean;
    typePopup: string;
  }>();

  public hotSpotData: Promise<any[]>;
  hotSpotDataDetail$: Observable<any>;
  hotSpotStatusData$: Observable<any>;
  hotSpotStatisticData$: Observable<any>;
  hotSpotStatisticChartOption: EChartsOption;
  public hotSpotDataLabel: Object;
  public enableSmartLabels: boolean;
  public accumulationLegendSettings: LegendSettingsModel;
  public hotSpotColors: string[] = [
    'rgba(107, 103, 225, 1)',
    'rgba(84, 146, 248, 1)',
    'rgba(62, 181, 250, 1)',
    'rgba(25, 192, 211, 1)',
  ];
  public border: Object = {
    width: 2,
    radius: 10, // Apply border-radius here
  };
  public relatedTargetTitle: string;
  public centerLabel: Object;

  private supabaseService = inject(SupabaseDiemNongService);
  private cdr = inject(ChangeDetectorRef);
  public channel: any;
  private eventSubject = new Subject<any>();

  isActive: boolean = false;
  selectedArea: string;

  constructor() { }

  ngOnInit() {
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
        { event: '*', schema: 'public', table: 'TCTT_LoaiDiemNong' },
        (payload) => {
          console.log(payload);
          this.eventSubject.next(payload);
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'TCTT_DiemNong' },
        (payload) => {
          console.log(payload);
          this.eventSubject.next(payload);
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'TCTT_DonVi' },
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
      } else {
        this.isActive = false;
      }
    }
  }

  getChiTietKhuCN(area: string, name: any): Observable<any> {
    return from(this.supabaseService.tctt_chi_tiet_khu_cong_nghiep(area)).pipe(
      map((data: any) => ({ data: data, labelName: name })),
      catchError((error) => {
        console.error('Error fetching chi tiet khu CN:', error);
        return of([]);
      }),
    );
  }

  getTrangThaiKhuCN(area: string): Observable<any> {
    return from(
      this.supabaseService.tctt_trang_thai_khu_cong_nghiep(area),
    ).pipe(
      map((data: any) => data),
      catchError((error) => {
        console.error('Error fetching chi tiet khu CN:', error);
        return of([]);
      }),
    );
  }

  getThongKeKhuCN(area: string): Observable<any> {
    return from(
      this.supabaseService.tctt_so_luong_khu_cong_nghiep_theo_tinh(area),
    ).pipe(
      map((data: any) => data),
      catchError((error) => {
        console.error('Error fetching chi tiet khu CN:', error);
        return of([]);
      }),
    );
  }

  getChiTietBot(area: string, name: any): Observable<any> {
    return from(this.supabaseService.tctt_chi_tiet_bot(area)).pipe(
      map((data: any) => ({ data: data, labelName: name })),
      catchError((error) => {
        console.error('Error fetching chi tiet bot:', error);
        return of([]);
      }),
    );
  }

  getTrangThaiBot(area: string): Observable<any> {
    return from(this.supabaseService.tctt_trang_thai_bot(area)).pipe(
      map((data: any) => data),
      catchError((error) => {
        console.error('Error fetching chi tiet khu CN:', error);
        return of([]);
      }),
    );
  }

  getThongKeBot(area: string): Observable<any> {
    return from(this.supabaseService.tctt_so_luong_bot_theo_tinh(area)).pipe(
      map((data: any) => data),
      catchError((error) => {
        console.error('Error fetching chi tiet khu CN:', error);
        return of([]);
      }),
    );
  }

  getChiTietGiaoSu(area: string, name: any): Observable<any> {
    return from(this.supabaseService.tctt_chi_tiet_giao_xu(area)).pipe(
      map((data: any) => ({ data: data, labelName: name })),
      catchError((error) => {
        console.error('Error fetching chi tiet bot:', error);
        return of([]);
      }),
    );
  }

  getTrangThaiGiaoXu(area: string): Observable<any> {
    return from(this.supabaseService.tctt_trang_thai_giao_xu(area)).pipe(
      map((data: any) => data),
      catchError((error) => {
        console.error('Error fetching chi tiet khu CN:', error);
        return of([]);
      }),
    );
  }

  getThongKeGiaoXu(area: string): Observable<any> {
    return from(
      this.supabaseService.tctt_so_luong_giao_xu_theo_tinh(area),
    ).pipe(
      map((data: any) => data),
      catchError((error) => {
        console.error('Error fetching chi tiet khu CN:', error);
        return of([]);
      }),
    );
  }
  getDiemNongColor(index: number): string {
    const colors = ['rgba(0, 80, 199, 1)', 'rgba(52, 131, 251, 1)', 'rgba(113, 168, 252, 1)', 'rgba(4, 94, 43, 1)', 'rgba(28, 155, 83, 1)', 'rgba(70, 190, 130, 1)', 'rgba(170, 230, 200, 1)'];
    return colors[index % colors.length];
  }

  ngOnDestroy() { }

  public PointClick = (args: IPointEventArgs): void => {
    const name = args.point.x;

    if (name === diemNongType.KHU_CONG_NGHIEP) {
      this.hotSpotDataDetail$ = this.getChiTietKhuCN(this.selectedArea, name);
      this.hotSpotStatusData$ = this.getTrangThaiKhuCN(this.selectedArea);
      this.hotSpotStatisticData$ = this.getThongKeKhuCN(this.selectedArea);
      this.togglePopup(true, 'DiemNong');
    } else if (name === diemNongType.BOT) {
      this.hotSpotDataDetail$ = this.getChiTietBot(this.selectedArea, name);
      this.hotSpotStatusData$ = this.getTrangThaiBot(this.selectedArea);
      this.hotSpotStatisticData$ = this.getThongKeBot(this.selectedArea);
      this.togglePopup(true, 'DiemNong');
    } else if (name === diemNongType.GIAO_XU) {
      // Waiting for new function
      this.hotSpotDataDetail$ = this.getChiTietGiaoSu(this.selectedArea, name);
      this.hotSpotStatusData$ = this.getTrangThaiGiaoXu(this.selectedArea);
      this.hotSpotStatisticData$ = this.getThongKeGiaoXu(this.selectedArea);
      this.togglePopup(true, 'DiemNong');
    }
  };

  onChartClick(event:any){
    const name = event.name;
    if (name === diemNongType.KHU_CONG_NGHIEP) {
      this.hotSpotDataDetail$ = this.getChiTietKhuCN(this.selectedArea, name);
      this.hotSpotStatusData$ = this.getTrangThaiKhuCN(this.selectedArea);
      this.hotSpotStatisticData$ = this.getThongKeKhuCN(this.selectedArea);
      this.togglePopup(true, 'DiemNong');
    } else if (name === diemNongType.BOT) {
      this.hotSpotDataDetail$ = this.getChiTietBot(this.selectedArea, name);
      this.hotSpotStatusData$ = this.getTrangThaiBot(this.selectedArea);
      this.hotSpotStatisticData$ = this.getThongKeBot(this.selectedArea);
      this.togglePopup(true, 'DiemNong');
    } else if (name === diemNongType.GIAO_XU) {
      // Waiting for new function
      this.hotSpotDataDetail$ = this.getChiTietGiaoSu(this.selectedArea, name);
      this.hotSpotStatusData$ = this.getTrangThaiGiaoXu(this.selectedArea);
      this.hotSpotStatisticData$ = this.getThongKeGiaoXu(this.selectedArea);
      this.togglePopup(true, 'DiemNong');
    }
  }

  togglePopup(isPopupVisible: boolean, typePopup: string) {
    this.popupToggled.emit({ isPopupVisible, typePopup });
  }

  private updateData(area: string) {
    this.hotSpotData = this.supabaseService
      .tctt_tong_quan_diem_nong(area)
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
        this.hotSpotStatisticChartOption = {
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
                  color: this.getDiemNongColor(index)
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
              const seriesData = (this.hotSpotStatisticChartOption.series as any[])[0]?.data;
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

    this.supabaseService
      .tctt_chi_tiet_khu_cong_nghiep(area)
      .then((result) => result)
      .finally(() => this.cdr.markForCheck());

    this.supabaseService
      .tctt_chi_tiet_bot(area)
      .then((result) => result)
      .finally(() => this.cdr.markForCheck());

    this.supabaseService
      .tctt_trang_thai_giao_xu(area)
      .then((result) => result)
      .finally(() => this.cdr.markForCheck());
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

    this.hotSpotDataLabel = {
      visible: true,
      name: 'text',
      position: 'Outside',
      template:
        '<div class=\'fw-bold custom-color-text\' style="font-size: 2rem;">${point.percentage}%</div>',
    };
  }
}
