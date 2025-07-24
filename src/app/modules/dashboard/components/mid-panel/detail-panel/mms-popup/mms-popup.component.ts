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
  selector: 'app-mms-popup',
  standalone: true,
  imports: [
    CommonModule,
    TableDetail1Component,
    ColumnChartLeftPanelComponent,
    StatisticPieChartPopupComponent
  ],
  templateUrl: './mms-popup.component.html',
  styleUrls: ['./mms-popup.component.scss'],
})
export class MMSPopupComponent implements OnInit {
  @Input() mainType: string = '';

  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();
  columnData: any[] = [];
  tableData: any;
  pieData: any[];

  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }
  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    if (!localStorage.getItem('getUnit')) {
      let getUnits = await this.supabase.getUnit();
      localStorage.setItem('getUnit', JSON.stringify(getUnits));
    }

    let thongKeFMS_FMC = await this.supabase.getThongKeBieuDoPieMMS();
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
      'CD',
    );
    this.columnData = thongKeBieuDoCotFms.items;
    let tempTable = await this.supabase.getDanhSachServerMMS();
    this.tableData = tempTable;

    this.cdr.detectChanges();
  }
}
