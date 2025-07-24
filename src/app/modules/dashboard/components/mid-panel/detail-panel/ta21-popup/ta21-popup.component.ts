import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnChartLeftPanelComponent } from './column-chart-left-panel/column-chart-left-panel.component';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { TableDetail1Component } from './table-detail-fms/table-detail-1.component';
import { StatisticPieChartPopupComponent } from '../../../shared/statistic-chart-popup/statistic-pie-chart-popup.component';

@Component({
  selector: 'app-ta21-popup',
  standalone: true,
  imports: [
    CommonModule,
    TableDetail1Component,
    ColumnChartLeftPanelComponent,
    StatisticPieChartPopupComponent
  ],
  templateUrl: './ta21-popup.component.html',
  styleUrls: ['./ta21-popup.component.scss'],
})
export class Ta21PopupComponent implements OnInit, OnChanges {
  public status: string;
  @Input() mainType: string = '';
  @Input() ta21Data: string = '';

  @Output() pointClicked = new EventEmitter<{
    seriesIndex: number;
    cap: string;
  }>();
  isPopupVisible: boolean = false;

  @Output() togglePopupEvent = new EventEmitter<boolean>();
  pieData: any[];
  columnData: any = [];
  tableData: any;

  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
    this.cdr.detectChanges();
  }
  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef,
  ) {}

  async handlePointClick(event: { seriesIndex: number; cap: string }) {
    const { seriesIndex, cap } = event;
    if (seriesIndex === 0) {
      this.status = 'up';
    } else {
      this.status = 'down';
    }
    let tempTable = await this.supabase.getDanhSachServerTA21(
      1,
      8,
      this.status,
      this.ta21Data,
    );
    console.log(tempTable?.items);
    this.tableData = tempTable;
    this.cdr.detectChanges();
  }

  async ngOnInit() {
    if (!localStorage.getItem('getUnit')) {
      let getUnits = await this.supabase.getUnit();
      localStorage.setItem('getUnit', JSON.stringify(getUnits));
    }
    this.updateData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ta21Data'] && !changes['ta21Data'].firstChange) {
      this.updateData();
    }
  }

  async updateData() {
    let thongKeTa21 = await this.supabase.getThongKeBieuDoPieTa21(
      this.ta21Data,
    );
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

    let thongKeBieuDoCotTa21 = await this.supabase.getDanhSachServerTa21ByCap(
      this.ta21Data,
    );
    this.columnData = thongKeBieuDoCotTa21;
    let tempTable = await this.supabase.getDanhSachServerTA21(
      1,
      5,
      undefined,
      this.ta21Data,
    );
    this.tableData = tempTable;

    this.cdr.detectChanges();
  }
}
