import { Component } from '@angular/core';
// import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { PieChartComponent } from '../../shared/pie-chart/pie-chart.component';
// import { PipeChartConfig } from '../pie-chart/pipe-chart.config';
import { PipeChartConfig } from '../../shared/pie-chart/pipe-chart.config';
import { MonitoringSummaryComponent } from '../monitoring-summary/monitoring-summary.component';
import { CommonModule } from '@angular/common';
// import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { BarChartComponent } from '../../shared/bar-chart/bar-chart.component';
import { TsComponent } from '../../left-panel/components/ts/ts.component';
@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss'],
  standalone: true,
  imports: [PieChartComponent,MonitoringSummaryComponent,BarChartComponent,CommonModule,TsComponent]
})
export class RightPanelT5Component {
  chartConfig: PipeChartConfig = {
    data: [
      { name: 'Đang hoạt động', value: 60 },
      { name: 'Chưa hoạt động', value: 27 },
      { name: 'Đang cài', value: 13 }
    ],
    title: '',
    colors: ['#ff4d4f', '#40a9ff', '#73d13d'],
    legendPosition: 'bottom',
    radius: '70%',
    showLabelInside: false,
    height: '25vh'
  };
  chartConfig2: PipeChartConfig = {
    data: [
      { value: 4, name: 'C', itemStyle: { color: 'rgba(28, 155, 83, 1)' } },  
    { value: 5, name: 'T', itemStyle: { color: 'rgba(52, 131, 251, 1)' } }, 
    { value: 7, name: 'H', itemStyle: { color: 'rgba(210, 0, 26, 1)' } },
    ],
      title: '',
      colors: ['#ff4d4f', '#40a9ff', '#73d13d'],
      legendPosition: 'bottom',
      radius: ['30%', '55%'], // 👈 thu nhỏ để tạo khoảng trống
      showLabelInside: false,
      height: '34vh',
      
    };
  summaryData = [
    {
      title: 'Thiết bị vi phạm quy định',
      total: 30,
      route: '/report/vi-pham',
      items: [
        { label: 'Máy tính QS kết nối Internet', value: 0 },
        { label: 'Máy tính Internet kết nối QS', value: 0 },
        { label: 'Máy tính sử dụng USB không an toàn', value: 9 },
        { label: 'Máy tính chưa đăng ký kết nối mạng', value: 22 }
      ]
    }
  ];
  barConfig: PipeChartConfig = {
    title: 'Top 10 thiết bị nhiễm mã độc theo đơn vị',
    height: '25vh',
    colors: ['#f5b041', '#85c1e9', '#48c9b0', '#58d68d', '#5b2c6f'],
    data: [
      { name: 'QK1', value: 30 },
      { name: 'QK2', value: 22 },
      { name: 'QK3', value: 18 },
      { name: 'QK4', value: 25 },
      { name: 'QK5', value: 12 }
    ]
  };
  
}
