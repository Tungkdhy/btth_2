import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
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

@Component({
  selector: 'app-column-chart-left-panel',
  standalone: true,
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
  styleUrls: ['./column-chart-left-panel.component.scss'],
  templateUrl: './column-chart-left-panel.component.html',
})
export class ColumnChartLeftPanelComponent implements OnInit {
  public chartData: any[] = [];
  public categories: { field: string; label: string }[];
  public primaryXAxis: any;
  public primaryYAxis: any;
  public chartTitle: string;

  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef,
  ) {
    this.chartTitle = 'Biểu đồ thống kê số lượng theo đơn vị';
    this.categories = [
      { field: 't186', label: 'TT186' },
      { field: 't286', label: 'TT286' },
      { field: 't386', label: 'TT386' },
      { field: 'khobtl', label: 'Kho BTL' },
    ];
    this.primaryXAxis = { valueType: 'Category', title: 'Tên đơn vị' };
    this.primaryYAxis = {
      title: 'Số lượng',
      plotOffsetTop: 13,
      plotOffsetLeft: 5,
    };
  }
  private colors: string[] = ['#4E79A7', '#F28E2B', '#E15759', '#76B7B2'];
  getColor(index: number): string {
    return this.colors[index];
  }
  async ngOnInit() {
    try {
      const data = await this.supabase.getDanhSachDuPhong86_2();
      this.chartData = data?.items || [];
      this.cdr.detectChanges(); // Trigger change detection
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}
