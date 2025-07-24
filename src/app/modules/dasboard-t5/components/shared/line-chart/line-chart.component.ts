import { CommonModule } from '@angular/common';
import { EChartsOption } from 'echarts';
import {
  ChangeDetectorRef,
  Component,
  Input,
  inject,
  OnInit,
  SimpleChanges,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  AccumulationAnnotationService,
  AccumulationChartModule,
  AccumulationDataLabelService,
  AccumulationLegendService,
  AccumulationTooltipService,
  AxisModel,
  BarSeriesService,
  CategoryService,
  ChartModule,
  ColumnSeriesService,
  DataLabelService,
  DateTimeService,
  ITextRenderEventArgs,
  LegendService,
  LineSeriesService,
  MultiColoredLineSeriesService,
  ParetoSeriesService,
  SplineAreaSeriesService,
  SplineSeriesService,
  StackingLineSeriesService,
  StepLineSeriesService,
  TooltipService,
} from '@syncfusion/ej2-angular-charts';
// import { PayloadChannelData } from '../../../../../models/payload-channel';
import {
  convertFormatDateTimeTctt,
  formatDateTime,
  getDateRangePayload,
  isNaNDateFormat,
  isTheFollowingDay,
} from 'src/app/_metronic/layout/core/common/common-utils';
// import { SupabaseBaiTieuCucService } from './services/supabase.service';
import { debounceTime, filter, Observable, Subject, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectDateV2 } from 'src/app/store/date-time-range-v2/date-time-range-v2.selectors';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';

@Component({
  selector: 'app-line-chart',
  standalone:true,
  imports:[CommonModule, AccumulationChartModule, ChartModule, FormsModule, NgxEchartsDirective],
  providers: [
    AccumulationDataLabelService,
    AccumulationTooltipService,
    AccumulationLegendService,
    AccumulationAnnotationService,
    CategoryService,
    DataLabelService,
    BarSeriesService,
    LegendService,
    TooltipService,
    CategoryService,
    LineSeriesService,
    StepLineSeriesService,
    SplineSeriesService,
    StackingLineSeriesService,
    DateTimeService,
    SplineAreaSeriesService,
    MultiColoredLineSeriesService,
    ParetoSeriesService,
    ColumnSeriesService,
    provideEcharts()
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent {
  public chartData?: any = [1]; // line graph

  public selectedOption: string = '1';
  handleRadioChange(selectedOption: string) {
    this.selectedOption = selectedOption;

    // Implement your logic based on the selected option
    if (selectedOption === '1') {
      // this.updateData();
    } else if (selectedOption === '2') {
      // this.updateRangeData();
      // Logic for option 2
    }
  }
  lineChartOption: EChartsOption = {
    grid: {
        left: '3%',
        right: '4%',
        top: '5%',
        bottom: '5%',
        containLabel: true
    },
    tooltip: {
      trigger: 'item',
      position: function (point, params, dom, rect, size) {
        const top = point[1] - size.contentSize[1] - 10;
        return [point[0], top < 0 ? 0 : top];
      },
    },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      axisLine: { show: false }, 
      axisTick: { show: false }, 
      axisLabel: { show: true, fontSize: 12, fontWeight: 500, color: '#000' },
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Revenue',
        type: 'line',
        data: [10, 20, 15, 25, 30],
        lineStyle: {
          width: 3, 
          color: 'red' 
        },
        symbol: 'circle',
        symbolSize: 14,
        itemStyle: {
          color: 'rgba(210, 0, 26, 1)',
          borderWidth: 3,
          borderColor: '#fff' // Viền trắng để nổi bật hơn
        },
        // label: {
        //   show: true, // Hiển thị giá trị trên từng điểm
        //   position: 'top',
        //   fontSize: 12,
        //   color: '#333'
        // }
      }
    ]
  };
}
