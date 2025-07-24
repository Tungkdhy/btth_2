import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AxisModel,
  BarSeriesService,
  CategoryService,
  ChartAnnotationService,
  ChartModule,
  ColumnSeriesService,
  DataLabelService,
  DateTimeService,
  ITextRenderEventArgs,
  LegendService,
  LineSeriesService,
  MultiLevelLabelService,
  RangeColumnSeriesService,
  ScrollBarService,
  SelectionService,
  StackingColumnSeriesService,
  TooltipService,
} from '@syncfusion/ej2-angular-charts';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { isNullStringData } from 'src/app/_metronic/layout/core/common/common-utils';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { formatNumberWithDot } from 'src/app/modules/digital-map/services/utils';
import { BreadcrumLeftRightComponent } from "../../../shared/breadcrum-left-right/breadcrum-left-right.component";
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';

@Component({
  selector: 'app-overview-tctt',
  templateUrl: './overview-tctt.component.html',
  styleUrls: ['./overview-tctt.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    TreeViewModule,
    GridModule,
    ChartModule,
    TreeGridModule,
    BreadcrumLeftRightComponent,
    NgxEchartsDirective
  ],
  providers: [
    CategoryService,
    BarSeriesService,
    ColumnSeriesService,
    LineSeriesService,
    DataLabelService,
    MultiLevelLabelService,
    SelectionService,
    CategoryService,
    DateTimeService,
    ScrollBarService,
    LineSeriesService,
    ColumnSeriesService,
    ChartAnnotationService,
    RangeColumnSeriesService,
    StackingColumnSeriesService,
    LegendService,
    TooltipService,
    provideEcharts()
  ],
  standalone: true,
})
export class OverviewTcttComponent implements OnInit, OnChanges {
  @Input() startDate: string;
  @Input() endDate: string;

  @Output() togglePopupEvent = new EventEmitter<boolean>();

  private supabaseService = inject(SupabaseService);

  public primaryXAxis: AxisModel;
  public primaryYAxis: AxisModel;
  public ct86Marker: any;
  public statisticData: any[] = [];
  public statisticRangeData: any[] = [];
  public title?: string;
  public statisticCT86ChartOption: EChartsOption;
  public statisticTargetByTimeChartOption: EChartsOption;
  public statisticCT86DataChart: any;
  public statisticTargetByTimeDataChar:any;
  private baseStatisticChartOption: any = {
    grid: {
      left: '5px',
      right: 0,
      top: '8%',
      bottom: '10%',
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
      data: [],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        show: true, fontSize: 18, fontWeight: 500, color: '#000',
      },
    },
    yAxis: {
      type: 'value'
    },
    series: [],
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
    },
  };

  platformType = {
    YOUTUBE: 'Youtube',
    FACEBOOK: 'Facebook',
    BAO_DIEN_TU: 'Các trang báo điện tử',
  };

  unitType = {
    TT186: 'Trung tâm 186',
    TT286: 'Trung tâm 286',
    TT386: 'Trung tâm 386',
  };

  dateType = {
    DAY: '1',
    WEEK: '2',
    MONTH: '3',
    YEAR: '4',
  };
  dateRangeArr: any[] = [
    { label: 'Theo ngày', value: this.dateType.DAY },
    { label: 'Theo tuần', value: this.dateType.WEEK },
    { label: 'Theo tháng', value: this.dateType.MONTH },
    { label: 'Theo năm', value: this.dateType.YEAR },
  ];
  selectedDateRange: string = this.dateType.DAY;

  isPopupVisible: boolean = false;

  private cdr = inject(ChangeDetectorRef);

  constructor() { }

  async ngOnInit(): Promise<any> {
    this.primaryXAxis = {
      valueType: 'Category',
      labelIntersectAction: 'Wrap',
      labelStyle: {
        size: '2.5rem',
        fontWeight: 'bold',
      },
    };
    this.primaryYAxis = {
      minimum: 0,
      labelStyle: {
        size: '2rem',
      },
      rangePadding: 'Additional',
    };

    this.ct86Marker = {
      dataLabel: {
        visible: true,
        position: 'Outer', // You can also set 'Middle', 'Bottom', etc.
        font: {
          fontWeight: '500',
          size: '2.5rem', // Text size
        },
      },
    };

    await this.updateData();
    await this.updateRangeStatisticData(this.selectedDateRange);
    this.cdr.detectChanges();
  }

  findCreateUnitEntry(unitName: string) {
    let entry: any = this.statisticData.find(
      (item) => item.tendonvi === unitName,
    );
    if (!entry) {
      entry = {
        tendonvi: unitName,
        soluong_youtube: 0,
        soluong_facebook: 0,
        soluong_bao: 0,
      };
      this.statisticData.push(entry);

      this.cdr.markForCheck();
    }
    return entry;
  }

  findCreateTimeRangeEntry(time: string) {
    let entry: any = this.statisticRangeData.find(
      (item) => item.thoigian === time,
    );
    if (!entry) {
      entry = {
        thoigian: time,
        soluong_t1: 0,
        soluong_t2: 0,
        soluong_t3: 0,
      };
      this.statisticRangeData.push(entry);

      this.cdr.markForCheck();
    }
    return entry;
  }

  async updateData() {
    await this.supabaseService
      .tctt_thong_ke_doi_tuong_ct86_theo_don_vi()
      .then((data) => {
        const convertedNullData = data?.filter(
          (item: any) =>
            !isNullStringData(item.tendonvi) &&
            !isNullStringData(item.tennentang),
        );
        convertedNullData?.forEach((item: any) => {
          let entry = this.findCreateUnitEntry(item?.tendonvi);

          switch (item?.tennentang) {
            case this.platformType.YOUTUBE:
              entry.soluong_youtube = item?.soluong;
              break;
            case this.platformType.FACEBOOK:
              entry.soluong_facebook = item?.soluong;
              break;
            case this.platformType.BAO_DIEN_TU:
              entry.soluong_bao = item?.soluong;
              break;
          }
        });
        this.statisticCT86DataChart = [
          {
            name: 'YouTube',
            color: '#1C9B53',
            data: this.statisticData.map((item: any) => item.soluong_youtube ?? 0),
          },
          {
            name: 'Facebook',
            color: '#3483FB',
            data: this.statisticData.map((item: any) => item.soluong_facebook ?? 0),
          },
          {
            name: 'Báo điện tử',
            color: '#D2001A',
            data: this.statisticData.map((item: any) => item.soluong_bao ?? 0),
          }
        ];
        this.statisticCT86ChartOption = {
          ...this.baseStatisticChartOption,
          xAxis: {
            ...this.baseStatisticChartOption.xAxis,
            data: this.statisticData.map(item => item.tendonvi),
          },
          series: this.statisticCT86DataChart?.map((item: any) => ({
            name: item.name,
            type: 'bar',
            data: item.data,
            label: {
              show: true,
              position: 'top',
              fontSize: 18,
              fontWeight: 500,
              color: '#000'
            },
            itemStyle: {
              borderRadius: [8, 8, 8, 8],
              color: item.color
            }
          }))
        }
        this.cdr.markForCheck();
      })
      .finally(() => this.cdr.markForCheck());

  }

  public textRender(args: ITextRenderEventArgs | any): void {
    args.text = `${formatNumberWithDot(args.text)}`;
  }

  async updateRangeStatisticData(code: string) {
    await this.supabaseService
      .tctt_doi_tuong_ct86_phat_sinh_theo_don_vi(code)
      .then((data) => {
        this.statisticRangeData = [];
        const convertedNullData = data?.filter(
          (item: any) =>
            !isNullStringData(item.tendonvi) &&
            !isNullStringData(item.thoigian),
        );

        convertedNullData?.forEach((item: any) => {
          let entry = this.findCreateTimeRangeEntry(item?.thoigian);

          switch (item?.tendonvi) {
            case this.unitType.TT186:
              entry.soluong_t1 = item?.soluong;
              break;
            case this.unitType.TT286:
              entry.soluong_t2 = item?.soluong;
              break;
            case this.unitType.TT386:
              entry.soluong_t3 = item?.soluong;
              break;
          }
        });
        this.statisticTargetByTimeDataChar = [
          {
            name: 'Trung tâm 186',
            color: '#1C9B53',
            data: this.statisticRangeData.map((item: any) => item.soluong_t1 ?? 0),
          },
          {
            name: 'Trung tâm 286',
            color: '#3483FB',
            data: this.statisticRangeData.map((item: any) => item.soluong_t2 ?? 0),
          },
          {
            name: 'Trung tâm 386',
            color: '#D2001A',
            data: this.statisticRangeData.map((item: any) => item.soluong_t3 ?? 0),
          }
        ];
        this.statisticTargetByTimeChartOption = {
          ...this.baseStatisticChartOption,
          xAxis: {
            ...this.baseStatisticChartOption.xAxis,
            data: this.statisticRangeData.map(item => item.thoigian),
          },
          series: this.statisticCT86DataChart?.map((item: any) => ({
            name: item.name,
            type: 'bar',
            data: item.data,
            label: {
              show: true,
              position: 'top',
              fontSize: 18,
              fontWeight: 500,
              color: '#000'
            },
            itemStyle: {
              borderRadius: [8, 8, 8, 8],
              color: item.color
            }
          }))
        }
        this.cdr.markForCheck();
      });
  }



  async onChartTypeChange(event: any): Promise<any> {
    await this.updateRangeStatisticData(this.selectedDateRange);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }
}
