import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { BarSeriesOption, EChartsOption } from 'echarts';
import { CommonModule } from '@angular/common';
// import { ExploitLevelChartConfig } from './exploit-level-chart.config';
import { StackChartConfig } from './stack-chart.config';
@Component({
  selector: 'app-stack-chart',
  standalone: true,
  imports: [NgxEchartsDirective, CommonModule],
  providers: [provideEcharts()],
  templateUrl: './stack-chart.component.html',
  styleUrls: ['./stack-chart.component.scss']
})
export class StackChart implements OnChanges {
  @Input() config!: StackChartConfig;
  @Input() isShowHeader: boolean = true; // Table title
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
              // console.log(param);
              
              const param = params[0];
              return `X: ${param.value} báo cáo ${param.seriesName}`;
            }
      },
      legend: {
        show: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 10,
        //  itemGap: 40,
        // itemWidth: 200,
        textStyle: {
          fontSize: 20,
          fontWeight: 500,
           width: 400,
        },
        icon: 'circle',
        formatter: (name: string) => {
          const item = this.config.series.find((s: any) => s.name === name);
          
          if (this.config.isStacked) {
            // Nếu là stack, tính tổng các giá trị
            if (item?.data) {
              const total = item.data.reduce((sum: any, val: any) => sum + val, 0);
              return `${name}(${total})`;
            }
          } else {
            // Nếu không phải stack, chỉ hiển thị tổng giá trị của series (dữ liệu của series đó)
            if (item?.data) {
              const total = item.data.length; // Hoặc nếu muốn hiển thị tổng số phần tử, bạn có thể tính length của array.
              return `${name}: ${total} phần tử`;
            }
          }
          return name;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        top: '5%',
        bottom: !this.config.isStacked ? '6%' : '20%',
        containLabel: true
      },
      yAxis: {
        type: 'category',
        data: this.config.categories,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          show: true,
          fontSize: 20,
          fontWeight: 500,
          color: '#000'
        }
      },
      xAxis: {
        type: 'value'
      },
      series: this.generateStackedSeries()
    };
  }

  generateStackedSeries():BarSeriesOption[] {
    return this.config.series.map((item:any, index:any, array:any) => ({
      name: item.name,
      type: 'bar',
      stack: this.config.isStacked ? 'total' : undefined, // << tùy theo isStacked
      emphasis: { focus: 'self' },
      label: {
        show: this.config.isShowLabel === false ? false:true,          // Bật hiển thị số
        position: 'inside',  // Hoặc 'top', 'inside', 'insideRight' tùy bạn
        fontSize: 20,
        fontWeight: 'normal',
        color: '#fff',
        formatter: (params: any) => {
          return params.value === 0 ? '' : params.value;
        }        // màu chữ
      },
      barCategoryGap: '35%',
      center: ['50%', '50%'],
      itemStyle: {
        borderRadius: [
          index === 0 ? 4 : 0,
          index === array.length - 1 ? 4 : 0,
          index === array.length - 1 ? 4 : 0,
          index === 0 ? 4 : 0,
        ],
        color: item.color,
        ...item.itemStyle
      },
      data: item.data
    }));
  }

  get chartHeight(): string {
    return this.config?.height || '500px';
  }
}
