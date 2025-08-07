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
      noi_dung: 'Tăng cường bảo mật và che giấu dấu vết sau hoạt động khai thác thành công hệ thống VietcomBank',
      nguoi_giao: 'Thiếu tá Mai Thanh Tùng - Chuyên viên An ninh mạng',
      ngay_giao: '20250131153000',
      trang_thai: 'Chưa thực hiện',
      total_count: 5,
      current_page: 1,
      total_pages: 3,
      has_more: true
    },
    {
      id: 'ec316211-ec31-4459-b6e6-1b0f91b85941',
      noi_dung: 'Chuẩn bị báo cáo tiến độ tác chiến quý I/2025 trình lên lãnh đạo Bộ',
      nguoi_giao: 'Trung tá Phạm Đức Hùng - Phó Trưởng phòng TC',
      ngay_giao: '20250131070000',
      trang_thai: 'Đã thực hiện',
      total_count: 5,
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
    if (trangThai.includes('Chưa')) return 'dot orange';
    if (trangThai.includes('Đã')) return 'dot green';
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
        this.data = res || [];
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
