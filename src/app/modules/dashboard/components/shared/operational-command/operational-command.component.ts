import { data } from './../../right-panel/cyber-reconnaissance/datasource';
import { formatDate } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from '@syncfusion/ej2-angular-popups';
import { CONFIG } from 'src/environments/environment';
import {
  NgbPagination,
  NgbPaginationModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Observable, tap } from 'rxjs';
import { EventId } from '../../../models/btth.interface';
import { SocketService } from '../../../services/socket.service';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
@Component({
  selector: 'app-operational-command',
  standalone: true,
  imports: [CommonModule, TooltipModule, NgbPagination, NgbPaginationModule],
  templateUrl: './operational-command.component.html',
  styleUrls: ['./operational-command.component.scss'],
})
export class OperationalCommandComponent implements OnInit {
  @Output() popupToggled = new EventEmitter<{
    isPopupVisible: boolean;
    typePopup: string;
    data?: any;
  }>();
  startDate: string = formatDate(new Date(new Date()), 'dd/MM/yyyy', 'en-GB');
  endDate: string = formatDate(
    new Date(new Date().setDate(new Date().getDate() + 1)),
    'dd/MM/yyyy',
    'en-GB',
  );
  channel: RealtimeChannel;
  payloadData$: Observable<any>;
  shiftOperation: any;
  page: number = 1;
  pageSize = 3;
  total = 10;
  totalPage = 0;
  private socket = inject(SocketService);
  private cdr = inject(ChangeDetectorRef);
  constructor(private supabase: SupabaseService) {}
  async ngOnInit(): Promise<void> {
    let rangeTime = await this.supabase.getRangeTime();
    console.log(rangeTime);
    this.startDate = formatDate(rangeTime?.from, 'dd/MM/yyyy', 'en-GB');
    this.endDate = formatDate(rangeTime?.to, 'dd/MM/yyyy', 'en-GB');
    console.log(this.startDate, this.endDate);
    this.payloadData$ = this.socket.payload$.pipe(
      tap(async (payload) => {
        // Xử lý sự kiện Date và cập nhật startDate$
        if (payload?.payload?.type === EventId.DATE) {
          this.startDate = formatDate(
            new Date(payload.payload.data.startDate),
            'dd/MM/yyyy',
            'en-GB',
          );
          this.endDate = formatDate(
            new Date(payload.payload.data.endDate),
            'dd/MM/yyyy',
            'en-GB',
          );
          localStorage.setItem('startDate', this.startDate);
          localStorage.setItem('endDate', this.endDate);
          let response = await fetch(
            `${CONFIG.API.BACKEND.DIEU_HANH_TRUC_URL}/api/DSTindht?page=${this.page}&page_size=${this.pageSize}&tungay=${this.startDate}&denngay=${this.endDate}`,
          );

          let data = await response.json();
          this.shiftOperation = data;
          // this.pageSize = data.page_size;
          this.pageSize = 3;
          // this.total = data?.total_doccument;
          this.total = 10;
          this.page = data.current_page;
          this.cdr.detectChanges();
        }
      }),
    );
    let response = await fetch(
      `${CONFIG.API.BACKEND.DIEU_HANH_TRUC_URL}/api/DSTindht?page=${this.page}&page_size=${this.pageSize}&tungay=${this.startDate}&denngay=${this.endDate}`,
    );

    let data = await response.json();

    // this.total = data?.total_doccument;
    this.total = 10;
    this.shiftOperation = data;
    // this.pageSize = data.page_size;
    this.pageSize = 3;
    this.page = data.current_page;
    this.cdr.detectChanges();
  }

  async onPageChange(page = 1) {
    this.page = page;
    // let data = await this.supabase.getDanhSachServerFmc(page, this.pageSize);
    let response = await fetch(
      `${CONFIG.API.BACKEND.DIEU_HANH_TRUC_URL}/api/DSTindht?page=${this.page}&page_size=${this.pageSize}&tungay=${this.startDate}&denngay=${this.endDate}`,
    );

    let data = await response.json();
    // this.total = data?.total_doccument;
    
    this.shiftOperation = data;
    // this.pageSize = data.page_size;
    this.cdr.detectChanges();
  }

  async pagination(page_index: number, page_size: number) {
    if (page_index > 0) {
      let response = await fetch(
        `${CONFIG.API.BACKEND.DIEU_HANH_TRUC_URL}/api/DSTindht?page=${page_index}&page_size=${page_size}&tungay=${this.startDate}&denngay=${this.endDate}`,
      );

      let data = await response.json();

      this.shiftOperation = data;
    }
  }

  getValue(str: string) {}
  togglePopup(isPopupVisible: boolean, typePopup: string) {
    this.popupToggled.emit({ isPopupVisible, typePopup });
  }
  togglePopupChiTiet(isPopupVisible: boolean, typePopup: string, data: any) {
    this.popupToggled.emit({ isPopupVisible, typePopup, data });
  }
  getStatusClass(name: string): string {
    switch (name) {
      case 'Thường':
        return 'status-green';
      case 'Khẩn':
        return 'status-red';
      case 'Hẹn giờ':
        return 'status-pink';
      case 'Hỏa tốc':
        return 'status-red';
      case 'Thượng khẩn':
        return 'status-red';
      default:
        return '';
    }
  }
}
