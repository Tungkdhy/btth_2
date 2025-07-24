import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieChartLeftPanelComponent } from './pie-chart-left-panel/pie-chart-left-panel.component';
import { ColumnChartLeftPanelComponent } from './column-chart-left-panel/column-chart-left-panel.component';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { TableDetail1Component } from './table-detail-fms/table-detail-1.component';

@Component({
  selector: 'app-fidelis-popup',
  standalone: true,
  imports: [
    CommonModule,
    PieChartLeftPanelComponent,
    TableDetail1Component,
    ColumnChartLeftPanelComponent,
  ],
  templateUrl: './nacs-popup.component.html',
  styleUrls: ['./nacs-popup.component.scss'],
})
export class FidelisPopupComponent implements OnInit, OnChanges {
  status: string;
  @Input() nacData: string = '';
  @Input() mainType: string = '';
  @Output() pointClicked = new EventEmitter<{
    seriesIndex: number;
    cap: string;
  }>();
  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();
  pieData: any[];
  columnData: any = [];
  tableData: any;

  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef,
  ) {}

  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }

  async handlePointClick(event: { seriesIndex: number; cap: string }) {
    const { seriesIndex, cap } = event;
    this.status = seriesIndex === 0 ? 'up' : 'down';
    await this.updateTableData();
  }

  async ngOnInit() {
    await this.updateAllData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['nacData'] || changes['mainType']) {
      this.updateAllData();
    }
  }

  private async updateAllData() {
    await Promise.all([
      this.updatePieData(),
      this.updateColumnData(),
      this.updateTableData(),
    ]);
    this.cdr.detectChanges();
  }

  private async updatePieData() {
    const thongKeTa21 = await this.supabase.getThongKeBieuDoPieFidelis('QS');
    this.pieData = [
      {
        x: 'Đang hoạt động',
        y: thongKeTa21.find((e: any) => e.status === 'up')?.count || 0,
      },
      {
        x: 'Mất kết nối',
        y: thongKeTa21.find((e: any) => e.status === 'down')?.count || 0,
      },
    ];
  }

  private async updateColumnData() {
    this.columnData = await this.supabase.getDanhSachServerFidelisByRegion(
      'QS',
    );
    console.log('columnData', this.columnData);
  }

  private async updateTableData() {
    this.tableData = await this.supabase.getDanhSachServerFidelis(
      1,
      5,
      this.status,
      'QS',
    );
  }
}
