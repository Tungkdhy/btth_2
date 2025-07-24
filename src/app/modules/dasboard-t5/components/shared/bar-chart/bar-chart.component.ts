import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { CommonModule } from '@angular/common';
import { PipeChartConfig } from '../pie-chart/pipe-chart.config';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [NgxEchartsDirective, CommonModule],
  providers: [provideEcharts()],
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnChanges {
  @Input() config!: PipeChartConfig;

  barChartOptions: EChartsOption = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.updateChart();
    }
  }

  updateChart(): void {
    if (!this.config || !this.config.data) return;

    const categories = this.config.data.map((item: any) => item.name);
    const values = this.config.data.map((item: any, i: number) => ({
      value: item.value,
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color: this.config.colors?.[i % this.config.colors.length] || '#3398DB'
      }
    }));
    
    this.barChartOptions = {
      title: {
        text: this.config.title || '',
        bottom: 0,
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        top: 20,
        bottom: 60,
        left: '5%',
        right: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: {
          rotate: 45,
          fontSize: 14,
          color: '#000'
        },
        axisTick: { show: false },
        axisLine: { show: false }
      },
      yAxis: {
        type: 'value',
        axisLabel: { fontSize: 13 }
      },
      series: [
        {
          name: 'Số lượng',
          type: 'bar',
          barWidth: '50%',
          label: {
            show: true,
            position: 'top',
            fontSize: 14,
            fontWeight: 'bold',
            color: '#000'
          },
          data: values
        }
      ]
    };
    
  }

  get chartHeight(): string {
    return this.config?.height || '400px';
  }
}
