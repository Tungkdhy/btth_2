import {Component, Input, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import { CommonModule }                                            from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  SocketService
}                                                                  from "src/app/modules/dashboard/services/socket.service";
import {
  SupabaseService
}                                                                  from "src/app/modules/dashboard/services/supabase.service";
import { CONFIG } from 'src/environments/environment';
import {
  NgbCalendar,
  NgbDate,
  NgbDateStruct,
  NgbInputDatepicker,
} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-form',
  // imports: [CommonModule, FormsModule],
  imports: [CommonModule, FormsModule, NgbInputDatepicker],
  templateUrl: './form.component.html',
  standalone: true,
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {

  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef,
    private socket: SocketService,
  ) { }
  currentItem: any;
  @Output() formDataTableChanged = new EventEmitter<any>();
  @Input() trichYeu: any;
  @Input() ngayGiaoViec: any;
  @Input() hanXuLy: any;
  onDateSelect(event: any, dateType: string) {
    const date = new Date(event.year, event.month - 1, event.day);
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    if (dateType === 'deadline' && this.currentItem) {
      const updatedItem = {
        ...this.currentItem,
        deadline: formattedDate,
      };
      this.formDataTableChanged.emit(updatedItem);
    }
  }
  updateTrichYeu(item: any) {
    const updatedItem = {
      id: item.id,
      name: item.name,
      isChecked: item.isChecked,
      task: item.task || this.trichYeu,
      deadline: item.deadline || this.hanXuLy,
      xuLiChinh: item.xuLiChinh,
    };

    this.formDataTableChanged.emit(updatedItem);
  }
  public dsDonViNhanNhiemVu: any;
  async getDSDonViNhanNhiemVu() {
    let response = await fetch(
      `${CONFIG.API.BACKEND.DIEU_HANH_TRUC_URL}/api/DSDonViNhanNhiemVu`,
    );
    let data = await response.json();
    // let data:any  = [
    //   {
    //     id: '003501',
    //     name: 'Phòng Tham mưu',
    //     viettat: 'TM',
    //   },
    //   {
    //     id: '003502',
    //     name: 'Phòng Chính trị',
    //     viettat: 'CT',
    //   },
    //   {
    //     id: '003503',
    //     name: 'Phòng Hậu cần',
    //     viettat: 'HC',
    //   },
    //   {
    //     id: '003504',
    //     name: 'Phòng Kỹ thuật',
    //     viettat: 'KT',
    //   },
    //   {
    //     id: '003506',
    //     name: 'Phòng ATTT',
    //     viettat: 'AT',
    //   },
    //   {
    //     id: '003505',
    //     name: 'Phòng Phần mềm và CSDL',
    //     viettat: 'PM',
    //   },
    //   {
    //     id: '003514',
    //     name: 'Văn phòng',
    //     viettat: 'VP',
    //   },
    //   {
    //     id: '003516',
    //     name: 'Phòng Tài chính',
    //     viettat: 'TCh',
    //   },
    //   {
    //     id: '003517',
    //     name: 'Ban KHQS',
    //     viettat: 'KHQS',
    //   },
    //   {
    //     id: '003510',
    //     name: 'Lữ đoàn 1',
    //     viettat: 'T1',
    //   },
    //   {
    //     id: '003511',
    //     name: 'Lữ đoàn 2',
    //     viettat: 'T2',
    //   },
    //   {
    //     id: '003512',
    //     name: 'Lữ đoàn 3',
    //     viettat: 'T3',
    //   },
    //   {
    //     id: '003508',
    //     name: 'Trung tâm 586',
    //     viettat: 'T586',
    //   },
    //   {
    //     id: '003507',
    //     name: 'Viện 10',
    //     viettat: 'V10',
    //   },
    //   {
    //     id: '003509',
    //     name: 'Trung tâm Dữ liệu BQP',
    //     viettat: 'T6',
    //   },
    //   {
    //     id: '003515',
    //     name: 'Trung tâm Kiểm định',
    //     viettat: 'T7',
    //   },
    //   {
    //     id: '003518',
    //     name: 'Thanh tra BTL',
    //     viettat: 'ThanhTra',
    //   },
    //   {
    //     id: '003519',
    //     name: 'Ủy ban Kiểm tra Đảng',
    //     viettat: 'UBKT',
    //   },
    // ];
    this.dsDonViNhanNhiemVu = data;
  }
  async ngOnInit(): Promise<void> {
    this.getDSDonViNhanNhiemVu();
    this.cdr.detectChanges();

  }
}
