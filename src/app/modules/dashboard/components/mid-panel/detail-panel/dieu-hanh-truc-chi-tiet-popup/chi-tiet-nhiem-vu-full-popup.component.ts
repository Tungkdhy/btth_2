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
import { CONFIG } from 'src/environments/environment';
import { AccumulationDataLabelSettingsModel } from '@syncfusion/ej2-angular-charts';
import { formatDateVI } from 'src/app/_metronic/layout/core/common/common-utils';

import {
  NgbPagination,
  NgbPaginationModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NumberFormatPipe } from 'src/app/core/pipes/number-format/number-format.pipe';
import { StatisticPieChartPopupComponent } from '../../../shared/statistic-chart-popup/statistic-pie-chart-popup.component';
@Component({
  selector: 'app-dieu-hanh-truc-chi-tiet-popup',
  standalone: true,
  imports: [
    CommonModule,
    TableDetail1Component,
    ColumnChartLeftPanelComponent,
    CommonModule,
    NgbPagination,
    FormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NumberFormatPipe,
    StatisticPieChartPopupComponent
  ],
  templateUrl: './chi-tiet-nhiem-vu-full-popup.component.html',
  styleUrls: ['./chi-tiet-nhiem-vu-full-popup.component.scss'],
})
export class ChiTietDieuHanhComponent implements OnInit {
  @Input() mainType: string = '';
  activeTab: string = 'daily';
  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();
  pieData: any[];
  columnData: any[] = [];
  tableDataHangNgay: any;
  tableDataDuKien: any;
  tableDataTuan: any;
  page = 1;
  pageSize = 10;
  total = 10;

  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }
  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef,
  ) {}
  formatDateWithDay(dateString: string): string[] {
    const date = new Date(dateString);
    const daysOfWeek = [
      'Chủ Nhật',
      'Thứ Hai',
      'Thứ Ba',
      'Thứ Tư',
      'Thứ Năm',
      'Thứ Sáu',
      'Thứ Bảy',
    ];
    const dayOfWeek = daysOfWeek[date.getDay()];
    return [`${dayOfWeek} `, this.formatDateNew(dateString)];
  }

  formatDate(date: any) {
    const dateObj = new Date(date);
    const formattedDate = `${dateObj.getFullYear()}-${String(
      dateObj.getMonth() + 1,
    ).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

    return formattedDate;
  }
  formatDateNew(date: any) {
    const dateObj = new Date(date);
    const formattedDate = `${String(dateObj.getDate()).padStart(
      2,
      '0',
    )}-${String(dateObj.getMonth() + 1).padStart(
      2,
      '0',
    )}-${dateObj.getFullYear()}`;

    return formattedDate;
  }

  getStartOfWeek(): Date {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(now.setDate(diff));
  }
  async ngOnInit() {
    const now = new Date();
    const startOfWeek = this.getStartOfWeek();
    this.tableDataHangNgay = await this.supabase.getDanhSachThucHienNhiemVu();
    this.tableDataDuKien = await this.supabase.getDanhSachThucHienNhiemVu(
      this.formatDate(now),
      'ngay',
    );
    this.tableDataTuan = await this.supabase.getDanhSachThucHienNhiemVu(
      this.formatDate(now),
      'tuan',
    );
    console.error(this.tableDataHangNgay, this.tableDataDuKien);
    this.cdr.detectChanges();
  }
}
