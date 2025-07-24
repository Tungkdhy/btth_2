import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AccumulationDataLabelSettingsModel,
  AxisModel,
  CategoryService,
  ChartAnnotationService,
  ChartModule,
  ColumnSeriesService,
  DataLabelService,
  DateTimeService,
  LegendService,
  LegendSettingsModel,
  LineSeriesService,
  RangeColumnSeriesService,
  ScrollBarService,
  StackingColumnSeriesService,
  TooltipService,
} from '@syncfusion/ej2-angular-charts';
import { frozenHeight } from '@syncfusion/ej2-angular-grids';

@Component({
  imports: [CommonModule, ChartModule],
  providers: [
    CategoryService,
    DateTimeService,
    ScrollBarService,
    LineSeriesService,
    ColumnSeriesService,
    ChartAnnotationService,
    RangeColumnSeriesService,
    StackingColumnSeriesService,
    LegendService,
    TooltipService,
    DataLabelService,
  ],
  selector: 'app-column-chart-con-ton-panel',
  standalone: true,
  styleUrls: ['./column-chart-con-ton-panel.component.scss'],
  templateUrl: './column-chart-con-ton-panel.component.html',
})
export class ColumnChartConTonPanelComponent implements OnInit {

  @Input() type:string='date';
  @Input() columnData: any[]=[];
  public primaryXAxis?: AxisModel;
  public chartData?: Object[];
  public title?: string;
  public dataLabel?: Object = [];
  public marker: Object;
  public primaryYAxis: AxisModel;
  public legendSettings:LegendSettingsModel;

  constructor(
    private cdr: ChangeDetectorRef,
  ) {}
  ngOnInit(): void {
    this.chartData = this.columnData;
    this.primaryXAxis = {
      valueType: 'Category',
      title: '',
      labelStyle: {
        size: '3em',
      },
    };
    this.primaryYAxis = {
      labelStyle: {
        size: '3em',
      },
      plotOffsetTop: 13,
      plotOffsetLeft: 5,
    };
    this.dataLabel = {
      visible: true,
      position: 'Outer',
      font: {
        fontWeight: '24px',
        color: '#000000',
        size: '30px',
      },
    };

    this.marker = {
      dataLabel: this.dataLabel,
    };
    this.legendSettings = {
      visible: true,
      position: 'Right',
      shapeWidth: 30,
      shapeHeight: 30,
      opacity: 5,
      // Change the position to 'Top', 'Bottom', 'Left', or 'Right'
      textStyle: {
        size: '2.5rem',
      },
    };
  }
  async ngOnChanges(changes: SimpleChanges) {
    if (changes?.columnData?.currentValue) {
      this.chartData = changes?.columnData?.currentValue;
      this.cdr.detectChanges();
    }
  }

  getType(type:string){
    let key:any={
      date:"ngày",
      week:"tuần",
      month:"tháng",
    }
    return key[type] || '';
  }
  getTypeUpcase(type:string){
    let key:any={
      date:"Ngày",
      week:"Tuần",
      month:"Tháng",
    }
    return key[type] || '';
  }
  protected readonly frozenHeight = frozenHeight;
}
