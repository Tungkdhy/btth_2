import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BadgeComponent } from '../badge/badge.component';
import { ChangeDetectorRef } from '@angular/core';

// import { ApiTcmService } from 'src/app/services/api-tcm.service'; // Đường dẫn service bạn thay cho đúng
import { ApiTcmService } from '../../../services/tcm.service';
import { HttpClientModule } from '@angular/common/http';
import dayjs from 'dayjs';

@Component({
  selector: 'app-table-ptm-tsm',
  templateUrl: './table-ptm-tsm.component.html',
  styleUrls: ['./table-ptm-tsm.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, BadgeComponent],
})
export class TablePtmTSMComponent {
  @Input() height: string = '340px';
  @Input() data: any;
  @Input() showExpanded: boolean = false;
  @Output() rowClicked = new EventEmitter<any>();

  expandedRowId: number | null = null;

  constructor(private apiTcmService: ApiTcmService, private cdr: ChangeDetectorRef) {}

  onRowClick(row: any) {
    console.log(row);

    // Đổi trạng thái mở rộng / thu gọn
    this.expandedRowId = this.expandedRowId === row.stt ? null : row.stt;

    // Emit cho cha nếu cần
    this.rowClicked.emit(row);

    // Chỉ gọi API khi mở rộng
    if (this.expandedRowId) {
      const body: any = {
        p_huong_tc: row.huong_tc || row.direction, // ưu tiên huong_tc nếu có
        p_start_date: '20240101000000',
        p_end_date: '20251231235959',
        p_limit: 10,
        p_offset: 0,
      };

      this.apiTcmService.getBaoCaoChuyenSau(body).subscribe({
        next: (res: any) => {
          console.log('📌 Kết quả báo cáo chuyên sâu:', res);
          row.details = res; // gán kết quả để hiển thị bảng con
          const items = Array.isArray(res) ? res : [res];

        // Map dữ liệu cho bảng con
        row.details = items.map((item: any, index: number) => ({
          stt: index + 1,
          tenBaoCao: item.ten_bao_cao,
          phatHanh: dayjs(item.ngay_tao, 'YYYYMMDDHHmmss').format('DD/MM/YYYY'),
          muc: item.cap_bao_cao,
          icon: '🟢', // Có thể đổi theo cap_bao_cao nếu muốn
        }));
        this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('❌ Lỗi API:', err);
        },
      });
    }
  }
}
