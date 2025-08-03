import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { BarSeriesOption, EChartsOption } from 'echarts';
import { CommonModule } from '@angular/common';
// import { ExploitLevelChartConfig } from './exploit-level-chart.config';
import { StackChartConfig } from './stack-chart.config';
@Component({
  selector: 'app-stack-chart-hori',
  standalone: true,
  imports: [NgxEchartsDirective, CommonModule],
  providers: [provideEcharts()],
  templateUrl: './stack-chart-hori.component.html',
  styleUrls: ['./stack-chart-hori.component.scss'],
})
export class StackChartHori implements OnChanges {
  @Input() config!: StackChartConfig;

  barChartOptions: EChartsOption = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.updateChart();
    }
  }

  updateChart(): void {
    if (!this.config || !this.config.series || !this.config.categories) return;

    this.barChartOptions = {
      tooltip: {
        trigger: 'item',
        axisPointer: { type: 'shadow' },
        formatter: this.config.tooltipFormatter
          ? this.config.tooltipFormatter
          : (params: any) => {
              const param = params[0];
              return `X: ${param.value} báo cáo ${param.seriesName}`;
            },
      },
      legend: {
        show: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        itemWidth: 10, // icon tròn nhỏ gọn
        itemHeight: 10,
        icon: 'circle',
        padding: 8,
        textStyle: {
          fontSize: 22,
          fontWeight: 500,
          fontFamily: 'Inter, sans-serif', // hoặc font bạn muốn
          color: '#080808',
        },
        formatter: this.config.legendFormatter
          ? this.config.legendFormatter
          : (name: string) => {
              return name;
            },
      },
      grid: {
        left: '3%',
        right: '4%',
        top: '5%',
        bottom: '9%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: this.config.categories,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          show: true,
          fontSize: 22,
          fontWeight: 500,
          color: '#080808',
          margin: 24,
          fontFamily: 'Inter, sans-serif', // hoặc font bạn muốn
        },
      },
      yAxis: {
        type: 'value',
      },
      series: this.generateStackedSeries(),
    };
  }

  generateStackedSeries(): BarSeriesOption[] {
    return this.config.series.map((item: any, index: any, array: any) => ({
      name: item.name,
      type: 'bar',
      stack: item?.stack
        ? item.stack
        : this.config.isStacked
        ? 'total'
        : undefined, // << tùy theo isStacked
      emphasis: { focus: 'self' },
      // barCategoryGap: '50%',

      label: {
        show: true, // Bật hiển thị số
        position: 'inside', // Hoặc 'top', 'inside', 'insideRight' tùy bạn
        fontSize: 20,
        fontWeight: 'normal',
        color: '#fff', // màu chữ
        fontFamily: 'Inter, sans-serif;', // hoặc font bạn muốn
      },
      barCategoryGap: '35%',
      itemStyle: {
        // borderRadius: [
        //   index === 0 ? 8 : 0,
        //   index === array.length - 1 ? 8 : 0,
        //   index === array.length - 1 ? 8 : 0,
        //   index === 0 ? 8 : 0,
        // ],
        color: item.color,
      },
      data: item.data,
    }));
  }

  get chartHeight(): string {
    return this.config?.height || '500px';
  }
}
