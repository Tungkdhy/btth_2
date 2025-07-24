import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-horizontal-bar-chart',
  templateUrl: './bar-chart-hori.component.html',
  styleUrls: ['./bar-chart-hori.component.scss'],
  standalone: true,
  imports: []
})
export class HorizontalBarChartComponent implements OnInit {

  chartOptions: EChartsOption = {};

  ngOnInit(): void {
    this.chartOptions = this.getChartOptions();
  }

  getChartOptions(): EChartsOption {
    return {
      title: {
        text: '',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: ['H', 'MAI', 'IND', 'K', 'BRN', 'TAW', 'P', 'X']
      },
      series: [
        {
          type: 'bar',
          data: [0, 120, 50, 80, 60, 28, 20, 15],
          label: {
            show: true,
            position: 'inside',
            color: '#fff',
            fontWeight: 'bold'
          },
          itemStyle: {
            color: (params: any) => {
              const colors = [
                '#808080', '#8c8cfa', '#00c4cc', '#4CAF50',
                '#1b1c54', '#7c3d7b', '#a1668c', '#f5b041'
              ];
              return colors[params.dataIndex % colors.length];
            }
          },
          barWidth: '50%'
        }
      ]
    };
  }
}
