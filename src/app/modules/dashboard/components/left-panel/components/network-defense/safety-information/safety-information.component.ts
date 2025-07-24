import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Constant } from 'src/app/core/config/constant';
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';
import { SupabaseSafeTyInformationService } from './services/supabase';
import { NumberFormatPipe } from 'src/app/core/pipes/number-format/number-format.pipe';
import { SupabaseItInfraService } from '../it-infras/services/supabase';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';

@Component({
  selector: 'app-safety-information',
  standalone: true,
  imports: [CommonModule, NumberFormatPipe],
  templateUrl: './safety-information.component.html',
  styleUrls: ['./safety-information.component.scss'],
})
export class SafetyInformationComponent implements OnInit {
  private intervalId: any;

  @Output() popupToggled = new EventEmitter<{
    isPopupVisible: boolean;
    typePopup: string;
    is_click_trong_ngay?: boolean;
    is_common_malware?: boolean;

    is_at_coban?:boolean;
    is_fe_duyet_3?:boolean;
    is_fe_duyet_4?:boolean;
    is_fe_duyet_5?:boolean;

    startDate: string;
    endDate: string;
  }>();
  @Output() changeTitlePopup = new EventEmitter<string>();
  titlePopup:string = ''
  public endPointDevice: Promise<any>;
  public maDocDaDuocLamSach: Promise<any>;
  public commonInDay: number;
  public commonAll: number;
  public record: any;
  public tongSo: any;
  public setting: any;

  @Input() mainType: string = '';
  @Input() subType: string = '728';
  @Input() regionType: string = 'all';
  @Input() startDate: string = '';
  @Input() endDate: string = '';

  isThietBiDauCuoi: boolean = false;
  isChuaDinhDanh: boolean = false;
  isDinhDanhChuaDongNhat: boolean = false;
  isMaDocThongThuong: boolean = false;
  isMayTinhDuocLamSach: boolean = false;
  isMangAnToan: boolean = false;
  isPheDuyet: boolean = false;

  constructor(
    private supabaseSafeTyInformationService: SupabaseSafeTyInformationService,
    private convertService: ConvertServiceComponent,
    private supabaseItInfraService: SupabaseItInfraService,
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef,
  ) {
  }

  async ngOnInit(): Promise<void> {
    // this.getData(this.mainType,this.subType,this.convertService.getRegionType(this.regionType));
  }
  ngOnDestroy(): void {
    // Xóa interval khi component bị hủy
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  resetInterval() {
    // Clear the existing interval

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    // Set a new interval
    let interval = setInterval(() => {
      this.getData(this.mainType, this.subType ,this.convertService.getRegionType(this.regionType),this.startDate,this.endDate);
    }, Constant.TIME_INTERVAL_LEFT_PANEL);

    this.intervalId = interval;
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    this.resetInterval();
    if(changes?.startDate?.currentValue && changes?.endDate?.currentValue){
      // this.endPointDevice = this.supabase.getDinhDanhKhongDongNhat(this.mainType,this.subType,this.convertService.getRegionType(this.regionType),null,this.startDate,this.endDate);
      // this.maDocDaDuocLamSach = this.supabase.getThongKeMaDocDaDuocLamSach(this.mainType,this.subType,this.convertService.getRegionType(this.regionType),null,this.startDate,this.endDate);
      this.getData(this.mainType,this.subType ,this.convertService.getRegionType(this.regionType),this.startDate,this.endDate);
      this.cdr.detectChanges();
    }else if (changes?.subType?.currentValue) {
      // this.endPointDevice = this.supabase.getDinhDanhKhongDongNhat(this.mainType,this.subType,this.convertService.getRegionType(this.regionType),null,this.startDate,this.endDate);
      // this.maDocDaDuocLamSach = this.supabase.getThongKeMaDocDaDuocLamSach(this.mainType,this.subType,this.convertService.getRegionType(this.regionType),null,this.startDate,this.endDate);
      // this.record = this.supabase.getCountRecord345(this.mainType,this.subType,this.convertService.getRegionType(this.regionType),null,this.startDate,this.endDate);
      this.getData(this.mainType,this.subType ,this.convertService.getRegionType(this.regionType),this.startDate,this.endDate);

      this.cdr.detectChanges();
    }else if(changes?.regionType?.currentValue){
      // this.endPointDevice = this.supabase.getDinhDanhKhongDongNhat(this.mainType,this.subType,this.convertService.getRegionType(this.regionType),null,this.startDate,this.endDate);
      // this.maDocDaDuocLamSach = this.supabase.getThongKeMaDocDaDuocLamSach(this.mainType,this.subType,this.convertService.getRegionType(this.regionType),null,this.startDate,this.endDate);
      // this.record = this.supabase.getCountRecord345(this.mainType,this.subType,this.convertService.getRegionType(this.regionType),null,this.startDate,this.endDate);
      this.getData(this.mainType,this.subType ,this.convertService.getRegionType(this.regionType),this.startDate,this.endDate);

      this.cdr.detectChanges();
    }else if(changes?.mainType?.currentValue == '' || changes?.mainType?.currentValue){
      let subType = this.subType;

      if(this.subType == Constant.SUB_TYPE_DEVICE.ALL){
        if(this.mainType == Constant.MAIN_TYPE.QS){
          subType = Constant.SUB_TYPE_DEVICE.QS_QP;
        }else if(this.mainType == Constant.MAIN_TYPE.CD){
          subType = Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA;
        }
      };
      this.getData(this.mainType,subType ,this.convertService.getRegionType(this.regionType),this.startDate,this.endDate);
      this.cdr.detectChanges();
    }else if(changes?.regionType?.currentValue){
      this.getData(this.mainType,this.subType,this.convertService.getRegionType(this.regionType),this.startDate,this.endDate);
      this.cdr.detectChanges();
    }

  }

  togglePopup(
    isPopupVisible: boolean,
    typePopup: string,
    is_click_trong_ngay: boolean = false,
    is_common_malware: boolean = false,
    startDate: string = '',
    endDate: string = '',
  ): void {

    this.isThietBiDauCuoi = false;
    this.isChuaDinhDanh = false;
    this.isDinhDanhChuaDongNhat = false;
    this.isMaDocThongThuong = false;
    this.isMayTinhDuocLamSach = false;
    this.isMangAnToan = false;
    this.isPheDuyet = false;

    switch (typePopup) {
      case "THIET_BI_DAU_CUOI":
        this.isThietBiDauCuoi = true;
        this.titlePopup = 'Triển khai ATTT trên máy tính';
        break;
      case "UN_IDENT":
        this.isChuaDinhDanh = true;
        this.titlePopup = 'Thiết bị chưa định danh';
        break;
      case "DINH_DANH_KHONG_DONG_NHAT":
        this.isDinhDanhChuaDongNhat = true;
        this.titlePopup = 'Định danh chưa đồng nhất';
        break;
      case "COMMON_MALWARE":
        this.isMaDocThongThuong = true;
        this.titlePopup = 'Mã độc được nhận diện';
        break;
      case "CLEANED_MALWARE":
        this.isMayTinhDuocLamSach = true;
        this.titlePopup = 'Máy tính được làm sạch mã độc';
        break;
      case "SAFETY_NETWORK":
        this.isMangAnToan = true;
        this.titlePopup = 'Mạng an toàn cơ bản, nâng cao';
        break;
      case "PHE_DUYET_HO_SO":
        this.isPheDuyet = true;
        this.titlePopup = 'Phê duyệt hồ sơ cấp độ';
        break;
    }

    this.popupToggled.emit({
      isPopupVisible,
      typePopup,
      is_click_trong_ngay,
      is_common_malware,
      startDate,
      endDate,
    });
    this.changeTitlePopup.emit(this.titlePopup)
  }

  resetActive(){
    this.isThietBiDauCuoi = false;
    this.isChuaDinhDanh = false;
    this.isDinhDanhChuaDongNhat = false;
    this.isMaDocThongThuong = false;
    this.isMayTinhDuocLamSach = false;
    this.isMangAnToan = false;
    this.isPheDuyet = false;
  }
  async getData(main_type: any,sub_type:string ,regionType: any,start_date:string ='' ,end_date:string = '') {
    this.endPointDevice = this.supabaseSafeTyInformationService.getDinhDanhKhongDongNhat(main_type,sub_type,regionType,null,start_date,end_date);
    this.maDocDaDuocLamSach = this.supabaseSafeTyInformationService.getThongKeMaDocDaDuocLamSach(main_type,sub_type,regionType,null,start_date,end_date);
    this.record = this.supabaseSafeTyInformationService.getCountRecord345(main_type,this.subType,regionType,null,start_date,end_date);
    this.tongSo =  this.supabaseItInfraService.getThongKeTongSo(main_type,sub_type);
    this.setting = this.supabaseService.fetchSettings();

    this.commonInDay = await this.supabaseSafeTyInformationService.malwareTa21Count(main_type,false,true,start_date,end_date)  + await  this.supabaseSafeTyInformationService.malwareTa21Count(main_type,true,true,start_date,end_date);
    this.commonAll = await this.supabaseSafeTyInformationService.malwareTa21Count(main_type,false,false)  +  await this.supabaseSafeTyInformationService.malwareTa21Count(main_type,true,false);

  }

  getValueTrienKhai(key_list: any, col_type: any) {
    return key_list?.find((e: any) => e?.col_type == col_type) || null;
  }

  getTotalMangAnToanTrongNgay(key_list: any) {
    let coban_trongngay = key_list?.find((e: any) => e?.col_type == 'at_mang')?.json_build_object.coban_trongngay || 0;
    let nangcao_trongngay = key_list?.find((e: any) => e?.col_type == 'at_mang')?.json_build_object.nangcao_trongngay || 0;
      return coban_trongngay+nangcao_trongngay;
  }
  getTotalMangAnToanTongSo(key_list: any) {
    let coban = key_list?.find((e: any) => e?.col_type == 'at_mang')?.json_build_object.coban || 0;
    let nangcao= key_list?.find((e: any) => e?.col_type == 'at_mang')?.json_build_object.nangcao || 0;
    return coban+nangcao;
}

sumTongso(data:any) {
  return data
      .filter((item:any) => item.col_type === "at_feduyet")
      .reduce((acc:any, item:any) => acc + item.json_build_object.tongso, 0);
}

// Hàm tính tổng giá trị `trongngay`
sumTrongngay(data:any) {
  return data
      .filter((item:any) => item.col_type === "at_feduyet")
      .reduce((acc:any, item:any) => acc + item.json_build_object.trongngay, 0);
}
getValueTongSo(key_list: any,main_type:any, parent: any,children:any) {
  if(main_type)
    return key_list?.filter((e:any)=>e?.main_type == main_type)?.reduce((acc:any, curr:any) => {
      return acc + (curr?.data[parent]?.[children] || 0);
    }, 0);
  return key_list?.reduce((acc:any, curr:any) => {
    return acc + (curr?.data[parent]?.[children] || 0);
  }, 0);
}
getValueChuaQuyHoach(key_list:any,main_type:string,name:any,){
  if(!main_type){
    let {CD,INT,QS} = key_list?.find((e:any)=>e?.name==name)?.data?.at_mang?.sum;
    return CD + INT + QS;
  }else{
    return key_list?.find((e:any)=>e?.name==name)?.data?.at_mang?.sum?.[main_type] || 0
  }
}
  areDatesEqual(dateString1: string, dateString2: string): boolean {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);

    if (dateString1 == dateString2) {
      return true; // Invalid date strings
    }
    // Check if both date strings are valid dates
    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
      return false; // Invalid date strings
    }

    // Create new Date objects with time set to zero to compare only dates
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

    return d1.getTime() === d2.getTime();
  }
}
