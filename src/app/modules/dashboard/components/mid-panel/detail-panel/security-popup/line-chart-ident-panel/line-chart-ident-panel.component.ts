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
  selector: 'app-line-chart-ident-panel',
  standalone: true,
  styleUrls: ['./line-chart-ident-panel.component.scss'],
  templateUrl: './line-chart-ident-panel.component.html',
})
export class LineChartIdentPanelComponent implements OnInit {

  constructor(
    private cdr: ChangeDetectorRef,
  ) {}

  @Input() columnData: any[];
  @Input() type:string = 'date';

  public chartDataIdent?: Object[];
  public chartDataUnIdent?: Object[];

  public primaryXAxis?: AxisModel = {};
  public dataLabel?: Object = {};
  public marker?:  Object={
    visible: true,
    width: 30,
    height: 30,
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
  };
  // public legendSettings:Object = {
  //   visible: true,
  //   position: 'Right',
  //   shapeWidth: 50,
  //   shapeHeight: 50,
  //   // Change the position to 'Top', 'Bottom', 'Left', or 'Right'
  //   textStyle: {
  //     size: '2.5rem',
  //   },

  // };
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

      this.chartDataIdent = this.columnData?.find((e:any)=>e.name == "IDENT")?.data || [];
      this.chartDataUnIdent = this.columnData?.find((e:any)=>e.name == "UNIDENT")?.data || [];
      this.cdr.detectChanges();
    }
  }

  protected readonly frozenHeight = frozenHeight;
}
