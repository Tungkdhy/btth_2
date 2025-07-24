import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { CommonModule } from '@angular/common';
import { PipeChartConfig } from '../pie-chart/pipe-chart.config';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [NgxEchartsDirective, CommonModule],
  providers: [provideEcharts()],
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent {
  @Input() label: string = '';        // Nội dung hiển thị
  @Input() type: 'status' | 'rating' = 'status'; // Phân biệt kiểu
}
