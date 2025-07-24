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
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';

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
  statisticDomainChartOption: EChartsOption;

  public border: Object = {
    width: 2,
    radius: 10, // Apply border-radius here
  };
  ngOnInit(): void {
    this.chartData = this.columnData;
    this.primaryXAxis = {
      valueType: 'Category',
      title: '',
      labelStyle: {
        size: '3em',
      },
    };
    this.primaryYAxis = {
      labelStyle: {
        size: '3em',
      },
      plotOffsetTop: 13,
      plotOffsetLeft: 5,
    };
    this.dataLabel = {
      visible: true,
      position: 'Outer',
      font: {
        fontWeight: '24px',
        color: '#000000',
        size: '30px',
      },
    };

    this.marker = {
      dataLabel: this.dataLabel,
    };
  }
  async ngOnChanges(changes: SimpleChanges) {
    if (this.columnData) {
      this.chartData = this.columnData;
    }
    this.statisticDomainChartOption = {
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
        data: ['Miền Bắc', 'Miền Trung', 'Miền Nam'],
        axisLine: { show: false }, 
        axisTick: { show: false },
        axisLabel: { show: true, fontSize: 18, fontWeight: 500, color: '#000' },
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Số lượng',
          type: 'bar',
          data: [20, 15, 10],
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
          name: 'Số lượng',
          type: 'bar',
          data: [10, 35, 20],
          label: {
            show: true,
            position: 'top',
            fontSize: 18,
            fontWeight: 500,
            color: '#000'
          },
          itemStyle: {
            borderRadius: [8, 8, 8, 8],
            color: '#F29F06'
          }
        }
      ]
    };
  }
  onTextRender(args: any): void {
    let point = args.point;
    args.text = `${formatNumber(Number(point?.y), 'vi-VN', '1.0-3')}`
  }
  protected readonly frozenHeight = frozenHeight;
}
