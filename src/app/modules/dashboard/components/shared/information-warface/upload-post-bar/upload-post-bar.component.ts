import {
  Component,
  inject,
  OnInit,
  Output,
  Input,
  EventEmitter,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BarSeriesService,
  CategoryService,
  ChartModule,
  DataLabelService,
  DateTimeService,
  ITextRenderEventArgs,
  LegendService,
  MultiColoredLineSeriesService,
  TooltipService,
} from '@syncfusion/ej2-angular-charts';
import { PayloadChannelData } from '../../../../models/payload-channel';
import {
  formatNumberWithDot,
  getDateRangePayload,
} from 'src/app/_metronic/layout/core/common/common-utils';
import { SupabaseKQDangTaiService } from './services/supabase.service';
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
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
@Component({
  selector: 'app-upload-post-bar',
  standalone: true,
  imports: [CommonModule, ChartModule, NgxEchartsDirective],
  providers: [
    DateTimeService,
    MultiColoredLineSeriesService,
    CategoryService,
    DataLabelService,
    BarSeriesService,
    LegendService,
    TooltipService,
    provideEcharts()
  ],
  templateUrl: './upload-post-bar.component.html',
  styleUrls: ['./upload-post-bar.component.scss'],
})
export class UploadPostBarComponent implements OnInit, OnDestroy {
  @Output() popupToggled = new EventEmitter<{
    isPopupVisible: boolean;
    typePopup: string;
  }>();
  private colorChart: string;
  get payload(): any {
    return this._payload;
  }

  @Input() set payload(value: any) {
    this._payload = value;
  }
  @Input() isShowKQDangTai: boolean;
  private _payload: PayloadChannelData;
  //basic color
  public basicColor: string;

  public uploadPostPrimaryXAxis: any;
  public uploadPostTitle: string;
  uploadPostPrimaryYAxis: any;
  public uploadPostColorMapping: Object;
  private supabaseService = inject(SupabaseKQDangTaiService);
  public Marker: Object;
  private eventSubject = new Subject<any>();
  private channel: any;
  public totalCount: string;

  isActive: boolean = false;
  selectedStartDate: string | Date;
  selectedEndDate: string | Date;

  private cdr = inject(ChangeDetectorRef);

  uploadPostData$: Observable<any>;
  uploadPostDataDetail$: Observable<any>;
  date$: Observable<any>;

  constructor(private store: Store) {}

  async ngOnInit(): Promise<void> {
    this.date$ = this.store.select(selectDateV2).pipe(
      filter((date) => !!(date && date.startDate && date.endDate)),
      tap((date) => {
        // DO sth
        const { startDate, endDate } = getDateRangePayload(
          date.startDate!,
          date.endDate!,
          '1',
        );
        this.selectedStartDate = startDate;
        this.selectedEndDate = endDate;

        this.uploadPostData$ = this.getUploadPostData(startDate, endDate);
        this.uploadPostDataDetail$ = this.getChiTietKetQuaData(
          startDate,
          endDate,
        );
      }),
    );
    //upload post bar var
    this.colorChart = this.getCssVariable('body', '--colorText');
    this.uploadPostPrimaryXAxis = {
      valueType: 'Category',
      title: '',
      labelStyle: {
        size: '3rem', // Change this to the desired font size
        fontWeight: 'bold',
        color: this.colorChart, // Make the labels bold
      },
    };
    this.uploadPostPrimaryYAxis = {
      labelStyle: {
        color: this.colorChart, // Make the labels bold
      },
    };
    this.Marker = {
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

    this.channel = this.supabaseService
      .getSupabase()
      .channel('schema-db-changes-10')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'TCTT_DonVi' },
        (payload) => {
          this.eventSubject.next(payload);
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'TCTT_KenhTuyenTruyen' },
        (payload) => {
          this.eventSubject.next(payload);
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'TCTT_TinBaiTuyenTruyen' },
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
        this.uploadPostData$ = this.getUploadPostData(
          this.selectedStartDate,
          this.selectedEndDate,
        );
        this.uploadPostDataDetail$ = this.getChiTietKetQuaData(
          this.selectedStartDate,
          this.selectedEndDate,
        );
      });

    this.uploadPostColorMapping = 'color';
    this.basicColor = '#4f8e6b';
  }

  resultUploadChartOption: EChartsOption = {
    grid: {
      left: '5px',
      right: '5%',
      top: '10%',
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
      type: 'value', 
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: true, fontSize: 12, fontWeight: 500, color: 'rgba(137, 141, 143, 1)' },
    },
    yAxis: {
      type: 'category',
      data: ['Facebook', 'Tiktok', 'Youtube'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: true, fontSize: 18, fontWeight: 500, color: '#000' },
    },
    series: [
      {
        name: 'Sales',
        type: 'bar',
        data: [20, 15, 10],
        barWidth: '64%', 
        label: {
          show: true,
          position: 'right', 
          fontSize: 18,
          fontWeight: 500,
          color: '#000'
        },
        itemStyle: {
          borderRadius: [8, 8, 8, 8], 
          color: 'rgba(52, 131, 251, 1)'
        }
      }
    ]
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

  getUploadPostData(
    startDate: string | Date,
    endDate: string | Date,
  ): Observable<any> {
    return from(this.supabaseService.tctt_kq_dang_tai(startDate, endDate)).pipe(
      tap((data: any) => {
        let tmpTotalCount: number = 0;
        tmpTotalCount = data?.reduce(
          (total: number, item: any) => total + item.soluong,
          0,
        );

        this.totalCount = formatNumberWithDot(tmpTotalCount);

        // Function to assign colors based on index
        const assignColor = (index: number): string => {
          const colors = [
            'rgb(2,129,49)',
            'rgb(9,94,203)',
            'rgba(148, 8, 8, 1)',
            'rgb(201,123,45)',
          ]; // Example colors
          return colors[index % colors.length];
        };

        const dataWithColors = data.map((item: any, index: number) => ({
          ...item,
          color: assignColor(index),
        }));

        return dataWithColors;
      }),
      finalize(() => this.cdr.markForCheck()),
    );
  }

  getChiTietKetQuaData(
    startDate: Date | string,
    endDate: Date | string,
  ): Observable<any> {
    return from(
      this.supabaseService.tctt_chi_tiet_kq_dang_tai(startDate, endDate),
    ).pipe(
      map((data: any) => data),
      catchError((error) => {
        console.error('Error fetching chỉ thị:', error);
        return of([]); // Return an empty array in case of error
      }),
    );
  }

  togglePopup(isPopupVisible: boolean, typePopup: string) {
    this.popupToggled.emit({ isPopupVisible, typePopup });
  }

  public textRender(args: ITextRenderEventArgs | any): void {
    args.text = `${formatNumberWithDot(args.text)}`;
  }
}
