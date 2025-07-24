import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AccumulationAnnotationService,
  AccumulationChartModule,
  AccumulationDataLabelService,
  AccumulationLegendService,
  AccumulationTooltipService,
  ChartModule,
  PieSeriesService,
} from '@syncfusion/ej2-angular-charts';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';

// @ts-ignore
@Component({
  selector: 'app-statistic-pie-chart-popup',
  standalone: true,
  imports: [CommonModule, AccumulationChartModule, ChartModule, NgxEchartsDirective],
  providers: [
    PieSeriesService,
    AccumulationLegendService,
    AccumulationTooltipService,
    AccumulationDataLabelService,
    AccumulationAnnotationService,
    provideEcharts()
  ],
  templateUrl: './statistic-pie-chart-popup.component.html',
  styleUrls: ['./statistic-pie-chart-popup.component.scss'],
})
export class StatisticPieChartPopupComponent implements OnInit {
  @Input() pieData: any[];
  @Input() id: string;
  statisticStatusChartOption: EChartsOption
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    this.statisticStatusChartOption = {
      series: [
        {
          type: 'pie',
          radius: ['35%', '60%'],
          center: ['50%', '40%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'outside',
            formatter: '{c}',
            fontSize: '15px',
            fontWeight: 700
          },
          data: this.pieData,
        },
      ],
      legend: {
        show: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '20',
        itemWidth: 14,
        itemHeight: 14,
        itemGap: 40,
        textStyle: {
          fontSize: 18,
          fontWeight: 500
        },
        icon: 'circle',
        // formatter: (name: string) => {
        //   const seriesData = (this.statisticStatusChartOption.series as any[])[0]?.data;
        //   const item = seriesData?.find((d: any) => d.name === name);
        //   return `${name}: ${item?.value}`;
        // }
      },
      // graphic: [
      //   {
      //     type: 'text',
      //     left: 'center',
      //     top: '38%',
      //     style: {
      //       text: '70',
      //       fontSize: 18,
      //       fontWeight: 'bold',
      //       fill: '#333',
      //     },
      //   },
      // ],
    };
  }


}
