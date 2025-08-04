import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { CommonModule } from '@angular/common';
import { PipeChartConfig } from '../pie-chart/pipe-chart.config';

@Component({
  selector: 'app-legend',
  standalone: true,
  imports: [NgxEchartsDirective, CommonModule],
  providers: [provideEcharts()],
  templateUrl: './chuthich.component.html',
  styleUrls: ['./chuthich.component.scss']
})
export class ChuthichComponent {
  @Input() items: { color: string, label: string }[] = [];

  line1: { color: string, label: string }[] = [];
  line2: { color: string, label: string }[] = [];

  ngOnChanges() {
    const half = Math.ceil(this.items.length / 2);
    this.line1 = this.items.slice(0, half);
    this.line2 = this.items.slice(half);
  }
}
