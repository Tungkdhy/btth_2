import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { Constant } from 'src/app/core/config/constant';
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';
import { ColumnChartTrienKhaiPanelComponent } from './column-chart-trien-khai-panel/column-chart-trien-khai-panel.component';
import { LineChartIdentPanelComponent } from "./line-chart-ident-panel/line-chart-ident-panel.component";

@Component({
  selector: 'app-security-popup',
  standalone: true,
  imports: [CommonModule, LineChartIdentPanelComponent, ColumnChartTrienKhaiPanelComponent],
  templateUrl: './security-popup.component.html',
  styleUrls: ['./security-popup.component.scss'],
})
export class SecurityPopupComponent {

  type: string = 'date';
  @Input() mainType: string = '';
  @Input() regionType: string = 'all';
  @Input() subType: string = "728";
  @Input() startDate: string = "";
  @Input() endDate: string = "";

  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();


  lineDinhDanh: any[] = [];
  columnTrienKhai: any[] = [];

  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }
  constructor(
    private supabase: SupabaseService,
    private convertService: ConvertServiceComponent,
    private cdr: ChangeDetectorRef,
  ) { }


  async changeSelect(type: any) {
    this.type = type;
    this.columnTrienKhai = await this.supabase.getF_Attt_Enp_TrienKhai(this.mainType, this.subType, this.convertService.getRegionType(this.regionType), null,type,this.getDateDependOnType(this.type), this.supabase.endOfDayFormatted(Date.now()));

    await this.getBieuDoLineDinhDanh();

    this.cdr.detectChanges();
  }

  getValueColumnName(name: string): string {
    let key: any = {
      'IDENT':"Định danh",
      'UNIDENT':'Chưa định danh',
    };

    return key[name] || '';
  }
  getDateDependOnType(type:string){
    switch (type) {
      case 'date':
        return this.supabase.startOfDayFormatted(Date.now() - 7*86400000);
      case 'week':
        return this.getMondayOfWeeksAgo(7);
      case 'month':
        return this.getStartOfMonth(7);
    }
  }
  getStartOfMonth(monthsAgo:number) {
    let date = new Date(); // Lấy ngày hiện tại
    date.setMonth(date.getMonth() - monthsAgo); // Lùi lại số tháng mong muốn
    date.setDate(1); // Đặt ngày thành 1 để lấy ngày đầu tiên của tháng
    date.setHours(0, 0, 0, 0); // Đặt thời gian về đầu ngày
    return this.supabase.startOfDayFormatted(date);
  }
  getMondayOfWeeksAgo(weeksAgo:number) {
    let date = new Date(); // Lấy ngày hiện tại
    let currentDay = date.getDay(); // Lấy chỉ số của ngày trong tuần (0 = Chủ Nhật, 1 = Thứ Hai, ...)
    let daysSinceMonday = (currentDay + 6) % 7; // Tính số ngày từ thứ Hai gần nhất
    let daysToMove = (weeksAgo * 7) + daysSinceMonday; // Tổng số ngày cần lùi
    date.setDate(date.getDate() - daysToMove); // Lùi lại số ngày mong muốn
    date.setHours(0, 0, 0, 0); // Đặt thời gian về đầu ngày
    return this.supabase.startOfDayFormatted(date);
  }

  async ngOnInit() {

    if (this.subType == Constant.SUB_TYPE_DEVICE.ALL) {
      if (this.mainType == Constant.MAIN_TYPE.QS) {
        this.subType = Constant.SUB_TYPE_DEVICE.QS_QP;
      } else if (this.mainType == Constant.MAIN_TYPE.CD) {
        this.subType = Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA;
      }
    }

    this.columnTrienKhai = await this.supabase.getF_Attt_Enp_TrienKhai(this.mainType, this.subType, this.convertService.getRegionType(this.regionType), null,this.type,this.getDateDependOnType(this.type), this.supabase.endOfDayFormatted(Date.now()));

    await this.getBieuDoLineDinhDanh();

    this.cdr.detectChanges();
  }

  async getBieuDoLineDinhDanh(){

    this.lineDinhDanh = await this.supabase.getF_Attt_Enp_Dinhdanh(this.mainType, this.subType, this.convertService.getRegionType(this.regionType), null,this.type,this.getDateDependOnType(this.type), this.supabase.endOfDayFormatted(Date.now()));

    let lastActiveDates = this.lineDinhDanh.flatMap(item => item.data).sort((a, b) => b.delta - a.delta).map(item => item.first_install_date);

    // let lastActiveDates = this.lineDinhDanh.flatMap(item => item.data.map((entry: any) => entry.first_install_date));

      this.lineDinhDanh.forEach((group: any) => {
        lastActiveDates.forEach(date => {
          // Kiểm tra nếu ngày đã tồn tại
          const existingEntry = group.data.find((entry: any) => entry.first_install_date === date);
          if (!existingEntry) {
            // Nếu không tồn tại, thêm mới với tong và delta = 0
            group.data.push({ first_install_date: date, tong: 0, delta: 0 });
          }
        });
      });
      this.lineDinhDanh.forEach(group => {
        group.data.sort((a: any, b: any) => a.first_install_date.localeCompare(b.first_install_date));
      });
  }

}
