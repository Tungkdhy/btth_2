import { Component, inject, EventEmitter, Input, Output } from '@angular/core';
import {
  NgbCalendar,
  NgbDate,
  NgbDatepickerModule,
  NgbDateStruct,
  NgbInputDatepicker,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { FormComponent } from './form/form.component';
import { SearchOperatorComponent } from './search-operator/search-oper.component';
import { FormInputOperaComponent } from './form-input-opera/form-input-opera.component';
import { CONFIG } from 'src/environments/environment';

@Component({
  selector: 'app-add-operator',
  templateUrl: './add-operator.component.html',
  standalone: true,
  imports: [
    FormComponent,
    NgbInputDatepicker,
    FormsModule,
    FormInputOperaComponent,
    SearchOperatorComponent,
  ],
  styleUrls: ['./add-operator.component.scss'],
})
export class AddOperatorComponent {
  @Input() mainType: string = '';
  @Input() regionType: string = 'all';

  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();
  pieData: any[];
  columnData: any[] = [];
  tableData: any;

  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }

  dataOpera: any = {};
  formDataTableArray: any[] = [];
  formDataFileArray: any[] = [];
  trichYeu: string = '';
  ngayGiaoViec: string = '';
  hanXuLy: string = '';
  onNgayGiaoViecChange(ngayGiaoViec: string) {
    // Xử lý giá trị ngày giao việc
    this.ngayGiaoViec = ngayGiaoViec;
  }

  onHanXuLyChange(hanXuLy: string) {
    this.hanXuLy = hanXuLy;
  }
  onTrichYeuChange(updatedValue: string) {
    this.trichYeu = updatedValue;
  }
  handleFormDataOperaChange(formData: any) {
    this.dataOpera = formData;
  }
  handleFormDataTableChanged(formData: any) {
    if (formData.isChecked) {
      // Add or update the formData in the array
      const index = this.formDataTableArray.findIndex(
        (item) => item.id === formData.id,
      );
      if (index !== -1) {
        this.formDataTableArray[index] = formData;
      } else {
        this.formDataTableArray.push(formData);
      }
    } else {
      this.formDataTableArray = this.formDataTableArray.filter(
        (item) => item.id !== formData.id,
      );
    }
  }

  handleUploadedFiles(files: File[]) {
    this.formDataFileArray = files;
  }

  onSaveClick() {
    console.log('Data in the class:', {
      oper: this.dataOpera,
      files: this.formDataFileArray,
      table: this.formDataTableArray,
    });
    const formData = new FormData();
    let url = `${CONFIG.API.BACKEND.DIEU_HANH_TRUC_URL}/api/TaoNhiemVu_HTTH`;
    formData.append('TrichYeu', this.trichYeu);
    formData.append('NoiDung', this.dataOpera.noiDung);
    formData.append('NguoiTao', 'admin');
    formData.append('ID_NguonTin', this.dataOpera.nguonTin);
    formData.append('ID_LoaiTin', this.dataOpera.loaiTin);
    formData.append('ID_DoKhan', this.dataOpera.doKhan);
    formData.append('ID_NguoiGiao', this.dataOpera.nguoiGiao);
    formData.append('ID_ChuDe', this.dataOpera.vuviecnong);
    formData.append('IsNoiBo', this.dataOpera.tinNoiBo);
    const hanXuLy = new Date(
      this.dataOpera.hanXuLy.year,
      this.dataOpera.hanXuLy.month - 1,
      this.dataOpera.hanXuLy.day,
    );
    const formattedHanXuLy = hanXuLy.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    formData.append('ThoiHanXuLy', formattedHanXuLy);

    const ngayTao = new Date(
      this.dataOpera.ngayGiaoViec.year,
      this.dataOpera.ngayGiaoViec.month - 1,
      this.dataOpera.ngayGiaoViec.day,
    );
    const formattedDateNgayTao = ngayTao.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    formData.append('NgayTao', formattedDateNgayTao);
    formData.append('TinNhan', this.dataOpera.tinNhan);
    formData.append('tb', '1');
    formData.append('TenTaiKhoan', 'admin');
    formData.append('ID_NguoiGiao', this.dataOpera.nguoiGiao);

    let jsonArrayDonViNhanNV = this.formDataTableArray.map((item) => {
      const date = new Date(
        this.dataOpera.ngayGiaoViec.year,
        this.dataOpera.ngayGiaoViec.month - 1,
        this.dataOpera.ngayGiaoViec.day,
      );
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      return {
        iddonvi: item.id,
        nhiemvu: item.task,
        donvixulychinh: item.isChecked ? '1' : '0',
        denngay: formattedDate,
        tghoanthanh: item.deadline,
      };
    });
    formData.append(
      'jsonArrayDonViNhanNV',
      JSON.stringify(jsonArrayDonViNhanNV),
    );
    // Append each file individually
    this.formDataFileArray.forEach((file, index) => {
      console.log(typeof file);
      formData.append(`file`, file);
    });

    fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Data sent successfully', data);
        // Handle success
        alert('Dữ liêu đã được gửi thành công');
        this.togglePopup(false);
      })
      .catch((error) => {
        console.error('Error sending data:', error);
        alert('Dữ liêu đã được gửi thất bại');
        // Handle error
      });

    // You can replace 'this.yourDataProperty' with the actual property or object containing the data you want to print
  }
}

// {
//   "oper": {
//       "trichYeu": "Nhiem vu A",
//       "noiDung": "test",
//       "loaiTin": "1",
//       "doKhan": "2",
//       "nguonTin": "4",
//       "nguoiGiao": "2",
//       "ngayGiaoViec": {
//           "year": 2024,
//           "month": 8,
//           "day": 16
//       },
//       "hanXuLy": {
//           "year": 2024,
//           "month": 8,
//           "day": 16
//       },
//       "vuviecnong": "21",
//       "tinNhan": "asdds",
//       "tinNoiBo": true
//   },
//   "files": [
//       {}
//   ],
//   "table": [
//       {
//           "id": "003501",
//            "task": "Nhiem vu A",
//           "isChecked": true,
//
//           "deadline": "16/08/2024",
//           "xuLiChinh": true
//       },
//       {
//           "id": "003502",
//           "name": "Phòng Chính trị",
//           "isChecked": true,
//           "task": "Nhiem vu A",
//           "deadline": "16/08/2024"
//       },
//       {
//           "id": "003503",
//           "name": "Phòng Hậu cần",
//           "isChecked": true,
//           "task": "Nhiem vu A",
//           "deadline": "16/08/2024"
//       },
//       {
//           "id": "003504",
//           "name": "Phòng Kỹ thuật",
//           "isChecked": true,
//           "task": "Nhiem vu A",
//           "deadline": "16/08/2024"
//       }
//   ]
// }
