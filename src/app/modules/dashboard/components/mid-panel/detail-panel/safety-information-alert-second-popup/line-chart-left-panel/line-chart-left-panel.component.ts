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
import { frozenHeight } from '@syncfusion/ej2-angular-grids';
import { Constant } from 'src/app/core/config/constant';

@Component({
  imports: [CommonModule, ChartModule],
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
  ],
  selector: 'app-line-chart-left-panel',
  standalone: true,
  styleUrls: ['./line-chart-left-panel.component.scss'],
  templateUrl: './line-chart-left-panel.component.html',
})
export class LineChartLeftPanelComponent implements OnInit {
  @Input() columnData: any[];
  @Input() type: string = 'date';

  public chartDataInternet?: Object[];
  public chartDataBlackDomain?: Object[];
  public chartDataMalware?: Object[];
  public chartDataHunting?: Object[];

  public primaryXAxis?: AxisModel = {
    valueType: 'Category',
    // labelFormat: 'dd/MM',
    // intervalType: 'Days',
    majorGridLines: { width: 0 },
    edgeLabelPlacement: 'Shift',
    labelIntersectAction: 'Rotate45',
    labelStyle: {
      size: '2rem', // Change this to the desired font size
      fontWeight: 'bold', // Make the labels bold
    },
    plotOffsetRight: 25,
    plotOffsetLeft: 5,
  };
  public dataLabel?: Object = {};
  public marker?:  Object={
    visible: true,
    width: 10,
    height: 10,
    shape: 'Diamond',
    dataLabel: {
      visible: true,
      position: 'Outer',
      font: {
        fontWeight: '24px',
        color: '#000000',
        size: '30px',
      },
    }
  }
  public primaryYAxis: AxisModel = {
    labelStyle: {
      size: '3em',
    },
    plotOffsetTop: 13,
    plotOffsetLeft: 5,
    majorGridLines: {
      width: 1, // Độ dày của đường line chính
      color: '#cccccc', // Màu của đường line
    },
    minorGridLines: {
        width: 0.5, // Độ dày của đường line phụ
        color: '#e0e0e0', // Màu của đường line phụ
    }
  };
  public legendSettings:Object = {
    visible: true,
    position: 'Right',
    shape: 'Square', // Cấu hình hình dạng legend là hình vuông
    shapeWidth: 50,
    shapeHeight: 50,
    // Change the position to 'Top', 'Bottom', 'Left', or 'Right'
    textStyle: {
      size: '2.5rem',
    },
  };

  ngOnInit(): void {
  }
  async ngOnChanges(changes: SimpleChanges) {

    this.primaryXAxis = {
      valueType: this.type == 'date' ? 'DateTime':'Category',
      labelFormat: 'dd/MM',
      intervalType: 'Days',
      majorGridLines: { width: 0 },
      edgeLabelPlacement: 'Shift',
      labelIntersectAction: 'Rotate45',
      labelStyle: {
        size: '2rem', // Change this to the desired font size
        fontWeight: 'bold', // Make the labels bold
      },
      plotOffsetRight: 25,
      plotOffsetLeft: 5,
    };
    if (changes?.columnData?.currentValue) {
      let data:any = changes?.columnData?.currentValue;
      this.chartDataInternet = data?.find((e:any)=>e?.name== "INTERNET")?.data || [];
      this.chartDataBlackDomain = data?.find((e:any)=>e?.name== "BLACK_DOMAIN")?.data || [];
      this.chartDataHunting = data?.find((e:any)=>e?.name== "HUNTING")?.data || [];
      this.chartDataMalware = data?.find((e:any)=>e?.name== "MALWARE")?.data || [];
    }
  }

  protected readonly frozenHeight = frozenHeight;
}
