import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchInfoSec } from '../../../../core/models/search';
import { DateTimeRangePickerComponent } from '../../../../shared/date-time-range-picker/date-time-range-picker.component';
import { Store } from '@ngrx/store';
import { LetDirective } from '@ngrx/component';
import { Observable, tap } from 'rxjs';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { MapComponent } from '../../../digital-map/components/main-dmap/map/map.component';
import { AdministrativeMapComponent } from './administrative-map/administrative-map.component';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { FormNetworkDeviceComponent } from '../../../device/components/form-network-device/form-network-device.component';
import { NodeCoordinateNetworkDeviceComponent } from '../../../node-coordinate/components/node-coordinate-network-device/node-coordinate-network-device.component';
import { PortNetworkDeviceComponent } from '../../../port/components/port-network-device/port-network-device.component';
import { ReferenceComponent } from '../../../reference/components/main/reference.component';
import { DiagramTopologyComponent } from '../../../topology/components/diagram-topology/diagram-topology.component';
import { DiagramModule } from '@syncfusion/ej2-angular-diagrams';
import { TopologyMapComponent } from './topology-map/topology-map.component';
import { ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';
import { InformationWarfareMapComponent } from './information-warfare-map/information-warfare-map.component';
import { MilitaryMapComponent } from './military-map/military-map.component';
import { MapArea } from '../../models/btth.type';
import { setDateV2 } from '../../../../store/date-time-range-v2/date-time-range-v2.actions';
import { SearchMapComponent } from './search-map/search-map.component';
import { TCMMapComponent } from './tcm-map/tcm-map.component';
import { TcttPopupComponent } from './tctt-detail/tctt-popup/tctt-popup.component';
import { TcttPopupSacthaiComponent } from './tctt-detail/tctt-popup-sacthai/tctt-popup-sacthai.component';
import { TcttPopupChudenongComponent } from './tctt-detail/tctt-popup-chudenong/tctt-popup-chudenong.component';
import { TcttPopupKqdangtaiComponent } from './tctt-detail/tctt-popup-kqdangtai/tctt-popup-kqdangtai.component';
import { TcttPopupTuongquanbaivietComponent } from './tctt-detail/tctt-popup-tuongquanbaiviet/tctt-popup-tuongquanbaiviet.component';
import { TcttPopupTuongquanmuctieuComponent } from './tctt-detail/tctt-popup-tuongquanmuctieu/tctt-popup-tuongquanmuctieu.component';
import { RealtimeChannel } from '@supabase/supabase-js';
import { ModeToggleService } from '../../../mode-toggle/mode-toggle.service';
import { RouterPopupComponent } from './detail-panel/router-popup/router-popup.component';
import { SwitchPopupComponent } from './detail-panel/switch-popup/switch-popup.component';
import { ServerPopupComponent } from './detail-panel/server-popup/server-popup.component';
import { FirewallPopupComponent } from './detail-panel/firewall-popup/firewall-popup.component';
import { ClientPopupComponent } from './detail-panel/client-popup/client-popup.component';
import { OtherDevicePopupComponent } from './detail-panel/other-device-popup/other-device-popup.component';
import { PortalPopupComponent } from './detail-panel/portal-popup/portal-popup.component';
import { CommonPopupComponent } from './detail-panel/common-popup/common-popup.component';
import { ThietBiDauCuoiPopupComponent } from './detail-panel/thiet-bi-dau-cuoi-popup/thiet-bi-dau-cuoi-popup.component';
import { UnidentPopupComponent } from './detail-panel/unident-popup/unident-popup.component';
import { CleanedMalwarePopupComponent } from './detail-panel/cleaned-malware-popup/cleaned-malware-popup.component';
import { DinhDanhKhongDongNhatPopupComponent } from './detail-panel/dinh-danh-khong-dong-nhat-popup/dinh-danh-khong-dong-nhat-popup.component';
import { InfrastructureAlertPopupComponent } from './detail-panel/infrastructure-alert-popup/infrastructure-alert-popup.component';
import { SafetyInformationAlertPopupComponent } from './detail-panel/safety-information-alert-popup/safety-information-alert-popup.component';
import { TopologyCardComponent } from '../shared/topology-card/topology-card.component';
import {
  EventId,
  MainType,
  MapSubType,
  TopologyData,
} from '../../models/btth.interface';
import { MapSupabaseService } from '../../services/map-supabase.service';
import { AddOperatorComponent } from './detail-panel/add-operator/add-operator.component';
import { AgentsChuyenDungPopupComponent } from './detail-panel/agents-chuyendung-popup/agents-popup.component';
import { AgentsQsPopupComponent } from './detail-panel/agents-qs-popup/agents-popup.component';
import { FmsPopupComponent } from './detail-panel/fms-popup/fms-popup.component';
import { OperationalDetailCommandComponent } from './detail-panel/chi-tiet-nhiem-vu-popup/operational-command.component';
import {
  EventDataPayload,
  PayloadChannelData,
} from '../../models/payload-channel';
import { MMSPopupComponent } from './detail-panel/mms-popup/mms-popup.component';
import { SocketService } from '../../services/socket.service';
import { Ta21PopupComponent } from './detail-panel/ta21-popup/ta21-popup.component';
import { CommonMalwarePopupComponent } from './detail-panel/common-malware-popup/common-malware-popup.component';
import { CCPopupComponent } from './detail-panel/cc-popup/cc-popup.component';
import { NacsPopupComponent } from './detail-panel/nacs-popup/nacs-popup.component';
import { SafetyNetworkPopupComponent } from './detail-panel/safety-network-popup/safety-network-popup.component';
import { PheDuyetHoSoPopupComponent } from './detail-panel/phe-duyet-ho-so-popup/phe-duyet-ho-so-popup.component';
import { TcttDiemNongPopupComponent } from './tctt-detail/tctt-diem-nong-popup/tctt-popup-diemnong.component';
import { TcttBocgoPopupComponent } from './tctt-detail/tctt-bocgo-popup/tctt-bocgo-popup.component';
import { TcttChithiPopupComponent } from './tctt-detail/tctt-chithi-popup/tctt-chithi-popup.component';
import { TcttTruyenthongPopupComponent } from './tctt-detail/tctt-truyenthong-popup/tctt-truyenthong-popup.component';
import { DuPhong86PopupComponent } from './detail-panel/du-phong-86/du-phong-86-popup.component';
import { CT86PopupComponent } from './detail-panel/ct86-popup/chi-tiet-nhiem-vu-full-popup.component';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';
import { AgentsINTPopupComponent } from './detail-panel/agents-internet-popup/agents-popup.component';
import { FidelisPopupComponent } from './detail-panel/fidelis-popup/nacs-popup.component';
import { ChiTietDieuHanhComponent } from './detail-panel/dieu-hanh-truc-chi-tiet-popup/chi-tiet-nhiem-vu-full-popup.component';
import {
  BreadcrumbIds,
  BreadcrumbService,
} from '../../services/breadcrumb.service';
import { loadAllData } from '../../../../store/component-loaded/component-loaded.actions';
import { DutyScheduleService } from '../../services/duty-schedule.service';
import { OverviewTcttComponent } from './tctt-detail/overview-tctt/overview-tctt.component';
import { InfrastructureAlertSecondPopupComponent } from './detail-panel/infrastructure-alert-second-popup/infrastructure-alert-second-popup.component';
import { SafetyInformationAlertSecondPopupComponent } from './detail-panel/safety-information-alert-second-popup/safety-information-alert-second-popup.component';
import { SecurityPopupComponent } from './detail-panel/security-popup/security-popup.component';
import { Constant } from '../../../../core/config/constant';
import { NetworkDeviceAddRemovePopupComponent } from './detail-panel/add-remove-popup/network-device-popup/network-device-add-remove-popup.component';
import { EndpointAddRemovePopupComponent } from './detail-panel/add-remove-popup/endpoint-popup/endpoint-add-remove-popup.component';
import { ServiceAddRemovePopupComponent } from './detail-panel/add-remove-popup/service-popup/service-add-remove-popup.component';
import { AvatarComponent } from '../shared/avatar/avatar.component';
import { Thickness } from '@syncfusion/ej2-angular-charts';

type MapType = 'cyber-defense' | 'info-warfare' | 'tcm';

@Component({
  selector: 'app-mid-panel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DateTimeRangePickerComponent,
    LetDirective,
    CheckBoxModule,
    MapComponent,
    AdministrativeMapComponent,
    TabModule,
    FormNetworkDeviceComponent,
    NodeCoordinateNetworkDeviceComponent,
    PortNetworkDeviceComponent,
    ReferenceComponent,
    DiagramTopologyComponent,
    DiagramModule,
    TopologyMapComponent,
    ComboBoxModule,
    InformationWarfareMapComponent,
    MilitaryMapComponent,
    SearchMapComponent,
    TCMMapComponent, //Map of T5,
    TcttPopupComponent,
    TcttPopupSacthaiComponent,
    TcttPopupKqdangtaiComponent,
    TcttPopupChudenongComponent,
    TcttPopupTuongquanbaivietComponent,
    TcttPopupTuongquanmuctieuComponent,
    TcttDiemNongPopupComponent,
    RouterPopupComponent,
    SwitchPopupComponent,
    ServerPopupComponent,
    ClientPopupComponent,
    OtherDevicePopupComponent,
    PortalPopupComponent,
    CommonPopupComponent,
    FirewallPopupComponent,
    ThietBiDauCuoiPopupComponent,
    UnidentPopupComponent,
    CleanedMalwarePopupComponent,
    DinhDanhKhongDongNhatPopupComponent,
    InfrastructureAlertPopupComponent,
    SafetyInformationAlertPopupComponent,
    TopologyCardComponent,
    AddOperatorComponent,
    AgentsChuyenDungPopupComponent,
    AgentsQsPopupComponent,
    FmsPopupComponent,
    OperationalDetailCommandComponent,
    MMSPopupComponent,
    Ta21PopupComponent,
    CommonMalwarePopupComponent,
    CCPopupComponent,
    NacsPopupComponent,
    SafetyNetworkPopupComponent,
    PheDuyetHoSoPopupComponent,
    TcttBocgoPopupComponent,
    TcttChithiPopupComponent,
    TcttTruyenthongPopupComponent,
    DuPhong86PopupComponent,
    CT86PopupComponent,
    BreadcrumbsComponent,
    AgentsINTPopupComponent,
    FidelisPopupComponent,
    ChiTietDieuHanhComponent,
    InfrastructureAlertSecondPopupComponent,
    OverviewTcttComponent,
    SecurityPopupComponent,
    SafetyInformationAlertSecondPopupComponent,
    NetworkDeviceAddRemovePopupComponent,
    EndpointAddRemovePopupComponent,
    ServiceAddRemovePopupComponent,
    AvatarComponent
  ],
  templateUrl: './mid-panel.component.html',
  styleUrls: ['./mid-panel.component.scss'],
})
export class MidPanelComponent implements OnInit, OnDestroy {
  @ViewChild('militaryMap') militaryMap: MilitaryMapComponent;
  activeTab: 'military-map' | 'topology-map' = 'military-map';
  eventData: any; // Variable to store event data

  subTitle: string | null = null;

  channel: RealtimeChannel;
  payloadData$: Observable<any>;
  topology$: Observable<TopologyData | null>;
  ta21Data: string;
  nacData: string;
  startDate: any;
  endDate: any;

  regionItems = Constant.DEFAULT_VALUES.REGION;

  // endDate$: Observable<Date>;
  mode: any;
  search = new SearchInfoSec();
  selectedArea: MapArea = 'all';
  public headerText: Object[] = [
    { text: 'Twitter' },
    { text: 'Facebook' },
    { text: 'WhatsApp' },
  ];
  is_common_malware: boolean;
  is_click_trong_ngay: boolean;
  is_at_coban: boolean;
  is_fe_duyet_3: boolean;
  is_fe_duyet_4: boolean;
  is_fe_duyet_5: boolean;
  alertType: string;
  typeAddRemove: string;

  dataChiTietNhiemVuPopup: any;
  isPopupVisibleAgentInternet: boolean = false;
  isPopupVisibleFidelis: boolean = false;
  isPopupVisibleChiTietDieuHanhTruc: boolean = false;
  isPopupDuphong86: boolean = false;
  isPopupVisibleChiTietNhiemVuPopup: boolean = false;
  isPopupVisibleFmsPopup: boolean = false;
  isPopupVisibleMmsPopup: boolean = false;
  isPopupVisibleAgentsCDPopup: boolean = false;
  isPopupVisibleAgentsQSPopup: boolean = false;
  isPopupVisibleAddOperator: boolean = false;
  isPopupVisibleMucTieuBV: boolean = false;
  isPopupVisibleDiemNong: boolean = false;
  isPopupVisibleChuDeNong: boolean = false; 
  isPopupVisibleKQDangTai: boolean = false;
  isPopupVisibleSacThai: boolean = false;
  isPopupVisibleTQBaiViet: boolean = false;
  isPopupVisibleTQMucTieu: boolean = false;
  isPopupVisibleBocGo: boolean = false;
  isPopupVisibleChiThi: boolean = false; 
  isPopupVisibleTruyenThong: boolean = false;
  isPopupVisibleOverview: boolean = false;

  isPopupVisibleRouter: boolean = false;
  isPopupVisibleSwitch: boolean = false;
  isPopupVisibleFirewall: boolean = false;
  isPopupVisibleServer: boolean = false;
  isPopupVisibleClient: boolean = false;
  isPopupVisibleOtherDevice: boolean = false;
  isPopupVisiblePortal: boolean = false;
  isPopupVisibleCommon: boolean = false;

  isPopupVisibleNetworkDeviceAddRemove: boolean = false;
  isPopupVisibleEndpointDeviceAddRemove: boolean = false;
  isPopupVisibleServiceAddRemove: boolean = false;

  isPopupVisibleThietBiDauCuoi: boolean = false;
  isPopupVisibleUnIdent: boolean = false;
  isPopupVisibleDinhDanhKhongDongNhat: boolean = false;
  isPopupVisibleCleanedMalware: boolean = false;
  isPopupVisibleCommonMalware: boolean = false; 
  isPopupVisibleSafetyNetwork: boolean = false;
  isPopupVisiblePheDuyetHoSo: boolean = false;
  isPopupCT86: boolean = false;
  isPopupVisibleSecurity: boolean = false;
  isPopupVisibleInfrastructureAlert: boolean = false;
  isPopupVisibleInfrastructureSecondAlert: boolean = false;
  isPopupVisibleSafetyInformationAlert: boolean = false;
  isPopupVisibleSafetyInformationSecondAlert: boolean = false;
  isPopupVisibleTa21: boolean = false;
  isPopupVisibleCC: boolean = false;
  isPopupVisibleNacs: boolean = false;
  isTcmMap: boolean = false;
  currentMap: MapType = 'cyber-defense';
  muctieubaoveDetail: any[] = [];
  @Input() dataDetail: any[] = [];
  @Input() treeList: any[] = [];
  @Input() tongquanchude: any[] = [];
  @Input() diemtin: any[] = [];
  @Output() closeMid: EventEmitter<void> = new EventEmitter<void>();
  mainType: string = '';
  subType: string = Constant.SUB_TYPE_DEVICE.ALL;
  viewDetail: boolean = false;

  borderClass = '';

  private supabase = inject(MapSupabaseService);
  private breadcrumbService = inject(BreadcrumbService);
  private socket = inject(SocketService);
  private cdr = inject(ChangeDetectorRef);

  constructor(
    private store: Store,
    private modeToggleService: ModeToggleService,
  ) { }

  private dutyService = inject(DutyScheduleService);

  ngOnInit() {
    this.store.dispatch(loadAllData());

    console.log('[treeList]: ', this.treeList);

    this.payloadData$ = this.socket.payload$.pipe(
      tap((channel) => {
        const payload = channel.payload as PayloadChannelData;
        if (payload.type === EventId.CYBER_WARFARE_MAP) {
          this.currentMap = 'tcm';
          this.breadcrumbService.clearBreadcrumbs();
          this.breadcrumbService.addBreadcrumb({
            id: EventId.CYBER_WARFARE_MAP,
            label: 'Trinh sát, tác chiến mạng',
          });
          this.cdr.markForCheck();
        } else if (payload.type === EventId.INFO_WARFARE_MAP) {
          this.currentMap = 'info-warfare';
          this.breadcrumbService.clearBreadcrumbs();
          this.breadcrumbService.addBreadcrumb({
            id: EventId.INFO_WARFARE_MAP,
            label: 'Trinh sát, tác chiến thông tin',
          });
          // this.cdr.markForCheck();           
        } else if (payload.type === EventId.POPUP) {
          this.viewDetail = true;
          this.cdr.markForCheck();
          this.handlePopupEvent(channel.payload.data);
        } else if (payload.type === EventId.CHANGE_THEME) {
          this.mode = channel.payload.data.mode;
          localStorage.clear();
          this.modeToggleService.selectMode(this.mode);
          this.cdr.markForCheck();
        } else if (payload.type === EventId.PANEL4) {
          this.borderClass = 'border-red';
          console.log(this.borderClass);
          this.cdr.markForCheck();
        } else {
          this.borderClass = '';
        }

        if (payload) {
          const payloadData = payload.data as EventDataPayload;
          if (payloadData.actualData) return;
          if (payloadData.subType === MapSubType.INFRASTRUCTURE_ALERT) {
            this.subTitle = '/ Cảnh báo sự cố mất kết nối';
          } else if (payloadData.subType === MapSubType.CYBER_SECURITY_ALERT) {
            this.subTitle = '/ Cảnh báo sự cố mất mất ATTT';
          } else this.cdr.markForCheck();
        }
      }),
    );
  }

  ngOnDestroy() {
    console.log('destroy');
  }

  onCloseMid() {    
    this.closeMid.emit();
  }

  handleOpenTopology(data: any) {
    this.eventData = data; // Store event data for later use
    this.topology$ = this.getTopologyData(data);
    this.selectTab('topology-map'); // Switch tab
  }

  selectTab(tabId: 'military-map' | 'topology-map') {
    this.activeTab = tabId;
  }

  onRegionChange(): void {
    this.socket.sendBroadcastChannel({
      type: EventId.AREA,
      data: this.selectedArea,
    });

    if (this.selectedArea === 'all') {
      this.militaryMap.handleHomeControl();
    }
  }

  handleSelectDate(date: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  }): void {
    if (!date.startDate || !date.endDate) return;
    this.startDate = date.startDate;
    this.endDate = date.endDate;
    this.store.dispatch(
      setDateV2({ startDate: date.startDate, endDate: date.endDate }),
    );
    this.socket.sendBroadcastChannel({
      type: EventId.DATE,
      data: {
        startDate: date.startDate.getTime(),
        endDate: date.endDate.getTime(),
      },
    });
  }

  handleTogglePopupEvent(isPopupVisible: boolean) {
    console.log('Is visible mid: ', this.isPopupVisibleOverview);
    this.isPopupDuphong86 = isPopupVisible;
    this.isPopupCT86 = isPopupVisible;
    this.isPopupVisibleFmsPopup = isPopupVisible;
    this.isPopupVisibleAddOperator = isPopupVisible;
    this.isPopupVisibleAgentsCDPopup = isPopupVisible;
    this.isPopupVisibleMucTieuBV = isPopupVisible;
    this.isPopupVisibleDiemNong = isPopupVisible;
    this.isPopupVisibleChuDeNong = isPopupVisible;
    this.isPopupVisibleKQDangTai = isPopupVisible;
    this.isPopupVisibleSacThai = isPopupVisible;
    this.isPopupVisibleTQBaiViet = isPopupVisible;
    this.isPopupVisibleTQMucTieu = isPopupVisible;
    this.isPopupVisibleBocGo = isPopupVisible;
    this.isPopupVisibleChiThi = isPopupVisible;
    this.isPopupVisibleTruyenThong = isPopupVisible;
    this.isPopupVisibleOverview = isPopupVisible;

    this.isPopupVisibleRouter = isPopupVisible;
    this.isPopupVisibleSwitch = isPopupVisible;
    this.isPopupVisibleFirewall = isPopupVisible;
    this.isPopupVisibleServer = isPopupVisible;
    this.isPopupVisibleClient = isPopupVisible;
    this.isPopupVisibleOtherDevice = isPopupVisible;
    this.isPopupVisiblePortal = isPopupVisible;
    this.isPopupVisibleCommon = isPopupVisible;

    this.isPopupVisibleNetworkDeviceAddRemove = isPopupVisible;
    this.isPopupVisibleEndpointDeviceAddRemove = isPopupVisible;
    this.isPopupVisibleServiceAddRemove = isPopupVisible;

    this.isPopupVisibleSecurity = isPopupVisible;
    this.isPopupVisibleThietBiDauCuoi = isPopupVisible;
    this.isPopupVisibleUnIdent = isPopupVisible;
    this.isPopupVisibleDinhDanhKhongDongNhat = isPopupVisible;
    this.isPopupVisibleCleanedMalware = isPopupVisible;
    this.isPopupVisibleCommonMalware = isPopupVisible;
    this.isPopupVisibleSafetyNetwork = isPopupVisible;
    this.isPopupVisiblePheDuyetHoSo = isPopupVisible;
    this.isPopupVisibleFidelis = isPopupVisible;
    this.isPopupVisibleInfrastructureAlert = isPopupVisible;
    this.isPopupVisibleInfrastructureSecondAlert = isPopupVisible;
    this.isPopupVisibleSafetyInformationAlert = isPopupVisible;
    this.isPopupVisibleSafetyInformationSecondAlert = isPopupVisible;
    this.isPopupVisibleChiTietNhiemVuPopup = isPopupVisible;
    this.isPopupVisibleTa21 = isPopupVisible;
    this.isPopupVisibleCC = isPopupVisible;
    this.isPopupVisibleNacs = isPopupVisible;
    this.isPopupVisibleAgentInternet = isPopupVisible;
    this.dataChiTietNhiemVuPopup = isPopupVisible;
    this.viewDetail = false;
    this.socket.sendBroadcastChannel({
      type: EventId.CLOSE_POPUP,
      data: {},
    });
    // if (!isPopupVisible) this.resetDefaultMap();
  }

  handlePopupEvent(eventData: any) {
    const {
      data,
      dataTa21,
      isPopupVisible,
      typePopup,
      Detail,
      mainType,
      subType,
      startDate,
      endDate,
      treeList,
      is_click_trong_ngay,
      is_common_malware,
      is_at_coban,
      is_fe_duyet_3,
      is_fe_duyet_4,
      is_fe_duyet_5,
      tongquanchude,
      diemtin,
      alertType,
      typeAddRemove,
    } = eventData;
    this.nacData = dataTa21;
    this.ta21Data = dataTa21;
    this.muctieubaoveDetail = Detail;
    this.dataDetail = Detail;
    this.treeList = treeList;
    this.tongquanchude = tongquanchude;
    this.diemtin = diemtin;
    this.dataChiTietNhiemVuPopup = data;
    this.mainType = mainType;
    this.subType = subType;
    this.is_click_trong_ngay = is_click_trong_ngay;
    this.is_common_malware = is_common_malware;
    this.is_at_coban = is_at_coban;
    this.is_fe_duyet_3 = is_fe_duyet_3;
    this.is_fe_duyet_4 = is_fe_duyet_4;
    this.is_fe_duyet_5 = is_fe_duyet_5;
    this.alertType = alertType;
    this.startDate = startDate;
    this.endDate = endDate;
    this.typeAddRemove = typeAddRemove;
    // Reset all popups to false
    this.isPopupVisibleMmsPopup = false;
    this.isPopupVisibleChiTietNhiemVuPopup = false;
    this.isPopupVisibleAgentsCDPopup = false;
    this.isPopupVisibleAddOperator = false;
    this.isPopupVisibleAgentsQSPopup = false;
    this.isPopupVisibleChuDeNong = false;
    this.isPopupVisibleKQDangTai = false;
    this.isPopupVisibleSacThai = false;
    this.isPopupVisibleTQBaiViet = false;
    this.isPopupVisibleTQMucTieu = true; //
    this.isPopupVisibleDiemNong = false;
    this.isPopupVisibleBocGo = false;
    this.isPopupVisibleChiThi = false;
    this.isPopupVisibleTruyenThong = false;
    this.isPopupVisibleMucTieuBV = false;
    this.isPopupVisibleOverview = false;

    this.isPopupVisibleRouter = false;
    this.isPopupVisibleSwitch = false;
    this.isPopupVisibleFirewall = false;
    this.isPopupVisibleServer = false;
    this.isPopupVisibleClient = false;
    this.isPopupVisibleOtherDevice = false;
    this.isPopupVisiblePortal = false;
    this.isPopupVisibleCommon = false;

    this.isPopupVisibleNetworkDeviceAddRemove = false;
    this.isPopupVisibleEndpointDeviceAddRemove = false;
    this.isPopupVisibleServiceAddRemove = false;

    this.isPopupVisibleSecurity = false;
    this.isPopupVisibleThietBiDauCuoi = false;
    this.isPopupVisibleUnIdent = false;
    this.isPopupVisibleDinhDanhKhongDongNhat = false;
    this.isPopupVisibleCleanedMalware = false;
    this.isPopupVisibleCommonMalware = false;
    this.isPopupVisibleSafetyNetwork = false;
    this.isPopupVisiblePheDuyetHoSo = false;
    this.isPopupDuphong86 = false;
    this.isPopupVisibleInfrastructureAlert = false;
    this.isPopupVisibleInfrastructureSecondAlert = false;
    this.isPopupVisibleSafetyInformationAlert = false;
    this.isPopupVisibleSafetyInformationSecondAlert = false;
    this.isPopupVisibleNacs = false;
    this.isPopupCT86 = false;
    this.isPopupVisibleFmsPopup = false;
    this.isPopupVisibleTa21 = false;
    this.isPopupVisibleAgentInternet = false;
    this.isPopupVisibleFidelis = false;
    this.isPopupVisibleChiTietDieuHanhTruc = false;
    // Set the correct popup to true
    switch (typePopup) {
      case 'ChuDeNong':
        this.isPopupVisibleChuDeNong = isPopupVisible;
        break;
      case 'KQDangTai':
        this.isPopupVisibleKQDangTai = isPopupVisible;
        break;
      case 'SacThai':
        this.isPopupVisibleSacThai = isPopupVisible;
        break;
      case 'TQBaiViet':
        this.isPopupVisibleTQBaiViet = isPopupVisible;
        break;
      case 'TQMucTieu':
        this.isPopupVisibleTQMucTieu = isPopupVisible;
        break;
      case 'MucTieuBaoVe':
        this.isPopupVisibleMucTieuBV = isPopupVisible;
        break;
      case 'DiemNong':
        this.isPopupVisibleDiemNong = isPopupVisible;
        break;
      case 'BocGo':
        this.isPopupVisibleBocGo = isPopupVisible;
        break;
      case 'ChiThi':
        this.isPopupVisibleChiThi = isPopupVisible;
        break;
      case 'TruyenThong':
        this.isPopupVisibleTruyenThong = isPopupVisible;
        break;
      case 'Overview':
        this.isPopupVisibleOverview = isPopupVisible;
        break;
      case 'ROUTER':
        this.isPopupVisibleRouter = isPopupVisible;
        break;
      case 'SWITCH':
        this.isPopupVisibleSwitch = isPopupVisible;
        break;
      case 'FIREWALL':
        this.isPopupVisibleFirewall = isPopupVisible;
        break;
      case 'SERVER':
        this.isPopupVisibleServer = isPopupVisible;
        break;
      case 'CLIENT':
        this.isPopupVisibleClient = isPopupVisible;
        break;
      case 'OTHER_DEVICE':
        this.isPopupVisibleOtherDevice = isPopupVisible;
        break;
      case 'PORTAL':
        this.isPopupVisiblePortal = isPopupVisible;
        break;
      case 'COMMON':
        this.isPopupVisibleCommon = isPopupVisible;
        break;
      case 'SECURITY':
        this.isPopupVisibleSecurity = isPopupVisible;
        break;
      case 'THIET_BI_DAU_CUOI':
        this.isPopupVisibleThietBiDauCuoi = isPopupVisible;
        break;
      case 'UN_IDENT':
        this.isPopupVisibleUnIdent = isPopupVisible;
        break;
      case 'DINH_DANH_KHONG_DONG_NHAT':
        this.isPopupVisibleDinhDanhKhongDongNhat = isPopupVisible;
        break;
      case 'CLEANED_MALWARE':
        this.isPopupVisibleCleanedMalware = isPopupVisible;
        break;
      case 'COMMON_MALWARE':
        this.isPopupVisibleCommonMalware = isPopupVisible;
        break;
      case 'SAFETY_NETWORK':
        this.isPopupVisibleSafetyNetwork = isPopupVisible;
        break;
      case 'PHE_DUYET_HO_SO':
        this.isPopupVisiblePheDuyetHoSo = isPopupVisible;
        break;

      case 'NETWORK_DEVICE_ADD_REMOVE':
        this.isPopupVisibleNetworkDeviceAddRemove = isPopupVisible;
        break;
      case 'ENDPOINT_DEVICE_ADD_REMOVE':
        this.isPopupVisibleEndpointDeviceAddRemove = isPopupVisible;
        break;
      case 'SERVICE_ADD_REMOVE':
        this.isPopupVisibleServiceAddRemove = isPopupVisible;
        break;

      case 'INFRASTRUCTURE_ALERT':
        this.isPopupVisibleInfrastructureAlert = isPopupVisible;
        break;
      case 'INFRASTRUCTURE_ALERT_SECOND':
        this.isPopupVisibleInfrastructureSecondAlert = isPopupVisible;
        break;
      case 'SAFETY_INFORMATION_ALERT':
        this.isPopupVisibleSafetyInformationAlert = isPopupVisible;
        break;
      case 'SAFETY_INFORMATION_ALERT_SECOND':
        this.isPopupVisibleSafetyInformationSecondAlert = isPopupVisible;
        break;
      case 'AddOperator':
        this.isPopupVisibleAddOperator = isPopupVisible;
        break;
      case 'AgentsQSPopup':
        this.isPopupVisibleAgentsQSPopup = isPopupVisible;
        break;
      case 'AgentsCDPopup':
        this.isPopupVisibleAgentsCDPopup = isPopupVisible;
        break;
      case 'FmsPopup':
        this.isPopupVisibleFmsPopup = isPopupVisible;
        break;
      case 'MmsPopup':
        this.isPopupVisibleMmsPopup = isPopupVisible;
        break;
      case 'Ta21Popup':
        this.isPopupVisibleTa21 = isPopupVisible;
        break;
      case 'CCPopup':
        this.isPopupVisibleCC = isPopupVisible;
        break;
      case 'NacsPopup':
        this.isPopupVisibleNacs = isPopupVisible;
        break;
      case 'ChiTietNhiemVuPopup':
        this.isPopupVisibleChiTietNhiemVuPopup = isPopupVisible;
        break;
      case 'Duphong86Popup':
        this.isPopupDuphong86 = isPopupVisible;
        break;
      case 'CT86Popup':
        this.isPopupCT86 = isPopupVisible;
        break;
      case 'AgentsIntPopup':
        this.isPopupVisibleAgentInternet = isPopupVisible;
        break;
      case 'FidelisPopup':
        this.isPopupVisibleFidelis = isPopupVisible;
        break;
      case 'DieuHanhTrucChiTietPopup':
        this.isPopupVisibleChiTietDieuHanhTruc = isPopupVisible;
        break;
      default:
        this.viewDetail = false;
        this.cdr.markForCheck();
        break;
    }
    this.cdr.detectChanges();
  }

  getTopologyData(
    unitPath: string,
    mainType: MainType = MainType.MILITARY,
  ): Observable<TopologyData | null> {
    return this.supabase.getTopologyData(unitPath, mainType);
  }

  handleBreadcrumbClick(id: string) {
    console.log('Breadcrumb clicked with id:', id);
    switch (id) {
      case BreadcrumbIds.HOME:
        this.resetDefaultMap();
        this.resetStateOthersPanel();
        this.militaryMap.handleHomeControl();
        break;
      case BreadcrumbIds.INFRA_ALERT_LIST:
        this.militaryMap.handleArrayData(
          {
            apiFilter: {
              columnType: null,
            },
            title: [
              {
                id: BreadcrumbIds.INFO_SEC_ALERT_LIST,
                label: Constant.DEFAULT_VALUES.ALERT.INFOSEC,
              },
            ],
          },
          MapSubType.INFRASTRUCTURE_ALERT,
        );
        break;
      case BreadcrumbIds.INFO_SEC_ALERT_LIST:
        this.militaryMap.handleArrayData(
          {
            apiFilter: {
              columnType: null,
            },
            title: [
              {
                id: BreadcrumbIds.INFO_SEC_ALERT_LIST,
                label: Constant.DEFAULT_VALUES.ALERT.INFOSEC,
              },
            ],
          },
          MapSubType.INFRASTRUCTURE_ALERT,
        );
        break;
      default:
        this.militaryMap.selectFeature(id);
        break;
    }

    // Perform custom logic based on the clicked breadcrumb's id
    // Example: navigate to a specific route, update some state, etc.
    // this.performCustomLogic(id);
  }

  resetDefaultMap() {
    this.selectedArea = 'all';
    this.currentMap = 'cyber-defense';
  }

  resetStateOthersPanel() {
    this.socket.sendBroadcastChannel({
      type: EventId.RESET_STATE,
      data: {},
    });
  }
}
