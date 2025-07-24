import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
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
  LineSeriesService,
  RangeColumnSeriesService,
  ScrollBarService,
  StackingColumnSeriesService,
  TooltipService,
} from '@syncfusion/ej2-angular-charts';
import { frozenHeight } from '@syncfusion/ej2-angular-grids';
interface ChartData {
  cap: string;
  count: number;
}
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
  selector: 'app-column-chart-left-panel',
  standalone: true,
  styleUrls: ['./column-chart-left-panel.component.scss'],
  templateUrl: './column-chart-left-panel.component.html',
})
export class ColumnChartLeftPanelComponent implements OnInit {
  @Input() columnData: any;
  @Output() pointClicked = new EventEmitter<{
    seriesIndex: number;
    cap: string;
  }>();
  public primaryXAxis?: AxisModel;
  public chartDataUp?: ChartData[];
  public chartDataDown?: ChartData[];

  public title?: string;
  public dataLabel?: Object = [];
  public marker: Object;
  public primaryYAxis: AxisModel;

  ngOnInit(): void {
    this.chartDataUp = this.columnData;
    this.chartDataDown = this.columnData;

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
  }
  private transferLoi(loi: string): string {
    switch (loi) {
      case 'A40':
        return 'Miền Bắc';
      case 'A91':
        return 'Miền Trung';
      case 'A99':
        return 'Miền Nam';
      default:
        return loi;
    }
  }
  
  async ngOnChanges(changes: SimpleChanges) {
    let mapLoi = (data: string) => {
      switch (data) {
        case '1':
          return 'Lỗi 1';
        default:
          return '';
      }
    };
    console.log(this.columnData);
    if (this.columnData) {
      const upCounts = this.columnData?.items.map((item: any) => ({
        loi: this.transferLoi(item.loi),
        count: item.up,
      }));
      const downCounts = this.columnData.items.map((item: any) => ({
        loi:this.transferLoi(item.loi),
        count: item.down,
      }));

      this.chartDataUp = upCounts;
      console.log(this.chartDataUp);
      this.chartDataDown = downCounts;
    }
  }
  // Hàm xử lý sự kiện khi nhấp vào một điểm
  onPointClick(args: any): void {
    const pointIndex = args.point.index;
    const seriesIndex = args.seriesIndex;

    let clickedPointData;

    if (seriesIndex === 0) {
      clickedPointData = this.chartDataUp?.[pointIndex];
    } else if (seriesIndex === 1) {
      clickedPointData = this.chartDataDown?.[pointIndex];
    }

    if (clickedPointData) {
      const cap = clickedPointData.cap;
      const count = clickedPointData.count;
      this.pointClicked.emit({ seriesIndex, cap });
    } else {
      console.log(
        'Dữ liệu tại điểm được nhấp không hợp lệ hoặc không tồn tại.',
      );
    }
  }
  protected readonly frozenHeight = frozenHeight;
}
