import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RealtimeChannel } from '@supabase/supabase-js';
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';
import { SupabaseItInfraService } from './services/supabase';
import { Constant } from 'src/app/core/config/constant';
import { NumberFormatPipe } from 'src/app/core/pipes/number-format/number-format.pipe';
import { PayloadChannelData } from 'src/app/modules/dashboard/models/payload-channel';
import { SocketService } from 'src/app/modules/dashboard/services/socket.service';
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
registerLocaleData(localeVi, 'vi');

@Component({
  selector: 'app-it-infras',
  standalone: true,
  imports: [CommonModule, NumberFormatPipe],
  templateUrl: './it-infras.component.html',
  styleUrls: ['./it-infras.component.scss'],
})
export class ItInfrasComponent implements OnInit {
  @Output() popupToggled = new EventEmitter<{
    isPopupVisible: boolean;
    typePopup: string;
    typeAddRemove:string;
  }>();
  @Output() changeTitlePopup = new EventEmitter<string>();
  channel: RealtimeChannel;
  titlePopup:string = ''
  private intervalId: any;

  public deviceQSQP: any;
  public deviceTYQG: any;
  public thietBiDauCuoiQSQP: any;
  public thietBiDauCuoiTYQG: any;
  public countPortalQSQP: any;
  public countPortalTYQG: any;
  public countCommonQSQP: any;
  public countCommonTYQG: any;

  public tongSo: any;
  public tangGiam: any;

  public deviceUnit: any;
  public thietBiDauCuoiUnit: any;
  public countPortalUnit: any;
  public countCommonUnit: any;



  @Input() mainType: string = '';
  @Input() subType: any = Constant.SUB_TYPE_DEVICE.ALL;
  @Input() regionType: string = 'all';
  @Input() startDate: string = '';
  @Input() endDate: string = '';

  isRouter: boolean = false;
  isSwitch: boolean = false;
  isFirewall: boolean = false;
  isServer: boolean = false;
  isClient: boolean = false;
  isOtherDevice: boolean = false;
  isPortal: boolean = false;
  isCommon: boolean = false;

  get payload(): any {
    return this._payload;
  }

  @Input() set payload(value: any) {
    this._payload = value;
  }
  private _payload: PayloadChannelData;

  ngOnChanges(changes: SimpleChanges){
    this.resetInterval();
    if(changes?.subType?.currentValue){
      this.getData(this.mainType,changes.subType.currentValue,this.convertService.getRegionType(this.regionType))
    }else if(changes?.mainType?.currentValue || changes?.mainType?.currentValue == ''){
      this.getData(this.mainType,this.subType,this.convertService.getRegionType(this.regionType));
    }else if(changes?.regionType?.currentValue){
      this.getData(this.mainType,this.subType,this.convertService.getRegionType(this.regionType));
    }else if(changes?.startDate?.currentValue && changes?.endDate?.currentValue){
      this.tangGiam = this.supabase.getThongKeTangGiam(this.mainType,this.subType,this.convertService.getRegionType(this.regionType),null,this.startDate,this.endDate);
    }
  }
  constructor(
    private supabase: SupabaseItInfraService,
    private socket: SocketService,
    private convertService: ConvertServiceComponent,
  ) {}

  async ngOnInit(): Promise<void> {
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
      this.getData(this.mainType,this.subType,this.convertService.getRegionType(this.regionType));
    }, Constant.TIME_INTERVAL_LEFT_PANEL);

    this.intervalId = interval;
  }

  togglePopup(isPopupVisible: boolean, typePopup: string,typeAddRemove:string='') {

    this.isRouter  = false;
    this.isSwitch = false;
    this.isFirewall = false;
    this.isServer = false;
    this.isClient = false;
    this.isOtherDevice = false;
    this.isPortal = false;
    this.isCommon = false;

    switch (typePopup) {
      case "ROUTER":
        this.isRouter = true;
        this.titlePopup = 'Thiết bị định tuyến, cơ yếu';
        break;
      case "SWITCH":
        this.isSwitch = true;
        this.titlePopup = 'Thiết bị chuyển mạch'
        break;
      case "FIREWALL":
        this.isFirewall = true;
        this.titlePopup = 'Thiết bị tường lửa';
        break;
      case "SERVER":
        this.isServer = true;
        this.titlePopup = 'Máy chủ'
        break;
      case "CLIENT":
        this.isClient = true;
        this.titlePopup = 'Máy trạm'
        break;
      case "OTHER_DEVICE":
        this.isOtherDevice = true;
        this.titlePopup = 'Thiết bị khác'
        break;
      case "PORTAL":
        this.isPortal = true;
        this.titlePopup = 'Cổng thông tin điện tử'
        break;
      case "COMMON":
        this.isCommon = true;
        this.titlePopup = 'Dùng chung'
        break;
    }
    this.popupToggled.emit({ isPopupVisible, typePopup,typeAddRemove });
    this.changeTitlePopup.emit(this.titlePopup)
  }
  resetActive(){
    this.isRouter  = false;
    this.isSwitch = false;
    this.isFirewall = false;
    this.isServer = false;
    this.isClient = false;
    this.isOtherDevice = false;
    this.isPortal = false;
    this.isCommon = false;
    this.titlePopup = '';
  }

  async getData(main_type: any, sub_type:string,regionType: any) {

    this.deviceQSQP = this.supabase.getThongKeDevice(main_type,sub_type,regionType,);

    this.thietBiDauCuoiQSQP = this.supabase.getThongKeEndpoint(main_type,sub_type,regionType);

    this.tongSo =  this.supabase.getThongKeTongSo(main_type,sub_type);

    this.tangGiam = this.supabase.getThongKeTangGiam(main_type,sub_type,regionType,null,this.startDate,this.endDate);

    this.countPortalQSQP = await this.supabase.getThongKeUngDungDichVu(Constant.SERVICE_TYPE.PORTAL,main_type,sub_type,regionType,);

    this.countCommonQSQP = await this.supabase.getThongKeUngDungDichVu(Constant.SERVICE_TYPE.COMMON,main_type,sub_type,regionType,);

  }

  _getValueQSQP(key_list: any, type: any) {
    return key_list?.find((e: any) => e?.type == type)?.count || 0;
  }

  getValueTypeTotal(key_list: any, type: any) {
    return key_list?.find((e: any) => e?.type == type)?.total || 0;
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
  getValueTang(key_list: any, tag: any) {
    return key_list?.find((e: any) => e?.tag == tag)?.add || 0;
  }
  getValueGiam(key_list: any, tag: any) {
    return key_list?.find((e: any) => e?.tag == tag)?.delete || 0;
  }
  isCheckEmpty(key_list:any){
    return key_list?.length != 0 ? true:false;
  }
}
