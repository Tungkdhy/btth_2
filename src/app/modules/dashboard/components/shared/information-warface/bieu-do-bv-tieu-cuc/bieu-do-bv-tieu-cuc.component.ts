import { CommonModule } from '@angular/common';
import { EChartsOption } from 'echarts';
import {
  ChangeDetectorRef,
  Component,
  Input,
  inject,
  OnInit,
  SimpleChanges,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  AccumulationAnnotationService,
  AccumulationChartModule,
  AccumulationDataLabelService,
  AccumulationLegendService,
  AccumulationTooltipService,
  AxisModel,
  BarSeriesService,
  CategoryService,
  ChartModule,
  ColumnSeriesService,
  DataLabelService,
  DateTimeService,
  ITextRenderEventArgs,
  LegendService,
  LineSeriesService,
  MultiColoredLineSeriesService,
  ParetoSeriesService,
  SplineAreaSeriesService,
  SplineSeriesService,
  StackingLineSeriesService,
  StepLineSeriesService,
  TooltipService,
} from '@syncfusion/ej2-angular-charts';
import { PayloadChannelData } from '../../../../models/payload-channel';
import {
  convertFormatDateTimeTctt,
  formatDateTime,
  getDateRangePayload,
  isNaNDateFormat,
  isTheFollowingDay,
} from 'src/app/_metronic/layout/core/common/common-utils';
import { SupabaseBaiTieuCucService } from './services/supabase.service';
import { debounceTime, filter, Observable, Subject, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectDateV2 } from 'src/app/store/date-time-range-v2/date-time-range-v2.selectors';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
@Component({
  selector: 'app-bieu-do-bv-tieu-cuc',
  templateUrl: './bieu-do-bv-tieu-cuc.component.html',
  styleUrls: ['./bieu-do-bv-tieu-cuc.component.scss'],
  standalone: true,
  imports: [CommonModule, AccumulationChartModule, ChartModule, FormsModule, NgxEchartsDirective],
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
  encapsulation: ViewEncapsulation.None,
})
export class BieuDoBvTieuCucComponent implements OnInit {
  private colorChart: string;
  public primaryXAxisLine: AxisModel;
  public primaryYAxisLine: AxisModel;

  get payload(): any {
    return this._payload;
  }

  @Input() set payload(value: any) {
    this._payload = value;
  }
  private _payload: PayloadChannelData;
  @Output() popupToggled = new EventEmitter<{
    isPopupVisible: boolean;
    typePopup: string;
  }>();

  public chartData?: any; // line graph
  public titleLine?: string;
  public markerLine?: Object;

  private previousPayloadValue: any;

  private supabaseService = inject(SupabaseBaiTieuCucService);
  private cdr = inject(ChangeDetectorRef);
  private eventSubject = new Subject<any>();
  private channel: any;
  public selectedOption: string = '1';

  isActive: boolean = false;
  defaultDataLoaded: boolean = false;

  selectedStartDate: string | Date;
  selectedEndDate: string | Date;
  selectedArea: string;

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
          '0',
        );

        if (startDate && endDate) {
          this.selectedStartDate = startDate;
          this.selectedEndDate = endDate;

          if (!isNaNDateFormat(startDate, endDate)) {
            this.updateData();
          }
        }
      }),
    );

    this.selectedOption = '1';
    this.colorChart = this.getCssVariable('body', '--colorText');
    this.primaryXAxisLine = {
      valueType: 'Category',
      majorGridLines: { width: 0 },
      interval: 1,
      edgeLabelPlacement: 'Shift',
      labelIntersectAction: 'Rotate45',
      labelStyle: {
        size: '2rem', // Change this to the desired font size
        fontWeight: 'bold',
        color: 'red', // Make the labels bold
      },
      plotOffsetRight: 25,
      plotOffsetLeft: 5,
    };

    // public primaryYAxisLine?: Object;
    this.primaryYAxisLine = {
      visible: false,
      minimum: 0,
      // interval: "auto,
      title: '',
      labelFormat: '{value}',
      labelStyle: {
        size: '1.5rem', // Change this to the desired font size
        fontWeight: 'bold',
        textAlignment: 'Near',
        color: this.colorChart, // Make the labels bold
      },
      rangePadding: 'Additional',
      plotOffsetTop: 10, // Add space at the top
      plotOffsetBottom: 10,
      placeNextToAxisLine: true,
      // Display y-axis values
    };
    this.markerLine = {
      visible: true,
      width: 10,
      height: 10,
      shape: 'Diamond',
      dataLabel: {
        visible: true,
        position: 'Outer', // You can also set 'Middle', 'Bottom', etc.
        font: {
          fontWeight: '600',
          color: 'white', // Text color
          size: '2rem',
          margin: { top: 10, right: 10 },
          // Text size}
        },
      },
      margin: { top: 10, right: 10 },
      //
      position: 'Outside',
    };

    // set thời gian call api
    this.channel = this.supabaseService
      .getSupabase()
      .channel('schema-db-changes-10')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'TCTT_TinBaiDangChuY' },
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
        this.selectedOption === '1';
        this.updateData();
        this.updateRangeData();
      });
  }

  lineChartOption: EChartsOption = {
    grid: {
      left: '5px',
      right: 0,
      top: '15%',
      bottom: 0,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      axisLine: { show: false }, 
      axisTick: { show: false }, 
      axisLabel: { show: true, fontSize: 18, fontWeight: 500, color: '#000' },
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Revenue',
        type: 'line',
        data: [150, 230, 224, 218, 135],
        lineStyle: {
          width: 3, 
          color: 'red' 
        },
        symbol: 'circle',
        symbolSize: 14,
        itemStyle: {
          color: 'rgba(210, 0, 26, 1)',
          borderWidth: 3,
          borderColor: '#fff' // Viền trắng để nổi bật hơn
        },
        // label: {
        //   show: true, // Hiển thị giá trị trên từng điểm
        //   position: 'top',
        //   fontSize: 12,
        //   color: '#333'
        // }
      }
    ]
  };

  private convertFormatRangeDate(value: string | Date) {
    const dateObj = new Date(value);

    // Extract the day and month
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1; // Months are zero-indexed

    // Format the date as "13/8"
    const formattedDate = `${day}/${month}`;
    return formattedDate;
  }

  private getCssVariable(selector: string, variable: string): string {
    const element = document.querySelector(selector);
    if (element) {
      return getComputedStyle(element).getPropertyValue(variable).trim();
    }
    return '';
  }

  public textRender(args: ITextRenderEventArgs | any): void {
    if (
      convertFormatDateTimeTctt(this.selectedStartDate) === args.point.x ||
      convertFormatDateTimeTctt(this.selectedEndDate) === args.point.x
    ) {
      args.border = {
        width: 1.5,
        color: 'yellow',
      };
      args.color = 'yellow';
    }
    if (args.text === '0') {
      args.text = '';
    }
    if (
      args.point.x ===
      `${this.convertFormatRangeDate(
        this.selectedStartDate,
      )}-${this.convertFormatRangeDate(this.selectedEndDate)}` &&
      this.selectedOption === '2'
    ) {
      args.border = {
        width: 1.5,
        color: 'yellow',
      };
      args.color = 'yellow';
    }
  }

  handleRadioChange(selectedOption: string) {
    this.selectedOption = selectedOption;

    // Implement your logic based on the selected option
    if (selectedOption === '1') {
      this.updateData();
    } else if (selectedOption === '2') {
      this.updateRangeData();
      // Logic for option 2
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.isActive = true;
  }

  ngOnDestroy() {
    // Xóa setInterval khi component bị hủy
  }

  private updateData() {
    this.supabaseService
      .tctt_ty_le_bai_viet_tieu_cuc(
        this.selectedStartDate,
        this.selectedEndDate,
      )
      .then((data) => {
        if (data.length > 10) {
          this.selectedOption = '2';
          this.updateRangeData();
        } else {
          this.chartData = data
            .map((item: any) => {
              this.selectedOption = '1';

              return {
                ...item,
                markerLine: item.highlight
                  ? {
                    visible: true,
                    shape: 'Diamond',
                    fill: 'red',
                  }
                  : {
                    visible: true,
                    shape: 'Circle',
                    fill: 'blue',
                  },
              };
            })
            .filter((item: any) => item.tile !== 0);
        }
        // Process data to add dynamic marker configuration

        this.cdr.markForCheck();
      })
      .catch((error) => {
        console.error('Error fetching chart data: ', error);
      })
      .finally(() => {
        this.cdr.markForCheck();
      });
  }

  private updateRangeData() {
    this.supabaseService
      .tctt_ti_le_tieu_cuc_theo_khoang(
        this.selectedStartDate,
        this.selectedEndDate,
      )
      .then((data: any) => {
        // Process data to add dynamic marker configuration
        this.chartData = data.map((item: any) => {
          return {
            ...item,
            markerLine: item.highlight
              ? {
                visible: true,
                shape: 'Diamond',
                fill: 'red',
              }
              : {
                visible: true,
                shape: 'Circle',
                fill: 'blue',
              },
          };
        });

        this.cdr.markForCheck();
      })
      .catch((error) => {
        console.error('Error fetching chart data: ', error);
      })
      .finally(() => {
        this.cdr.markForCheck();
      });
  }

  togglePopup(isPopupVisible: boolean, typePopup: string) {
    this.popupToggled.emit({ isPopupVisible, typePopup });
  }
}
