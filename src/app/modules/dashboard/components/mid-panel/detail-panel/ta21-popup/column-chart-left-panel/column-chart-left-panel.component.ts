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
  async ngOnChanges(changes: SimpleChanges) {
    const mapCapToText = (cap: number): string => {
      return `Cấp ${cap}`;
    };
    console.log(this.columnData);
    if (this.columnData) {
      const upCounts = this.columnData?.items.map((item: any) => ({
        cap: mapCapToText(item?.cap),
        count: item.up_count,
      }));
      const downCounts = this.columnData.items.map((item: any) => ({
        cap: mapCapToText(item?.cap),
        count: item.down_count,
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
