import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
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
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';

import { formatNumberWithDot } from 'src/app/_metronic/layout/core/common/common-utils';

@Component({
  selector: 'app-diem-nong-line-chart',
  templateUrl: './diem-nong-line-chart.component.html',
  styleUrls: ['./diem-nong-line-chart.component.scss'],
  providers: [
    ColumnSeriesService,
    CategoryService,
    DataLabelService,
    LegendService,
    TooltipService,
    provideEcharts()
  ],
  imports: [CommonModule, ChartModule, FormsModule, NgxEchartsDirective],
  standalone: true,
})
export class DiemNongLineChartComponent implements OnInit {
  @Input() statisticData: any[] = [];

  private colorChart: string;
  public chartPrimaryXAxis: AxisModel;
  public chartTitle: string;
  public chartPrimaryYAxis: any;
  public chartPointMapping: Object;
  public chartMarker: Object;
  diemNongBarChartOption: EChartsOption;
  ngOnInit(): void {
    this.chartPrimaryXAxis = {
      valueType: 'Category',
      title: '',
      labelStyle: {
        size: '2.5rem', // Change this to the desired font size
        fontWeight: 'bold',
        color: this.colorChart,
      },
    };
    this.chartPrimaryYAxis = {
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
    this.chartMarker = {
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
    this.chartPointMapping = 'color';
  }

  public textRender(args: ITextRenderEventArgs | any): void {
    args.text = `${formatNumberWithDot(args.text)}`;
  }
  ngOnChanges(changes: SimpleChanges) {
    this.diemNongBarChartOption = {
      grid: {
        left: '5px',
        right: 0,
        top: '8%',
        bottom: '2%',
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
        data: ['Đồng Nai', 'Bình Dương', 'Bình Phước', 'TP Hồ Chí Minh', 'Hưng Yên', 'Hà Nội'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: true, fontSize: 18, fontWeight: 500, color: '#000' },
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Hoạt động',
          type: 'bar',
          data: [20, 15, 10, 5, 40, 15],
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
          name: 'Không hoạt động',
          type: 'bar',
          data: [10, 35, 20, 12, 35, 80],
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
        }
      ]
    };
  }
}
