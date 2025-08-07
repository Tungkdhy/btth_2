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
  @Input() items?: { color: string, label: string }[];

  line1: { color: string, label: string }[] = [];
  line2: { color: string, label: string }[] = [];

  ngOnChanges() {
    const list = this.items ?? []; // ✅ Nếu không truyền thì coi như []

    if (list.length === 0) {
      this.line1 = [];
      this.line2 = [];
      return;
    }

    const half = Math.ceil(list.length / 2);
    this.line1 = list.slice(0, half);
    this.line2 = list.slice(half);
  }
}
