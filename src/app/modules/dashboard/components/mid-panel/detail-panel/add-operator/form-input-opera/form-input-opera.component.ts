import { getEntityById } from './../../../../../../digital-map/models/entity.model';
import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CONFIG } from 'src/environments/environment';
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbInputDatepicker,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-form-input-opera',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbInputDatepicker],
  templateUrl: './form-input-opera.component.html',
  styleUrls: ['./form-input-opera.component.scss'],
})
export class FormInputOperaComponent {
  constructor(private ngbDateParserFormatter: NgbDateParserFormatter) {
    this.ngbDateParserFormatter.format = (date: NgbDateStruct): string => {
      if (date) {
        return `${this.padNumber(date.day)}-${this.padNumber(date.month)}-${
          date.year
        }`;
      }
      return '';
    };
  }

  private padNumber(value: number) {
    return value < 10 ? `0${value}` : value.toString();
  }

  @Output() ngayGiaoViecChange = new EventEmitter<string>();
  @Output() hanXuLyChange = new EventEmitter<string>();

  onDateSelect(event: any, dateType: string) {
    if (dateType === 'assignmentDate') {
      const date = new Date(event.year, event.month - 1, event.day);
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      this.ngayGiaoViecChange.emit(formattedDate);
    } else if (dateType === 'dueDate') {
      const date = new Date(event.year, event.month - 1, event.day);
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      this.hanXuLyChange.emit(formattedDate);
    }
  }
  @Input() trichYeu: string;
  @Output() trichYeuChange = new EventEmitter<string>();
  @Output() formDataOperaChange = new EventEmitter<any>();
  updateDataTrichYeu(newData: string) {
    this.trichYeu = newData;
    this.formData.trichYeu = newData;
    this.trichYeuChange.emit(this.trichYeu);
    this.updateFormData();
  }

  formData = {
    trichYeu: '',
    noiDung: '',
    loaiTin: '',
    doKhan: '',
    nguonTin: '',
    nguoiGiao: '',
    ngayGiaoViec: null,
    hanXuLy: null,
    vuviecnong: '',
    tinNhan: '',
    tinNoiBo: false,
  };

  updateFormData() {
    this.formDataOperaChange.emit(this.formData);
  }
  //--------params-------------
  private calendar = inject(NgbCalendar);
  public dsLoaiTin: any;
  public dsDoKhan: any;
  public dsNguonTin: any;
  public dsNguoiGiaoNhiemVu: any;
  public dsVuViecNong: any;
  //----------------
  model: NgbDateStruct;

  isDisabled = (date: NgbDate, current: { month: number; year: number }) =>
    date.month !== current.month;
  isWeekend = (date: NgbDate) => this.calendar.getWeekday(date) >= 6;

  async getDSVuViecNong() {
    let response = await fetch(
      `${CONFIG.API.BACKEND.DIEU_HANH_TRUC_URL}/api/DSVuViecNong`,
    );
    let data = await response.json();
    // let data = [
    //   {
    //     id: '24',
    //     name: 'Quân nhân Trần Nguyễn Việt Thắng cầm dao - QK7',
    //   },
    //   {
    //     id: '0302',
    //     name: 'Vụ việc n1',
    //   },
    //   {
    //     id: '0301',
    //     name: 'Vụ việc nnnn',
    //   },
    // ];
    this.dsVuViecNong = data;
    // console.log(this.dsVuViecNong);
  }
  async getDSNguoiGiaoNhiemVu() {
    let response = await fetch(
      `${CONFIG.API.BACKEND.DIEU_HANH_TRUC_URL}/api/DSNguoiGiaoNhiemVu`,
    );
    let data = await response.json();
    // let data = [
    //   {
    //     id: 1,
    //     name: 'Thủ trưởng A',
    //   },
    //   {
    //     id: 2,
    //     name: 'Thủ trưởng B',
    //   },
    // ];
    this.dsNguoiGiaoNhiemVu = data;
  }

  async getDSNguonTin() {
    let response = await fetch(
      `${CONFIG.API.BACKEND.DIEU_HANH_TRUC_URL}/api/DSNguonTin`,
    );
    let data = await response.json();
    // let data = [
    //   {
    //     id: 1,
    //     name: 'Thủ trưởng Bộ',
    //   },
    //   {
    //     id: 3,
    //     name: 'Thủ trưởng BTL',
    //   },
    //   {
    //     id: 4,
    //     name: 'Cơ quan BTL',
    //   },
    //   {
    //     id: 2,
    //     name: 'Cơ Quan hiệp đồng',
    //   },
    //   {
    //     id: 5,
    //     name: 'Thủ trưởng Lữ đoàn',
    //   },
    // ];
    this.dsNguonTin = data;
  }

  async getDSDoKhan() {
    let response = await fetch(
      `${CONFIG.API.BACKEND.DIEU_HANH_TRUC_URL}/api/DSDoKhan`,
    );
    let data = await response.json();
    // let data = [
    //   {
    //     id: '1',
    //     name: 'Thường',
    //   },
    //   {
    //     id: '2',
    //     name: 'Khẩn',
    //   },
    //   {
    //     id: '3',
    //     name: 'Hẹn giờ',
    //   },
    //   {
    //     id: '4',
    //     name: 'Hỏa tốc',
    //   },
    //   {
    //     id: '5',
    //     name: 'Thượng khẩn',
    //   },
    // ];
    this.dsDoKhan = data;
  }
  async getDSLoaiTin() {
    let response = await fetch(
      `${CONFIG.API.BACKEND.DIEU_HANH_TRUC_URL}/api/DSLoaiTin`,
    );
    let data = await response.json();
    // let data = [
    //   {
    //     id: 1,
    //     name: 'Trinh sát, giám sát',
    //   },
    //   {
    //     id: 2,
    //     name: 'Tác chiến thông tin',
    //   },
    //   {
    //     id: 6,
    //     name: 'Phần mềm và CSDL',
    //   },
    //   {
    //     id: 7,
    //     name: 'Bảo đảm Kỹ thuật',
    //   },
    // ];
    this.dsLoaiTin = data;
  }
  async ngOnInit(): Promise<void> {
    this.getDSLoaiTin();
    this.getDSDoKhan();
    this.getDSNguonTin();
    this.getDSNguoiGiaoNhiemVu();
    this.getDSVuViecNong();
  }
}
