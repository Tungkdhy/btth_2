import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, formatNumber } from '@angular/common';
import {
  AccumulationDataLabelSettingsModel,
  AxisModel,
  CategoryService,
  ChartAnnotationService,
  ChartModule,
  ColumnSeriesService,
  DataLabelService,
  DateTimeService,
  LegendService,
  LineSeriesService,
  RangeColumnSeriesService,
  ScrollBarService,
  StackingColumnSeriesService,
  TooltipService,
} from '@syncfusion/ej2-angular-charts';
import { frozenHeight } from '@syncfusion/ej2-angular-grids';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

@Component({
  imports: [CommonModule, ChartModule, NgxEchartsDirective],
  providers: [
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
    DataLabelService,
    provideEcharts()
  ],
  selector: 'app-column-chart-left-panel',
  standalone: true,
  styleUrls: ['./column-chart-left-panel.component.scss'],
  templateUrl: './column-chart-left-panel.component.html',
})
export class ColumnChartLeftPanelComponent implements OnInit {
  @Input() columnData: any[];
  public primaryXAxis?: AxisModel;
  public chartData?: Object[];
  public title?: string;
  public dataLabel?: Object = [];
  public marker: Object;
  public primaryYAxis: AxisModel;
  statisticLevelStatusChartOption: EChartsOption;

  ngOnInit(): void {
    this.chartData = this.columnData;
    // this.primaryXAxis = {
    //   valueType: 'Category',
    //   title: '',
    //   labelStyle: {
    //     size: '3em',
    //   },
    // };
    // this.primaryYAxis = {
    //   labelStyle: {
    //     size: '3em',
    //   },
    //   plotOffsetTop: 13,
    //   plotOffsetLeft: 5,
    // };
    // this.dataLabel = {
    //   visible: true,
    //   position: 'Outer',
    //   font: {
    //     fontWeight: '24px',
    //     color: '#000000',
    //     size: '30px',
    //   },
    // };

    // this.marker = {
    //   dataLabel: this.dataLabel,
    // };
  }
  async ngOnChanges(changes: SimpleChanges) {
    if (this.columnData) {
      this.chartData = this.columnData;
      console.log("data: ", this.chartData);
    }
    this.statisticLevelStatusChartOption = {
      grid: {
        left: '5px',
        right: 0,
        top: '10%',
        bottom: '5%',
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
        data: this.chartData?.map((item: any) => item.name),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: true, fontSize: 18, fontWeight: 500, color: '#000' },
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Cấp 1',
          type: 'bar',
          data: this.chartData?.map((item: any) => item.connect),
          label: {
            show: true,
            position: 'top',
            fontSize: 18,
            fontWeight: 500,
            color: '#000'
          },
          itemStyle: {
            borderRadius: [8, 8, 8, 8],
            color: '#045E2B'
          }
        },
        {
          name: 'Cấp 2',
          type: 'bar',
          data: this.chartData?.map((item: any) => item.disconnect),
          label: {
            show: true,
            position: 'top',
            fontSize: 18,
            fontWeight: 500,
            color: '#000'
          },
          itemStyle: {
            borderRadius: [8, 8, 8, 8],
            color: '#D2001A'
          }
        },
      ]
    };
  }
  onTextRender(args: any): void {
    let point = args.point;
    args.text = `${formatNumber(Number(point?.y), 'vi-VN', '1.0-3')}`
  }
  protected readonly frozenHeight = frozenHeight;
}
