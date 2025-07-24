import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef,
  SimpleChanges,
  Input,
} from '@angular/core';
import { CommonModule, formatNumber } from '@angular/common';
import {
  BarSeriesService,
  CategoryService,
  ChartModule,
  DataLabelService,
  DateTimeService,
  LegendService,
  MultiColoredLineSeriesService,
  TooltipService,
} from '@syncfusion/ej2-angular-charts';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { NumberFormat } from 'docx';
import { formatNumberWithDot } from 'src/app/_metronic/layout/core/common/common-utils';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
@Component({
  selector: 'app-info-bar',
  standalone: true,
  imports: [CommonModule, ChartModule, NgxEchartsDirective],
  providers: [
    DateTimeService,
    MultiColoredLineSeriesService,
    CategoryService,
    DataLabelService,
    BarSeriesService,
    LegendService,
    TooltipService,
    provideEcharts()
  ],
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.scss'],
})
export class UploadPostBarComponent implements OnInit {
  //basic color
  public basicColor: string;

  // upload post bar var
  public uploadPostPrimaryXAxis: any;
  @Input() uploadData?: any;
  @Input() id?: any;

  public uploadPostDataDetail?: Promise<any[]>;
  @Input() uploadPostTitle: string = '';
  uploadPostPrimaryYAxis: any;
  public uploadPostColorMapping: Object;
  public dataLabel: Object = [];
  public marker: Object;
  inforBarChartOption: EChartsOption;
  constructor() {}
  private cdr = inject(ChangeDetectorRef);

  async ngOnInit(): Promise<void> {
    //upload post bar var

    // this.uploadPostPrimaryXAxis = {
    //   valueType: 'Category',
    //   title: '',
    //   labelStyle: {
    //     size: '2rem', // Change this to the desired font size
    //     fontWeight: 'bold', // Make the labels bold
    //   },
    // };
    // this.uploadPostPrimaryYAxis = {
    //   title: '',
    //   visible: false, // Ẩn trục X
    //   labelStyle: {
    //     size: '2rem', // Change this to the desired font size
    //     fontWeight: 'bold', // Make the labels bold
    //   },
    //   plotOffsetTop: 20,
    //   plotOffsetRight: 30,
    // };
    // this.uploadPostColorMapping = this.basicColor;
    // this.basicColor = '#1E90FF';
    // this.dataLabel = {
    //   visible: true,
    //   position: 'Middle',
    //   font: {
    //     fontWeight: '24px',
    //     color: '#000000',
    //     size: '2em',
    //   },
    //   format: 'n0',
    // };

    // this.marker = {
    //   dataLabel: this.dataLabel,
    // };
  }
  onTextRender(args: any): void {
    let point = args.point;
    args.text = `${formatNumber(Number(point?.y), 'vi-VN', '1.0-3')}`
  }
  ngOnChanges(changes: SimpleChanges) {
    this.inforBarChartOption = {
      grid: {
        left: '1%',
        right: '5%',
        top: '5%',
        bottom: '2%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          show: true,
          fontSize: 12,
          fontWeight: 500,
          color: 'rgba(137, 141, 143, 1)',
        },
      },
      yAxis: {
        type: 'category',
        data: this.uploadData?.map((item: any) => item.group_by),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          show: true,
          fontSize: 18,
          fontWeight: 500,
          color: '#000',
          formatter: function (value: string) {
            const maxLength = 10; // Giới hạn số ký tự (tùy chỉnh)
            return value.length > maxLength ? value.substring(0, maxLength) + "..." : value;
          }
        },

      },
      series: [
        {
          name: 'Số lượng',
          type: 'bar',
          data: this.uploadData?.map((item: any) => item.count),
          label: {
            show: true,
            position: 'right',
            fontSize: 18,
            fontWeight: 500,
            color: '#000',
          },
          itemStyle: {
            borderRadius: [8, 8, 8, 8],
            color: 'rgba(52, 131, 251, 1)'
          }
        }
      ]
    }
    this.cdr.detectChanges();
  }
}
