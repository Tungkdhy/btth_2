import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import {
  BarSeriesService,
  CategoryService,
  ChartModule,
  ILegendRenderEventArgs,
  LegendService,
  TooltipService,
} from '@syncfusion/ej2-angular-charts';
import { EChartsOption } from 'echarts';
import { PayloadChannelData } from '../../../../models/payload-channel';
import {
  AccumulationChartModule,
  AccumulationTooltipService,
  AccumulationLegendService,
  AccumulationAnnotationService,
  AccumulationDataLabelService,
} from '@syncfusion/ej2-angular-charts';
import {
  formatNumberWithDot,
  getDateRangePayload,
} from 'src/app/_metronic/layout/core/common/common-utils';
import { SupabaseSacThaiService } from './services/supabase.service';
import {
  catchError,
  debounceTime,
  filter,
  finalize,
  from,
  map,
  Observable,
  of,
  Subject,
  tap,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { selectDateV2 } from 'src/app/store/date-time-range-v2/date-time-range-v2.selectors';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';

@Component({
  selector: 'app-nuance-infor',
  standalone: true,
  providers: [
    AccumulationDataLabelService,
    AccumulationTooltipService,
    AccumulationLegendService,
    AccumulationAnnotationService,
    BarSeriesService,
    LegendService,
    TooltipService,
    CategoryService,
    provideEcharts()
  ],
  imports: [CommonModule, AccumulationChartModule, ChartModule, NgxEchartsDirective],
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './nuance-infor.component.html',
  styleUrls: ['./nuance-infor.component.scss'],
})
export class NuanceInforComponent implements OnInit, OnDestroy {
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
  @Input() isShowChiSoSacThai: boolean;
  private _payload: PayloadChannelData;

  nuanceData$: Observable<any>;
  nuanceDataDetail$: Observable<any>;
  public nuanceDataLabel: Object;
  public nuanceColors: string[];
  public nuanceTitle: string;
  public nuancelegendSettings: Object;
  public nuanceTooltip: Object;
  public enableSmartLabels: Object;
  private cdr = inject(ChangeDetectorRef);
  private supabaseService = inject(SupabaseSacThaiService);
  public centerLabel?: Object;
  private eventSubject = new Subject<any>();
  private channel: any;

  colorChart: string;

  isActive: boolean = false;
  defaultDataLoaded: boolean = false;
  previousPayloadValue: any;
  selectedStartDate: string | Date;
  selectedEndDate: string | Date;
  selectedArea: string;

  activeData: 'platform' | 'spyder' = 'platform';

  date$: Observable<any>;

  constructor(private store: Store) { }

  ngOnInit() {
    this.date$ = this.store.select(selectDateV2).pipe(
      filter((date) => !!(date && date.startDate && date.endDate)),
      tap((date) => {
        // DO sth
        const { startDate, endDate } = getDateRangePayload(
          date.startDate!,
          date.endDate!,
          '2',
        );
        this.selectedStartDate = startDate;
        this.selectedEndDate = endDate;

        this.nuanceData$ = this.getNuanceData(startDate, endDate);
        this.nuanceDataDetail$ = this.getChiTietSacThai(startDate, endDate);
      }),
    );
    //nuance donut var
    this.colorChart = this.getCssVariable('body', '--colorText');

    // Method to get the CSS variable value from a specific element

    this.nuanceDataLabel = {
      visible: true,
      name: 'text',
      position: 'Outside',
      template:
        '<div class=\'fw-bold custom-color-text\' style="font-size: 2em;">${point.percentage}%</div>',
    };
    this.enableSmartLabels = true;
    this.nuanceColors = ['#045E2B', '#1D85E7', '#D00B32'];
    this.nuancelegendSettings = {
      visible: true,
      position: 'Bottom',
      textStyle: {
        size: '2em',
        textAlignment: 'Center',
        color: this.colorChart,
      },
      shapeWidth: 30,
      shapeHeight: 30,
      itemPadding: 40,
    };

    // this.updateData();

    this.channel = this.supabaseService
      .getSupabase()
      .channel('schema-db-changes-10')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'TCTT_ChuDe_Ngay' },
        (payload) => {
          this.eventSubject.next(payload);
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'TCTT_ChuDe' },
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
        this.getNuanceData(this.selectedStartDate, this.selectedEndDate);
        this.getChiTietSacThai(this.selectedStartDate, this.selectedEndDate);
      });
  }

  togglePopup(isPopupVisible: boolean, typePopup: string) {
    this.popupToggled.emit({ isPopupVisible, typePopup });
  }
  private getCssVariable(selector: string, variable: string): string {
    const element = document.querySelector(selector);
    if (element) {
      return getComputedStyle(element).getPropertyValue(variable).trim();
    }
    return '';
  }

  ngOnDestroy() {
    // Xóa setInterval khi component bị hủy
  }


  pieChartOption: EChartsOption = {
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
          formatter: '{c} %',
          fontSize: '15px',
          fontWeight: 700
        },
        data: [
          { value: 30, name: 'Tích cực', itemStyle: { color: 'rgba(28, 155, 83, 1)' } },  
          { value: 30, name: 'Trung lập', itemStyle: { color: 'rgba(52, 131, 251, 1)' } }, 
          { value: 40, name: 'Cần xác minh', itemStyle: { color: 'rgba(210, 0, 26, 1)' } },
        ],
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
        const seriesData = (this.pieChartOption.series as any[])[0]?.data;
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

  public legendRender(args: ILegendRenderEventArgs, data: any[]): void {
    if (data && data.length > 0) {
      const currentItem = data.find((item) => item['x'] === args.text);
      if (currentItem) {
        args.text = `${currentItem['x']}: ${formatNumberWithDot(
          currentItem['y'],
        )}`;
      }
    }
  }

  setActiveData(type: 'platform' | 'spyder') {
    this.activeData = type;
    this.nuanceData$ = this.getNuanceData(
      this.selectedStartDate,
      this.selectedEndDate,
    );
  }

  getNuanceData(
    startDate: string | Date,
    endDate: string | Date,
  ): Observable<any> {
    console.log(this.activeData)
    if (this.activeData === 'platform') {
      return from(
        this.supabaseService.tctt_chi_so_sac_thai(
          startDate,
          endDate,
          'platform',
        ),
      ).pipe(
        map((result) => {
          const totalY = result.data?.reduce((sum, item) => sum + item.y, 0);
          this.centerLabel = {
            text: `${formatNumberWithDot(totalY)}`,
            textStyle: {
              fontWeight: '700',
              size: '1.7em',
            },
          };
          this.cdr.markForCheck();
          return result;
        }),
        finalize(() => this.cdr.markForCheck()),
      );
    }

    if (this.activeData === 'spyder') {
      return from(
        this.supabaseService.tctt_chi_so_sac_thai(startDate, endDate, 'spyder'),
      ).pipe(
        map((result) => {
          const totalY = result.data?.reduce((sum, item) => sum + item.y, 0);
          this.centerLabel = {
            text: `${formatNumberWithDot(totalY)}`,
            textStyle: {
              fontWeight: '700',
              size: '2em',
            },
          };
          this.cdr.markForCheck();
          return result;
        }),
        finalize(() => this.cdr.markForCheck()),
      );
    }

    return new Observable();
  }

  getChiTietSacThai(
    startDate: Date | string,
    endDate: Date | string,
  ): Observable<any> {
    return from(
      this.supabaseService.tctt_chi_tiet_sac_thai(startDate, endDate),
    ).pipe(
      map((data: any) => data),
      catchError((error) => {
        console.error('Error fetching chi tiet sac thai:', error);
        return of([]);
      }),
    );
  }
}
