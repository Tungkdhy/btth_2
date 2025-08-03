import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PipeChartConfig } from './pipe-chart.config';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
  providers: [provideEcharts()],
  standalone: true,
  imports: [NgxEchartsDirective],
})
export class PieChartComponent implements OnChanges {
  @Input() config!: PipeChartConfig;

  pieChartOptions: EChartsOption = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.updateChart();
    }
  }
  hotTopicChartOption: EChartsOption = {
    grid: {
      left: '5px',
      right: 0,
      top: '5%',
      bottom: 0,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar'],
      axisLine: { show: false }, // Ẩn đường trục X
      axisTick: { show: false }, // Ẩn vạch nhỏ trên trục X
      axisLabel: {
        show: true,
        fontSize: 20,
        fontWeight: 500,
        color: '#000',
        fontFamily: 'Inter, sans-serif',
      },
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Sales',
        type: 'bar',
        data: [
          {
            value: 30,
            name: 'Tích cực',
            itemStyle: { color: 'rgba(28, 155, 83, 1)' },
          },
          {
            value: 30,
            name: 'Trung lập',
            itemStyle: { color: 'rgba(52, 131, 251, 1)' },
          },
          {
            value: 40,
            name: 'Cần xác minh',
            itemStyle: { color: 'rgba(210, 0, 26, 1)' },
          },
        ],
        barWidth: '50%',

        label: {
          show: true,
          position: 'top',
          fontSize: 20,
          color: '#000',
          fontWeight: 500,
          fontFamily: 'Inter, sans-serif', // hoặc font bạn muốn
        },
        itemStyle: {
          borderRadius: [8, 8, 8, 8],
          color: 'rgba(210, 0, 26, 1)',
        },
      },
    ],
  };
  updateChart(): void {
    if (!this.config || !this.config.data) {
      return;
    }

    this.pieChartOptions = {
      title: {
        text: this.config.title || '',
        left: 'center',
        // bottom: 0, // 👈 đặt xuống dưới biểu đồ
        textStyle: {
          fontSize: 20,
          fontWeight: 'bold',
          fontFamily: 'Inter, sans-serif', // hoặc font bạn muốn
          color: '#080808',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ',
        textStyle: {
          fontFamily: 'Inter, sans-serif', // hoặc font bạn muốn
          color: '#080808',
        },
      },
      label: {
        show: true,
        position: 'outside',
        formatter: function (params: any) {
          console.log(params);
          const value = params.value;
          const percent = Math.round(params.percent); // 👈 Làm tròn đến hàng đơn vị
          return `${value}\n${percent}%`;
        }, // 👈 chính là dòng này hiển thị dữ liệu
        // fontSize: 20, // (optional) tăng size cho dễ nhìn
        fontFamily: 'Inter, sans-serif', // hoặc font bạn muốn
        color: '#080808',
      },
      labelLine: {
        show: true,
        length: 20,
        length2: 10,
        textStyle: {
          fontSize: 20,
          fontWeight: 500,
          fontFamily: 'Inter, sans-serif', // hoặc font bạn muốn
          color: '#080808',
          padding: 8,
        },
        lineStyle: {
          width: 1,
        },
      },
      legend: {
        show: this.config.legend,
        orient: 'horizontal',
        left: 'center',
        bottom: '15',
        itemWidth: 14,
        itemHeight: 14,
        // itemGap: 40,
        textStyle: {
          fontSize: 20,
          fontWeight: 500,
          fontFamily: 'Inter, sans-serif', // hoặc font bạn muốn
          color: '#080808',
          padding: 8,
        },
        icon: 'circle',
      },

      color: this.config.colors?.length ? this.config.colors : undefined,
      series: [
        {
          name: this.config.title || 'Pie Chart',
          type: 'pie',

          radius: this.config.radius || '50%',
          avoidLabelOverlap: true,

          center: ['50%', '50%'],
          label: {
            show: true,
            position:
              this.config.showLabelInside === false ? 'outer' : 'inside',
            fontSize: 20,
            fontFamily: 'Inter, sans-serif', // hoặc font bạn muốn
            color: '#080808',
          },
          labelLayout: {
            hideOverlap: true,
          },

          data: this.config.data,
        },
      ],
      graphic: [
        {
          type: 'text',
          left: 'center',
          top: 'middle',
          style: {
            text: this.config.data.reduce(
              (accumulator: any, currentValue) =>
                accumulator + currentValue.value,
              0,
            ),
            // textAlign: 'center',
            fill: '#000',
            fontSize: 40,
            fontWeight: 700,
            fontFamily: 'Inter, sans-serif', // hoặc font bạn muốn
          },
        },
      ],
    };
  }

  get chartHeight(): string {
    return this.config?.height || '400px';
  }
}
