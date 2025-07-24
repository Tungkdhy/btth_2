import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnChartLeftPanelComponent } from './column-chart-left-panel/column-chart-left-panel.component';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { TableDetail1Component } from './table-detail-fms/table-detail-1.component';
import { StatisticPieChartPopupComponent } from '../../../shared/statistic-chart-popup/statistic-pie-chart-popup.component';

@Component({
  selector: 'app-fms-popup',
  standalone: true,
  imports: [
    CommonModule,
    TableDetail1Component,
    ColumnChartLeftPanelComponent,
    StatisticPieChartPopupComponent
  ],
  templateUrl: './fms-popup.component.html',
  styleUrls: ['./fms-popup.component.scss'],
})
export class FmsPopupComponent implements OnInit {
  public status: string;
  @Input() mainType: string = '';
  @Output() pointClicked = new EventEmitter<{
    seriesIndex: number;
    cap: string;
  }>();
  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();
  pieData: any[];
  columnData: any[] = [];
  tableData: any;

  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }
  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef,
  ) {}
  async handlePointClick(event: { seriesIndex: number; cap: string }) {
    const { seriesIndex, cap } = event;
    // Thực hiện các hành động khác với seriesIndex và cap tại đây
    if (seriesIndex === 0) {
      this.status = 'up';
    } else {
      this.status = 'down';
    }
    let tempTable = await this.supabase.getDanhSachServerFmc(1, 8, this.status);
    this.tableData = tempTable;
    this.cdr.detectChanges();
  }
  async ngOnInit() {
    if (!localStorage.getItem('getUnit')) {
      let getUnits = await this.supabase.getUnit();
      localStorage.setItem('getUnit', JSON.stringify(getUnits));
    }

    let thongKeFMS_FMC = await this.supabase.getThongKeBieuDoPieFMS();
    this.pieData = [
      {
        x: 'Đang hoạt động',
        y: thongKeFMS_FMC.find((e: any) => e.status === 'up')?.count || 0,
      },
      {
        x: 'Mất kết nối',
        y: thongKeFMS_FMC.find((e: any) => e.status === 'down')?.count || 0,
      },
    ];

    let thongKeBieuDoCotFms = await this.supabase.getDanhSachServerFmcByCap(
      'QS',
    );
    console.log(thongKeBieuDoCotFms);
    this.columnData = thongKeBieuDoCotFms.items;
    console.log(this.columnData);

    let tempTable = await this.supabase.getDanhSachServerFmc();
    console.log(tempTable);
    this.tableData = tempTable;

    this.cdr.detectChanges();
  }
}
