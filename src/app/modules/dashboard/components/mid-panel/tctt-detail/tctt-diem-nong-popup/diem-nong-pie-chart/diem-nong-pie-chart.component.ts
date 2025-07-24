import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
  ILegendRenderEventArgs,
  ITextRenderEventArgs,
  LegendService,
  LegendSettingsModel,
  LineSeriesService,
  MultiColoredLineSeriesService,
  ParetoSeriesService,
  SplineAreaSeriesService,
  SplineSeriesService,
  StackingLineSeriesService,
  StepLineSeriesService,
  TooltipService,
} from '@syncfusion/ej2-angular-charts';
import { formatNumberWithDot } from 'src/app/_metronic/layout/core/common/common-utils';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';

@Component({
  selector: 'app-diem-nong-pie-chart',
  templateUrl: './diem-nong-pie-chart.component.html',
  styleUrls: ['./diem-nong-pie-chart.component.scss'],
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
  imports: [FormsModule, CommonModule, AccumulationChartModule, ChartModule, NgxEchartsDirective],
  standalone: true,
})
export class DiemNongPieChartComponent implements OnInit {
  @Input() statusData: any[] = [];
  public donutChartData: any;
  public diemNongChartOption: EChartsOption;
  public accumulationLegendSettings: LegendSettingsModel;
  public targetColors: string[] = [
    '#2196F3',
    '#FFEB3B',
    '#4CAF50',
    '#FF9800',
    '#F44336',
    '#3F51B5',
    '#00BCD4',
  ];
  public targetCorrelationDataLabel: Object;
  public targetCenterLabel?: Object;

  public donutDataLabel: Object;
  public donutColors: string[];
  public donutTitle: string;
  public donutlegendSettings: Object;
  public enableSmartLabels: Object;
  public centerLabel?: Object;
  public primaryXAxis: AxisModel;
  public primaryYAxis: AxisModel;
  public sacThaiMarker: any;

  public border: Object = {
    width: 2,
    radius: 10, // Apply border-radius here
  };
  colorChart: string;

  public titleLine?: string;
  public primaryXAxisLine: AxisModel;
  public primaryYAxisLine: AxisModel;
  public markerLine?: Object;
  private cdr = inject(ChangeDetectorRef);

  constructor() { }

  async ngOnInit(): Promise<any> {
    this.donutDataLabel = {
      visible: true,
      name: 'text',
      position: 'Outside',
      template:
        '<div class=\'fw-bold custom-color-text\' style="font-size: 2em;">${point.percentage}%</div>',
    };
    this.enableSmartLabels = true;
    this.donutColors = this.targetColors;
    this.donutlegendSettings = {
      visible: true,
      position: 'Bottom',
      textStyle: {
        size: '2em',
        textAlignment: 'Center',
        color: this.colorChart,
      },
      shapeWidth: 30,
      shapeHeight: 30,
      itemPadding: 40,
    };

    this.initialAccumulationSettings();

    this.cdr.detectChanges();

    /*------------------------- */
    this.primaryXAxisLine = {
      valueType: 'Category',
      majorGridLines: { width: 0 },
      interval: 1,
      edgeLabelPlacement: 'Shift',
      labelIntersectAction: 'Rotate45',
      labelStyle: {
        size: '2rem', // Change this to the desired font size
        fontWeight: 'bold',
        color: 'red', // Make the labels bold
      },
      plotOffsetRight: 25,
      plotOffsetLeft: 5,
    };

    // public primaryYAxisLine?: Object;
    this.primaryYAxisLine = {
      visible: false,
      minimum: 0,
      // interval: "auto,
      title: '',
      labelFormat: '{value}',
      labelStyle: {
        size: '1.5rem', // Change this to the desired font size
        fontWeight: 'bold',
        textAlignment: 'Near',
        color: this.colorChart, // Make the labels bold
      },
      rangePadding: 'Additional',
      plotOffsetTop: 10, // Add space at the top
      plotOffsetBottom: 10,
      placeNextToAxisLine: true,
      // Display y-axis values
    };
    this.markerLine = {
      visible: true,
      width: 10,
      height: 10,
      shape: 'Diamond',
      dataLabel: {
        visible: true,
        position: 'Outer', // You can also set 'Middle', 'Bottom', etc.
        font: {
          fontWeight: '600',
          color: '#ffffff', // Text color
          size: '2rem',
          margin: { top: 10, right: 10 },
          // Text size}
        },
      },
      margin: { top: 10, right: 10 },
      //
      position: 'Outside',
    };
  }
  initialAccumulationSettings() {
    this.accumulationLegendSettings = {
      margin: { left: 20, right: 20 },
      width: 'fit-content',
      shapeHeight: 30,
      shapeWidth: 30,
      itemPadding: 40,
      alignment: 'Center',
      textStyle: {
        size: '2rem',
        textAlignment: 'Center',
        color: this.colorChart,
      },
      position: 'Bottom',
    };

    this.targetCorrelationDataLabel = {
      visible: true,
      name: 'text',
      position: 'Outside',
      template:
        '<div class=\'fw-bold custom-color-text\' style="font-size: 2rem;">${point.percentage}%</div>',
    };
  }
  getDiemNongColor(index: number): string {
    const colors = ['#045E2B', 'rgba(28, 155, 83, 1)', 'rgba(70, 190, 130, 1)', '#D2001A'];
    return colors[index % colors.length];
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['statusData']) {      
      this.diemNongChartOption = {
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
              fontSize: '15px',
              fontWeight: 700,
              formatter: ({ value }) => `${value}`
            },
            data: this.statusData.map((item: any, index: number) => ({
              value: item.soluong,
              name: item.trangthai,
              itemStyle: {
                color: this.getDiemNongColor(index)
              }
            })),
          },
        ],
        legend: {
          show: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '15',
          itemWidth: 14,
          itemHeight: 14,
          itemGap: 40,
          textStyle: {
            fontSize: 18,
            fontWeight: 500
          },
          icon: 'circle',
          // formatter: (name: string) => {
          //   const seriesData = (this.diemNongChartOption.series as any[])[0]?.data;
          //   const item = seriesData?.find((d: any) => d.name === name);
          //   return `${name}: ${item?.value}`;
          // }
        },
      };
    }
  }
}
