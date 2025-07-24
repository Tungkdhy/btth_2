import {
  ChangeDetectorRef,
  Component,
  inject,
  Output,
  EventEmitter,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AxisModel,
  CategoryService,
  ChartModule,
  ColumnSeriesService,
  DataLabelService,
  ITextRenderEventArgs,
  LegendService,
  TooltipService,
} from '@syncfusion/ej2-angular-charts';
import { PayloadChannelData } from '../../../../models/payload-channel';
import {
  formatNumberWithDot,
  getAreaPayload,
  getDateRangePayload,
  isNaNDateFormat,
} from 'src/app/_metronic/layout/core/common/common-utils';
import { SupabaseChuDeNongService } from './services/supabase.service';
import {
  catchError,
  debounceTime,
  filter,
  from,
  map,
  Observable,
  of,
  Subject,
  tap,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { selectDateV2 } from 'src/app/store/date-time-range-v2/date-time-range-v2.selectors';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';

@Component({
  selector: 'app-hot-topic',
  standalone: true,
  imports: [CommonModule, ChartModule, FormsModule, NgxEchartsDirective],
  providers: [
    ColumnSeriesService,
    CategoryService,
    DataLabelService,
    LegendService,
    TooltipService,
    provideEcharts()
  ],
  templateUrl: './hot-topic.component.html',
  styleUrls: ['./hot-topic.component.scss'],
})
export class HotTopicComponent implements OnInit, OnChanges {
  private colorChart: string;
  get payload(): any {
    return this._payload;
  }

  @Input() set payload(value: any) {
    this._payload = value;
  }
  @Input() isShowChuDeNong: boolean;

  private _payload: PayloadChannelData;
  @Output() popupToggled = new EventEmitter<{
    isPopupVisible: boolean;
    typePopup: string;
  }>();

  //basic color
  //hot topic column var
  public hotTopicPrimaryXAxis: AxisModel;
  public hotTopicData?: Promise<any[]>;
  public diemTinData?: Promise<any[]>;
  public hotTopicList?: Promise<any[]>; //danh sách chủ đề
  public tongquanChuDeList?: Promise<any[]>; //tổng quan theo chủ đề
  public hotTopicTitle: string;
  hotTopicPrimaryYAxis: any;
  public hotTopicPointMapping: Object;
  public hotTopicMarker: Object;
  public totalCollectData: string;
  private supabaseService = inject(SupabaseChuDeNongService);
  private cdr = inject(ChangeDetectorRef);
  private eventSubject = new Subject<any>();
  private channel: any;

  isActive: boolean = false;
  previousPayloadValue: any;
  selectedStartDate: Date | string;
  selectedEndDate: Date | string;
  selectedArea: string;

  date$: Observable<any>;
  thongKeChuDeNong$: Observable<any>;

  public isFormVisible = false;

  border = {};

  constructor(private store: Store) {}

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
        this.selectedStartDate = startDate;
        this.selectedEndDate = endDate;
        this.thongKeChuDeNong$ = this.getThongKeChuDeNongObs(
          startDate,
          endDate,
        );
        if (!isNaNDateFormat(startDate, endDate)) {
          this.updateData();
        }
      }),
    );

    this.colorChart = this.getCssVariable('body', '--colorText');

    // hot topic column var
    this.hotTopicPrimaryXAxis = {
      valueType: 'Category',
      title: '',
      labelStyle: {
        size: '2.5rem', // Change this to the desired font size
        fontWeight: 'bold',
        color: this.colorChart,
      },
    };
    this.hotTopicPrimaryYAxis = {
      minimum: 0,
      labelStyle: {
        size: '2rem', // Change this to the desired font size
        fontWeight: 'bold',
        color: this.colorChart,
      },
      plotOffsetTop: 13,
      plotOffsetLeft: 5,
      rangePadding: 'Additional',
    };
    this.hotTopicMarker = {
      dataLabel: {
        visible: true,
        position: 'Middle', // You can also set 'Middle', 'Bottom', etc.
        font: {
          fontWeight: '100',
          color: this.colorChart, // Text color
          size: '2.5rem', // Text size
        },
        template:
          '<div class=\'fw-bold custom-color-text\' style="margin-bottom: 0.2em;">${point.y}</div>', // Custom template for data label
      },
    };
    this.hotTopicPointMapping = 'color';

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
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'TCTT_ChuDe' },
        (payload) => {
          this.eventSubject.next(payload);
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'TCTT_ChuDe_Ngay' },
        (payload) => {
          this.eventSubject.next(payload);
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'TCTT_ChuDe_TongHopNgay' },
        (payload) => {
          this.eventSubject.next(payload);
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'TCTT_TongHop' },
        (payload) => {
          this.eventSubject.next(payload);
        },
      )
      .subscribe();

    this.eventSubject
      .pipe(debounceTime(10 * 1000))
      .subscribe(async (payload) => {
        this.updateData();
      });
  }

  hotTopicChartOption: EChartsOption = {
    grid: {
      left: '5px', 
      right: 0, 
      top: '15%',  
      bottom: 0,
      containLabel: true 
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar'],
      axisLine: { show: false }, // Ẩn đường trục X
      axisTick: { show: false }, // Ẩn vạch nhỏ trên trục X
      axisLabel: { show: true, fontSize: 18, fontWeight: 500, color: '#000' },
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Sales',
        type: 'bar',
        data: [20, 15, 10],
        barWidth: '50%',
        label: {
          show: true, 
          position: 'top',
          fontSize: 18,
          fontWeight: 500,
          color: '#000'
        },
        itemStyle: {
          borderRadius: [8, 8, 8, 8], 
          color: 'rgba(210, 0, 26, 1)'
        }
      }
    ]
  };


  public textRender(args: ITextRenderEventArgs | any): void {
    args.text = `${formatNumberWithDot(args.text)}`;
  }

  private getCssVariable(selector: string, variable: string): string {
    const element = document.querySelector(selector);
    if (element) {
      return getComputedStyle(element).getPropertyValue(variable).trim();
    }
    return '';
  }
  togglePopup(isPopupVisible: boolean, typePopup: string) {
    this.popupToggled.emit({ isPopupVisible, typePopup });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.payload && !changes.payload.firstChange) {
      const currentValue = changes.payload.currentValue;

      // Nếu payload thay đổi liên quan đến `Area`
      if (this.isAreaPayload(currentValue)) {
        this.isActive = true;
        const area = getAreaPayload(currentValue.payload.data);
        this.updateData(); // Cập nhật dữ liệu với Area mới
      } else {
        this.isActive = false;
      }
    }
  }

  private isAreaPayload(payload: any): boolean {
    return payload && payload.payload.type === 'area';
  }

  ngOnDestroy() {}

  private updateData() {
    this.supabaseService
      .tctt_tong_quan_theo_chu_de(this.selectedStartDate, this.selectedEndDate)
      .then((data) => {
        this.tongquanChuDeList = data;
      })
      .finally(() => {
        this.cdr.markForCheck();
      });

    this.supabaseService
      .tctt_danh_sach_chu_de(this.selectedStartDate, this.selectedEndDate)
      .then((data) => {
        this.hotTopicList = data;
      })
      .finally(() => {
        this.cdr.markForCheck();
      });

    this.supabaseService
      .tctt_danh_sach_diem_tin(this.selectedStartDate, this.selectedEndDate)
      .then((data) => {
        this.diemTinData = data;
      })
      .finally(() => {
        this.cdr.markForCheck();
      });
  }

  getThongKeChuDeNongObs(
    startDate: string | Date,
    endDate: string | Date,
  ): Observable<any> {
    return from(
      this.supabaseService.tctt_thong_ke_chu_de_nong(startDate, endDate),
    ).pipe(
      map((data: any) => {
        const assignColor = (index: number): string => {
          const colors = ['rgba(224, 92, 92, 1)'];
          return colors[index % colors.length];
        };

        const dataWithColors = data.map((item: any, index: number) => ({
          ...item,
          color: assignColor(index),
        }));

        const totalCollectData = data.reduce(
          (acc: number, item: any) => acc + item.thongke,
          0,
        );

        // Update component state
        this.totalCollectData = formatNumberWithDot(totalCollectData);

        return dataWithColors;
      }),
      catchError((error) => {
        console.error('Error fetching hot topic data:', error);
        return of([]); // Return empty array on error
      }),
    );
  }

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }
}
