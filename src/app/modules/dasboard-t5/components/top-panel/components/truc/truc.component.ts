import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, OnDestroy, Output, EventEmitter, } from '@angular/core';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import {
  NgbPagination,
  NgbPaginationModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ApiHeaderService } from 'src/app/modules/dasboard-t5/services/header.service';
// import { EventEmitter } from 'stream';
@Component({
  selector: 'app-truc',
  templateUrl: './truc.component.html',
  styleUrls: ['./truc.component.scss'],
  standalone: true,
  imports: [CommonModule, CustomTableComponent, NgbPagination,
    NgbPaginationModule,],
})
export class TrucComponent implements OnInit, OnDestroy {
  currentDateTime: Date = new Date();
  intervalId: any;
  page: number = 1;
  pageSize = 3;
  total = 10;
  totalPage = 0;
  @Output() popupToggled = new EventEmitter<{
    isPopupVisible: boolean;
    typePopup: string;
    data?: any;
  }>();
  data = [
    {
      id: '02ca63ed-043c-41f4-8390-19c09b3fd608',
      noi_dung: 'Tổng hợp thông tin liên quan đến hoạt động kỷ niệm 80 năm Cách mạng tháng Tám và Quốc Khánh 2/9 (Dư luận quốc tế)',
      nguoi_giao: '4// Nguyễn Tiền Giang - PTL-TMT',
      ngay_giao: '20250081753000',
      trang_thai: 'Đã thực hiện',
      total_count: 3,
      current_page: 1,
      total_pages: 3,
      has_more: true
    },
    {
      id: 'ec316211-ec31-4459-b6e6-1b0f91b85941',
      noi_dung: 'Tác chiến thông tin',
      nguoi_giao: '4// Nguyễn Tiền Giang - PTL-TMT',
      ngay_giao: '20250081270000',
      trang_thai: 'Đang thực hiện',
      total_count: 3,
      current_page: 1,
      total_pages: 3,
      has_more: true
    },
    {
      id: 'ec316211-ec31-4459-b6e6-1b0f91b85941',
      noi_dung: 'Trinh sát thông tin liên quan đến tài khoản Tiktok',
      nguoi_giao: '4// Nguyễn Tiền Giang - Phó TMT',
      ngay_giao: '20250812070000',
      trang_thai: 'Đang thực hiện',
      total_count: 3,
      current_page: 1,
      total_pages: 3,
      has_more: true
    }
  ];

  // Hàm format ngày từ chuỗi "yyyyMMddHHmmss"
  formatDate(dateString: string): string {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${day}/${month}/${year}`;
  }

  // Hàm lấy class màu trạng thái
  getStatusClass(trangThai: string): string {
    if (trangThai.includes('Chưa')) return 'dot red';
    if (trangThai.includes('Đã')) return 'dot green';
    if (trangThai.includes('Đang')) return 'dot orange';
    return ''
  }
  constructor(private cdr: ChangeDetectorRef, private apiHeaderService: ApiHeaderService) { }
  ngOnInit(): void {
    this.startRealTimeClock();
    const body = {
      "p_start_date": "20250121000000",
      "p_end_date": "20250831235959",
      "p_limit": 3,
      "p_offset": 0
    }
    this.apiHeaderService.fetchData(body).subscribe({
      next: (res) => {
        // this.data = res || [];
      },
      error: (err) => {
        console.error('Lỗi load dữ liệu:', err);
      }
    })
    this.cdr.detectChanges();
  }
  startRealTimeClock(): void {
    this.intervalId = setInterval(() => {
      this.currentDateTime = new Date();
      this.cdr.detectChanges();
    }, 1000); // Cập nhật mỗi 1 giây
  }
  async onPageChange(page = 1) {
    console.log(page);

    this.page = page;
    const body = {
      "p_start_date": "20250121000000",
      "p_end_date": "20250831235959",
      "p_limit": 3,
      "p_offset": page
    }
    this.apiHeaderService.fetchData(body).subscribe({
      next: (res) => {
        this.data = res || [];
      },
      error: (err) => {
        console.error('Lỗi load dữ liệu:', err);
      }
    })
    this.cdr.detectChanges();
    // let data = await this.supabase.getDanhSachServerFmc(page, this.pageSize);
    ;
  }
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  togglePopup(isPopupVisible: boolean, typePopup: string) {
    this.popupToggled.emit({ isPopupVisible, typePopup });
  }
  togglePopupChiTiet(isPopupVisible: boolean, typePopup: string, data: any) {
    this.popupToggled.emit({ isPopupVisible, typePopup, data });
  }
}
