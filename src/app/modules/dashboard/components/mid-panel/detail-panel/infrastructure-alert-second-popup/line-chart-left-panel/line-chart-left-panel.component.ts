import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
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
export class LineChartLeftPanelComponent implements OnInit,OnChanges {
  @Input() columnData: any[];
  @Input() type: string='date';

  public primaryXAxis?: any;
  public chartDataNetworkDevice?: Object[];
  public chartDataServer?: Object[];
  public chartDataUDDV?: Object[];
  public chartDataServerMonitor?: Object[];


  public dataLabel?: Object = {};
  public marker?:  Object={
    visible: true,
    width: 20,
    height: 20,
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
    },
  };
  public legendSettings:Object = {
    visible: true,
    position: 'Right',
    shapeWidth: 50,
    shapeHeight: 50,
    opacity: 5,
    // Change the position to 'Top', 'Bottom', 'Left', or 'Right'
    textStyle: {
      size: '2.5rem',
    },
  };
  ngOnInit(): void {
  }

  getColumnName(name:string) {
    let key:any = {
      NETWORK_DEVICE:"Thiết bị mạng",
      device_SERVER_:"Máy chủ",
      server_monitor:"HTGS",
      UDDV:"ƯD dịch vụ"
    }
    return name[key]|| '';
  }
  getColorName(name:string) {
    let key:any = {
      NETWORK_DEVICE:"#FF5733",
      device_SERVER_:"#33C1FF",
      server_monitor:"#28B463",
      UDDV:"#FFC300"
    }
    return name[key]|| '';
  }
  parseWeekData(weekStr:string) {
    console.log(weekStr);
    const [week, year] = weekStr.split('/').map(Number);
    return this.getStartDateOfWeek(week, year);
}

getStartDateOfWeek(week:number, year:number) {
    const date = new Date(year, 0, 1); // Bắt đầu từ ngày 1 tháng 1
    const daysToAdd = (week - 1) * 7; // Tính số ngày từ đầu năm
    date.setDate(date.getDate() + daysToAdd);
    return date;
}
  async ngOnChanges(changes: SimpleChanges) {

    this.primaryXAxis = {
      valueType: this.type == 'date' ? 'DateTime':'Category',
      labelFormat: 'dd/MM',
      intervalType:"Days",
      majorGridLines: { width: 0 },
      edgeLabelPlacement: 'Shift',
      labelIntersectAction: 'Rotate45',
      labelStyle: {
        size: '2rem', // Change this to the desired font size
        fontWeight: 'bold', // Make the labels bold
      },
      plotOffsetRight: 25,
      plotOffsetLeft: 5,
      sortBy: 'Category'
    };
    if (changes?.columnData?.currentValue) {
      let data:any = changes?.columnData?.currentValue;
      this.chartDataNetworkDevice = data?.find((e:any)=>e?.name== "NETWORK_DEVICE")?.data || [];
      this.chartDataServer = data?.find((e:any)=>e?.name== "device_SERVER_")?.data || [];
      this.chartDataServerMonitor = data?.find((e:any)=>e?.name== "server_monitor")?.data || [];
      this.chartDataUDDV = data?.find((e:any)=>e?.name== "UDDV")?.data || [];
    }
  }

  protected readonly frozenHeight = frozenHeight;
}
