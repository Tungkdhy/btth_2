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
import { ColumnChartConTonPanelComponent } from "./column-chart-con-ton-panel/column-chart-con-ton-panel.component";
import { LineChartLeftPanelComponent } from "./line-chart-left-panel/line-chart-left-panel.component";

@Component({
  selector: 'app-safety-information-alert-second-popup',
  standalone: true,
  imports: [CommonModule, ColumnChartConTonPanelComponent, LineChartLeftPanelComponent],
  templateUrl: './safety-information-alert-second-popup.component.html',
  styleUrls: ['./safety-information-alert-second-popup.component.scss'],
})
export class SafetyInformationAlertSecondPopupComponent {

  type: string = 'date';
  suCoSecurity: any;
  @Input() mainType: string = '';
  @Input() regionType: string = 'all';
  @Input() subType: string = "728";
  @Input() startDate: string = "";
  @Input() endDate: string = "";

  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();

  columnConTonData: any[] = [];
  lineMKNData: any[] = [];
  columnQuaHanData: any[] = [];

  orderSTT:any = {
    'INTERNET':1,
    'BLACK_DOMAIN':2,
    'MALWARE':3,
    'HUNTING':4,
  };
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

    this.suCoSecurity = await this.supabase.getSuCoSecurityCatSecond(this.mainType, this.subType, this.convertService.getRegionType(this.regionType), null,type,this.getDateDependOnType(this.type), this.supabase.endOfDayFormatted(Date.now()));

    // let tempArray = [];

    // let suCoSecurity = this.suCoSecurity.sort((a:any, b:any) => this.orderSTT[a.name] - this.orderSTT[b.name]);

    //  for (let item of suCoSecurity) {
    //    tempArray.push({
    //      name: this.getValueColumnName(item?.name),
    //      trong_x: item?.data?.filter((e: any) => e?.delta == 0)?.reduce((sum: number, item: any) => sum + item?.tong, 0),
    //      homqua_x: item?.data?.filter((e: any) => e?.delta == 1)?.reduce((sum: number, item: any) => sum + item?.tong, 0),
    //      con_ton: item?.data?.filter((e: any) => e?.delta != 0)?.reduce((sum: number, item: any) => sum + item?.tong, 0)
    //    });
    //  };
    //  this.columnConTonData = tempArray;
    // this.lineMKNData = suCoSecurity;
    this.getBieuDoConTon();
    this.getBieuDoLineMatATTT();

    this.cdr.detectChanges();
  }

  getValueColumnName(name: string): string {
    let key: any = {
      'INTERNET':"Internet",
      'BLACK_DOMAIN':'Truy vấn độc hại',
      'MALWARE':'Mã độc',
      'HUNTING':"Bất thường",
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

    this.suCoSecurity = await this.supabase.getSuCoSecurityCatSecond(this.mainType, this.subType, this.convertService.getRegionType(this.regionType), null,this.type,this.getDateDependOnType(this.type), this.supabase.endOfDayFormatted(Date.now()));

    this.getBieuDoConTon();
    this.getBieuDoLineMatATTT();
    this.cdr.detectChanges();
    }

    getBieuDoConTon(){

      let tempArray = [];

      let suCoSecurity = this.suCoSecurity.sort((a:any, b:any) => this.orderSTT[a.name] - this.orderSTT[b.name]);

       for (let item of suCoSecurity) {
         tempArray.push({
           name: this.getValueColumnName(item?.name),
           trong_x: item?.data?.filter((e: any) => e?.delta == 0)?.reduce((sum: number, item: any) => sum + item?.tong, 0),
           homqua_x: item?.data?.filter((e: any) => e?.delta == 1)?.reduce((sum: number, item: any) => sum + item?.tong, 0),
           con_ton: item?.data?.filter((e: any) => e?.delta > 1)?.reduce((sum: number, item: any) => sum + item?.tong, 0)
         });
       };
      this.columnConTonData = tempArray;
    }


    getBieuDoLineMatATTT(){

      this.lineMKNData = this.suCoSecurity;

      let lastActiveDates = this.lineMKNData.flatMap(item => item.data).sort((a, b) => b.delta - a.delta).map(item => item.last_active_date);;

      this.lineMKNData.forEach((group: any) => {
        lastActiveDates.forEach(date => {
          // Kiểm tra nếu ngày đã tồn tại
          const existingEntry = group.data.find((entry: any) => entry.last_active_date === date);
          if (!existingEntry) {
            // Nếu không tồn tại, thêm mới với tong và delta = 0
            group.data.push({ last_active_date: date, tong: 0, delta: 0 });
          }
        });
      });
      this.lineMKNData.forEach(group => {
        group.data.sort((a: any, b: any) => a.last_active_date.localeCompare(b.last_active_date));
      });
    }
}
