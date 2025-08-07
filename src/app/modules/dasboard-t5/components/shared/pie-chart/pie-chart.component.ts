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
  imports: [NgxEchartsDirective]
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
      left: '0',
      right: '12px',
      top: '20%',
      // bottom: 0,
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
      axisLabel: { show: true, fontSize: 22, fontWeight: 500, color: '#000' },
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Sales',
        type: 'bar',
        data: [
          { value: 30, name: 'Tích cực', itemStyle: { color: 'rgba(28, 155, 83, 1)' } },
          { value: 30, name: 'Trung lập', itemStyle: { color: 'rgba(52, 131, 251, 1)' } },
          { value: 40, name: 'Cần xác minh', itemStyle: { color: 'rgba(210, 0, 26, 1)' } },
        ],
        // barWidth: '50%',

        label: {
          show: true,
          position: 'top',
          fontSize: 22,
          fontWeight: 500,
          color: '#000'
        },
        itemStyle: {
          borderRadius: [8, 8, 8, 8],
          color: 'rgba(210, 0, 26, 1)'
        }
      }
    ],

  };
  updateChart(): void {
    if (!this.config || !this.config.data) {
      return;
    }

    this.pieChartOptions = {
      title: {
        text: this.config.title || '',
        // left: 'center',
        // bottom: 0, // 👈 đặt xuống dưới biểu đồ
        textStyle: {
          fontSize: 22,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ',

      },
      label: {
        show: true,
        position: 'outside',
        formatter: function (params: any) {
          // console.log(params);
          const value = params.value;
          const percent = Math.round(params.percent); // 👈 Làm tròn đến hàng đơn vị
          return `${value}\n${percent}%`;
        }, // 👈 chính là dòng này hiển thị dữ liệu
        fontSize: 22 // (optional) tăng size cho dễ nhìn
      },
      labelLine: {
        show: true,
        length: 22,
        length2: 10,
        lineStyle: {
          width: 1,
        },
      },
      legend: {
        show: this.config.legend,
        // orient: 'horizontal',
        orient: this.config.legendPosition === "left" ? 'vertical':"horizontal", // legend dọc
        left: this.config.legendPosition === "left" ? '10%' : 'center', // căn trái nếu là vertical
        // left: 'center',
        bottom: this.config.legendPosition === "left" ? "40%" : '0',
        itemWidth: 14,
        itemHeight: 14,
        // itemGap: 40,
        textStyle: {
          fontSize: 22,
          fontWeight: 500
        },
        icon: 'circle',
        // formatter: (name: string) => {
        //   const seriesData = (this.config.data as any[])[0]?.data;
        //   const item = seriesData?.find((d: any) => d.name === name);
        //   return `${name}: ${item?.value}`;
        // }
      },

      color: this.config.colors?.length ? this.config.colors : undefined,
      series: [
        {
          name: this.config.title || 'Pie Chart',
          type: 'pie',

          radius: this.config.radius || '50%',
          avoidLabelOverlap: true,

          center: this.config.legendPosition === "left" ? ['50%', '50%'] : ['50%', '50%'], // căn giữa nếu là horizontal
          label: {
            show: true,
            position: this.config.showLabelInside === false ? 'outer' : 'inside',
            fontSize: 22,
          },
          labelLayout: {
            hideOverlap: true
          },

          data: this.config.data
        }
      ],
      graphic: [
        {
          type: 'text',
          left: this.config.legendPosition === "left" ? 'center' : 'center',
          top: 'middle',
          style: {
            text: this.config.data.reduce((accumulator: any, currentValue) => accumulator + currentValue.value, 0),
            // textAlign: 'center',
            fill: '#000',
            fontSize: 36,
            fontWeight: 700
          }
        }
      ]
    };
  }

  get chartHeight(): string {
    return this.config?.height || '400px';
  }
}
