import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AccumulationAnnotationService,
  AccumulationChartModule,
  AccumulationDataLabelService,
  AccumulationLegendService,
  AccumulationTooltipService,
  DateTimeService,
  IAccTextRenderEventArgs,
  MultiColoredLineSeriesService,
  PieSeriesService,
} from '@syncfusion/ej2-angular-charts';
import { SupabaseService } from '../../../../services/supabase.service';
import { formatDateTime } from '../../../../../../_metronic/layout/core/common/common-utils';
import { color, EChartsOption, SeriesOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';

@Component({
  selector: 'app-target',
  standalone: true,
  providers: [
    DateTimeService,
    MultiColoredLineSeriesService,
    PieSeriesService,
    AccumulationDataLabelService,
    AccumulationTooltipService,
    AccumulationLegendService,
    AccumulationAnnotationService,
    provideEcharts()
  ],
  imports: [CommonModule, AccumulationChartModule, NgxEchartsDirective],
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss'],
})
export class TargetComponent implements OnInit {
  //basic color
  public basicColor: string;

  // target donut var
  public targetData?: Promise<any[]>;
  public targetDataLabel: Object;
  public targetColors: string[];
  public targetTitle: string;
  public totaltargetTrack: number = 0;
  public totaltargetData: number = 0;
  public targetlegendSettings: Object;
  public centerLabel?: Object;
  private supabaseService = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);

  startDate$: any;

  constructor() { }

  ngOnInit() {
    const today = new Date();
    const twoDaysAgo: Date = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 7);

    this.startDate$ = formatDateTime(twoDaysAgo).split(' ')[0];

    // target donut var
    this.targetDataLabel = {
      visible: true,
      // name: 'text',
      position: 'Outside',
      //connectorStyle: { length: '50px', type: 'Curve'},
      labelIntersectAction: 'MultipleRows',
      template:
        '<div class=\'fw-bold\' style="font-size: 26px;padding:5px;line-height:1">${point.x}</div>',
    };
    this.targetlegendSettings = {
      visible: false,
    };
    //this.targetColors = ['#ff6961', '#ffb480', '#f8f38d', '#42d6a4','#08cad1','#59adf6','#9d94ff','#c780e8'];
    this.targetColors = [
      'rgba(195, 0, 77, 1)',
      'rgba(170, 0, 139, 1)',
      'rgba(136, 60, 192, 1)',
      'rgba(107, 103, 225, 1)',
      'rgba(84, 146, 248, 1)',
      'rgba(62, 181, 250, 1)',
      'rgba(25, 192, 211, 1)',
    ];
    this.basicColor = '#4f8e6b';
    this.cdr.markForCheck();

    // this.targetData = this.supabase.t5_muctieu().finally(() => this.cdr.markForCheck());
    this.targetData = this.supabaseService.t5_muctieu().finally(() => {
      this.targetData!.then((data) => {
        this.totaltargetTrack = data.reduce((acc, item) => acc + item.count, 0);
        this.centerLabel = {
          text: this.totaltargetTrack.toString(),
          textStyle: {
            fontWeight: 'bold',
            size: '22px',
            color: '#045E2B',
          },
        };
        this.totaltargetData = data.reduce((acc, item) => acc + item.total, 0);
        this.cdr.markForCheck();
      });
    });
  }

  targetChartOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    label: {
      show: true,
      color: '#fff', 
      fontWeight: '500',
      fontSize: 18
    },
    legend: {
      show: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '5',
      itemWidth: 14,
      itemHeight: 14,
      itemGap: 40,
      textStyle: {
        fontSize: 18,
        fontWeight: 500
      },
      icon: 'circle',
    },
    grid: {
      left: '3%',
      right: '4%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['H', 'MAI', 'IND', 'K', 'BRN', 'TAW'],
      axisLine: { show: false }, 
      axisTick: { show: false },
      axisLabel: { show: true, fontSize: 18, fontWeight: 500, color: '#000' },
    },
    yAxis: {
      type: 'value'
    },
    series: this.generateStackedSeries()
  };

  generateStackedSeries(): SeriesOption[] {
    const rawData = [
      { name: 'Đã khai thác thành công', data: [120, 132, 101, 134, 90, 230], color: "rgba(28, 155, 83, 1)" },
      { name: 'Đang tiến hành khai thác', data: [220, 182, 191, 234, 290, 330], color: "rgba(3, 66, 30, 1)" },
    ];

    return rawData.map((item, index, array) => ({
      name: item.name,
      type: 'bar',
      stack: 'total',
      emphasis: { focus: 'self' },
      
      itemStyle: {
        borderRadius: [
          index === array.length - 1 ? 8 : 0,
          index === array.length - 1 ? 8 : 0,
          index === 0 ? 8 : 0,
          index === 0 ? 8 : 0
        ],
        color: item.color
      },
      data: item.data
    }));
  }

  public parseToPercentage(text: string): string {
    // Extract numbers from the string using a regular expression
    const match = text.match(/\d+/g);

    if (match && match.length === 2) {
      const numerator = parseInt(match[0], 10);
      const denominator = parseInt(match[1], 10);
      if (denominator == 0) {
        return ` `;
      } else if (denominator == numerator) {
        return `100%`;
      } else {
        // Calculate percentage
        const percentage = (numerator / denominator) * 100;

        // Return percentage as a formatted string with one decimal place
        return `${percentage.toFixed(1)}%`;
      }
    }

    throw new Error('Invalid input format');
  }

  public onTextRender(args: IAccTextRenderEventArgs): void {
    // Example: Modify the text to display count and add some styling
    //const x1 = this.parseToPercentage(args.point.x.toString())
    args.text = `${args.point.x}`;
    args.font = {
      size: '26px',
      fontWeight: 'bold',
    };
  }
  onChartLoaded(args: any): void {
    const textElement = document.querySelector('#target-pie-chart_centerLabel');
    if (textElement) {
      const tspanElement = textElement.querySelector('tspan');
      if (tspanElement) {
        const colorcode = textElement.getAttribute('fill');
        if (colorcode) {
          tspanElement.setAttribute('fill', colorcode);
        }
      }
    }
  }
}
