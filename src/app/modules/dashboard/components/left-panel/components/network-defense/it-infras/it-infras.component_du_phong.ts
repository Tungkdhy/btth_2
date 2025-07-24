import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Constant } from '../../../../../../core/config/constant';
import { SocketEventType } from '../../../../models/utils-type';
import {
  PayloadChannel,
  PayloadChannelData,
} from '../../../../models/payload-channel';
import { NumberFormatPipe } from '../../../../../../core/pipes/number-format/number-format.pipe';
import { RealtimeChannel } from '@supabase/supabase-js';

import {
  PostgrestClient,
  PostgrestFilterBuilder,
} from '@supabase/postgrest-js';
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';
import { SocketService } from '../../../../services/socket.service';
import { SupabaseItInfraService } from './services/supabase';

@Component({
  selector: 'app-it-infra-du-phong',
  standalone: true,
  imports: [CommonModule, NumberFormatPipe],
  templateUrl: './it-infras.component_du_phong.html',
  styleUrls: ['./it-infras.component.scss'],
})
export class ItInfrasDuPhongComponent implements OnInit {
  @Output() popupToggled = new EventEmitter<{
    isPopupVisible: boolean;
    typePopup: string;
  }>();
  channel: RealtimeChannel;
  private intervalId: any;

  public deviceQSQP: any;
  public deviceTYQG: any;
  public thietBiDauCuoiQSQP: any;
  public thietBiDauCuoiTYQG: any;
  public countPortalQSQP: any;
  public countPortalTYQG: any;
  public countCommonQSQP: any;
  public countCommonTYQG: any;


  public deviceUnit: any;
  public thietBiDauCuoiUnit: any;
  public countPortalUnit: any;
  public countCommonUnit: any;

  private _mainType: string = '';
  @Input() subType: any = '728';
  isSubType: boolean = false;
  private _regionType: string = 'all';
  private _startDate: string = '';
  private _endDate: string = '';

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
  @Input()
  set startDate(value: string) {
    this._startDate = value;
  }

  get startDate(): string {
    return this._startDate;
  }

  @Input()
  set endDate(value: string) {
    this._endDate = value;
  }

  get endDate(): string {
    return this._endDate;
  }

  @Input()
  set mainType(value: string) {
    this._mainType = value;
    this.getData(value, this.convertService.getRegionType(this.regionType));
    this.resetInterval();
  }

  get mainType(): string {
    return this._mainType;
  }

  @Input()
  set regionType(value: string) {
    this.getData(this.mainType, this.convertService.getRegionType(value));
    this._regionType = value;
    this.resetInterval();
  }

  get regionType(): string {
    return this._regionType;
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.subType.currentValue){
        this.getUnit(this.mainType,changes.subType.currentValue,this.convertService.getRegionType(this.regionType))
    };
  }
  constructor(
    private supabase: SupabaseItInfraService,
    private socket: SocketService,
    private convertService: ConvertServiceComponent,
  ) {}

  async ngOnInit(): Promise<void> {
    this.getData(this.mainType,this.convertService.getRegionType(this.regionType));
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
      this.getData(this.mainType,this.convertService.getRegionType(this.regionType));
    }, Constant.TIME_INTERVAL_LEFT_PANEL);

    this.intervalId = interval;
  }

  togglePopup(isPopupVisible: boolean, typePopup: string) {
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
        break;
      case "SWITCH":
        this.isSwitch = true;
        break;
      case "FIREWALL":
        this.isFirewall = true;
        break;
      case "SERVER":
        this.isServer = true;
        break;
      case "CLIENT":
        this.isClient = true;
        break;
      case "OTHER_DEVICE":
        this.isOtherDevice = true;
        break;
      case "PORTAL":
        this.isPortal = true;
        break;
      case "COMMON":
        this.isCommon = true;
        break;
    }
    this.popupToggled.emit({ isPopupVisible, typePopup });
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
  }
  async getData(main_type: any, regionType: any) {
    this.deviceQSQP = this.supabase.getThongKeDevice(main_type,Constant.SUB_TYPE_DEVICE.QS_QP,regionType,);
    this.deviceTYQG = this.supabase.getThongKeDevice(main_type,Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA,regionType);

    this.thietBiDauCuoiQSQP = this.supabase.getThongKeEndpoint(main_type,Constant.SUB_TYPE_DEVICE.QS_QP,regionType);
    this.thietBiDauCuoiTYQG = this.supabase.getThongKeEndpoint(main_type,Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA,regionType);

    this.countPortalQSQP = await this.supabase.getThongKeUngDungDichVu(Constant.SERVICE_TYPE.PORTAL,main_type,Constant.SUB_TYPE_DEVICE.QS_QP,regionType,);
    this.countPortalTYQG = await this.supabase.getThongKeUngDungDichVu(Constant.SERVICE_TYPE.PORTAL,main_type,Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA,regionType,);

    this.countCommonQSQP = await this.supabase.getThongKeUngDungDichVu(Constant.SERVICE_TYPE.COMMON,main_type,Constant.SUB_TYPE_DEVICE.QS_QP,regionType,);
    this.countCommonTYQG = await this.supabase.getThongKeUngDungDichVu(Constant.SERVICE_TYPE.COMMON,main_type,Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA,regionType);
  }


  async getUnit(main_type: any, sub_type:string,regionType: any) {
    this.deviceUnit = this.supabase.getThongKeDevice(main_type,sub_type,regionType,);

    this.thietBiDauCuoiUnit = this.supabase.getThongKeEndpoint(main_type,sub_type,regionType);

    this.countPortalUnit = await this.supabase.getThongKeUngDungDichVu(Constant.SERVICE_TYPE.PORTAL,main_type,sub_type,regionType,);

    this.countCommonUnit = await this.supabase.getThongKeUngDungDichVu(Constant.SERVICE_TYPE.COMMON,main_type,sub_type,regionType,);
  }

  _getValueQSQP(key_list: any, type: any) {
    return key_list.find((e: any) => e?.type == type)?.count || 0;
  }

  getValueTypeTotal(key_list: any, type: any) {
    return key_list.find((e: any) => e?.type == type)?.total || 0;
  }
}
