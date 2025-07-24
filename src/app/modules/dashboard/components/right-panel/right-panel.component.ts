import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotTopicComponent } from '../shared/information-warface/hot-topic/hot-topic.component';
import { InformationWarefaceResultComponent } from '../shared/information-warface/information-wareface-result/information-wareface-result.component';
import { MonitoringTargetComponent } from '../shared/information-warface/monitoring-target/monitoring-target.component';
import { NuanceInforComponent } from '../shared/information-warface/nuance-infor/nuance-infor.component';
import { ProtectingTargetComponent } from '../shared/information-warface/protecting-target/protecting-target.component';
import { UploadPostBarComponent } from '../shared/information-warface/upload-post-bar/upload-post-bar.component';
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import { TargetComponent } from '../shared/cyber-warface/target/target.component';
import { ForceComponent } from '../shared/cyber-warface/force/force.component';
import { CollectedDataComponent } from '../shared/cyber-warface/collected-data/collected-data.component';
//import { WarfaceTechniqueComponent } from '../shared/cyber-warface/warface-technique/warface-technique.component';
import { BieuDoBvTieuCucComponent } from '../shared/information-warface/bieu-do-bv-tieu-cuc/bieu-do-bv-tieu-cuc.component';
import { BehaviorSubject, combineLatest, Observable, tap } from 'rxjs';
import { RealtimeChannel } from '@supabase/supabase-js';
import { ModeToggleService } from '../../../mode-toggle/mode-toggle.service';
import { EventId } from '../../models/btth.interface';
import { BieuDoDonComponentComponent } from './cyber-reconnaissance/bieu-do-don-component/bieu-do-don-component.component';
import { SocketService } from '../../services/socket.service';
import { HotSpotComponent } from '../shared/information-warface/hot-spot-statistic/hot-spot-statistic.component';
import { Store } from '@ngrx/store';
import {
  loadDateV2,
  setDateV2,
} from 'src/app/store/date-time-range-v2/date-time-range-v2.actions';
import { AvatarComponent } from '../shared/avatar/avatar.component';
import { Constant } from 'src/app/core/config/constant';
import { FormsModule } from '@angular/forms';
import { ExploitLevelComponent } from '../shared/cyber-warface/warface-technique/exploit-level.component';
import { MidPanelComponent } from "../mid-panel/mid-panel.component";

@Component({
  selector: 'app-right-panel',
  standalone: true,
  imports: [
    CommonModule,
    HotTopicComponent,
    InformationWarefaceResultComponent,
    MonitoringTargetComponent,
    NuanceInforComponent,
    ProtectingTargetComponent,
    UploadPostBarComponent,
    ChartModule,
    TargetComponent,
    ForceComponent,
    CollectedDataComponent,
    ExploitLevelComponent,
    BieuDoDonComponentComponent,
    BieuDoBvTieuCucComponent,
    HotSpotComponent,
    AvatarComponent,
    FormsModule,
    MidPanelComponent
],
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss'],
})
export class RightPanelComponent implements OnInit, AfterViewInit {
  @ViewChild(NuanceInforComponent) sacthaicp!: NuanceInforComponent;
  @ViewChild(UploadPostBarComponent) dangtaicp!: UploadPostBarComponent;
  @ViewChild(HotTopicComponent) hottopiccp!: HotTopicComponent;
  @ViewChild(ProtectingTargetComponent) protectcp!: ProtectingTargetComponent;
  @ViewChild(MonitoringTargetComponent) montitorcp!: MonitoringTargetComponent;
  @ViewChild(HotSpotComponent) hotspotcp!: HotSpotComponent;
  @ViewChild(InformationWarefaceResultComponent)
  resultcp!: InformationWarefaceResultComponent;
  typePopup: any = '';
  @Input() mainType: any = '';
  @Input() subType: any = '728';
  @Input() startDate: any = '';
  @Input() endDate: any = '';
  @Input() regionType: any = '';
  
  isInfoWarfareActive: boolean = false;
  isCyberWarfareActive: boolean = false;
  payload: any;
  channel: RealtimeChannel;
  payload$: Observable<any>;
  payloadData$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  payloadDataChangeTheme$: Observable<any>;
  startDate$: BehaviorSubject<string>;
  mode: any;
  // endDate$: Observable<Date>;
  protected readonly EventId = EventId;
  borderClass: string = ''; // Mặc định không có lớp CSS nào

  private socket = inject(SocketService);
  private cdr = inject(ChangeDetectorRef);
  sactaiDetail: any = [];
  ngAfterViewInit() {
    // this.sactaiDetail = this.childComponent.nuanceDataDetail;
  }

  isShowChiSoSacThai: boolean = false;
  isShowChuDeNong: boolean = false;
  isShowBocGo: boolean = false;
  isShowChiThi: boolean = false;
  isShowTruyenThong: boolean = false;
  isShowKQDangTai: boolean = false;
  isShowMucTieuBV: boolean = false;
  isShowDiemNong: boolean = false;
  isShowMucTieuGS: boolean = false;
  isShowTongQuan: boolean = false;
  showMidPanel: boolean = false;
  constructor(
    private modeToggleService: ModeToggleService,
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.store.dispatch(loadDateV2());
    this.payload$ = this.socket.payload$.pipe(
      tap((payload: any) => {
        if (payload.payload.type === EventId.CHANGE_THEME) {
          this.mode = payload.payload.data.mode;
          localStorage.clear();
          this.modeToggleService.selectMode(this.mode);
          this.cdr.markForCheck();
        } else if (payload.payload.type === EventId.DATE) {
          const { startDate, endDate } = payload.payload.data;

          this.store.dispatch(
            setDateV2({
              startDate: new Date(startDate),
              endDate: new Date(endDate),
            }),
          );
        } else if (payload?.payload?.type === EventId.CLOSE_POPUP) {
          this.resetActive();
        } else if (payload?.payload?.type === EventId.RESET_STATE) {
          this.deactivateTitles();
        }
        if (payload.payload.type === EventId.PANEL2) {
          this.borderClass = 'border-red';
          this.cdr.markForCheck();
        } else {
          this.borderClass = '';
        }
        if (payload.payload.type === EventId.SHOW_MID_RIGHT) {                    
          this.showMidPanel = payload.payload.data.show
        }
        this.payload = payload;
      }),
    )
  }
  onShowMid(show: boolean){
    this.socket.sendBroadcastChannel({
      type: EventId.SHOW_MID_LEFT,
      data: {
        show: show
      },
    });
  }

  onCloseMidPanel(){
    this.showMidPanel = false;
  }
  
  changeSelectMainType(event: any) {
    let selectElement = event.target as HTMLSelectElement;
    this.mainType = selectElement.value;
    if (this.mainType == Constant.MAIN_TYPE.QS) {
      this.subType = Constant.SUB_TYPE_DEVICE.QS_QP;
    } else if (this.mainType == Constant.MAIN_TYPE.CD) {
      this.subType = Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA;
    } else {
      this.subType = Constant.SUB_TYPE_DEVICE.ALL;
    }
    this.socket.sendBroadcastChannel({
      type: EventId.POPUP,
      data: {
        isPopupVisible: true,
        typePopup: this.typePopup,
        mainType: this.mainType,
        subType: this.subType,
        startDate: this.startDate,
        endDate: this.endDate,
      },
    });
  }
  changeSelectSubType(event: any) {
    let selectElement = event.target as HTMLSelectElement;
    this.subType = selectElement.value;

    // if(this.subType == Constant.SUB_TYPE_DEVICE.ALL){
    //   if(this.mainType == Constant.MAIN_TYPE.QS){
    //     this.subType = Constant.SUB_TYPE_DEVICE.QS_QP;
    //   }else if(this.mainType == Constant.MAIN_TYPE.CD){
    //     this.subType = Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA;
    //   }
    // };

    this.socket.sendBroadcastChannel({
      type: EventId.POPUP,
      data: {
        isPopupVisible: true,
        typePopup: this.typePopup,
        mainType: this.mainType,
        subType: this.subType,
        startDate: this.startDate,
        endDate: this.endDate,
      },
    });
  }
  onPopupToggled(event: { isPopupVisible: boolean; typePopup: string }) {
    this.isShowBocGo = false;
    this.isShowChiSoSacThai = false;
    this.isShowChiThi = false;
    this.isShowChuDeNong = false;
    this.isShowKQDangTai = false;
    this.isShowMucTieuBV = false;
    this.isShowMucTieuGS = false;
    this.isShowTruyenThong = false;
    this.isShowDiemNong = false;
    this.isShowTongQuan = false;

    // gửi sự kiện
    switch (event.typePopup) {
      case 'ChuDeNong':
        this.isShowChuDeNong = true;
        this.socket.sendBroadcastChannel({
          type: EventId.POPUP,
          data: {
            ...event,
            treeList: this.hottopiccp.hotTopicList,
            tongquanchude: this.hottopiccp.tongquanChuDeList,
            diemtin: this.hottopiccp.diemTinData,
          },
        });
        break;
      case 'KQDangTai':
        this.isShowKQDangTai = true;
        this.dangtaicp.uploadPostDataDetail$.subscribe(
          (uploadPostDataDetail) => {
            this.socket.sendBroadcastChannel({
              type: EventId.POPUP,
              data: {
                ...event,
                Detail: uploadPostDataDetail, // Use the emitted data
              },
            });
          },
        );
        break;
      case 'SacThai':
        this.isShowChiSoSacThai = true;
        this.sacthaicp.nuanceDataDetail$.subscribe((nuanceDataDetail) => {
          this.socket.sendBroadcastChannel({
            type: EventId.POPUP,
            data: {
              ...event,
              Detail: nuanceDataDetail, // Use the emitted data
            },
          });
        });
        break;
      case 'TQMucTieu':
        this.isShowMucTieuGS = true;
        this.socket.sendBroadcastChannel({
          type: EventId.POPUP,
          data: {
            ...event,
            Detail: this.montitorcp.filteredTargetCorrelationDataDetail,
          },
        });
        break;
      case 'MucTieuBaoVe':
        this.isShowMucTieuBV = true;
        this.socket.sendBroadcastChannel({
          type: EventId.POPUP,
          data: { ...event, Detail: this.protectcp.baoveDataDetail },
        });
        break;
      case 'DiemNong':
        this.isShowDiemNong = true;
        combineLatest([
          this.hotspotcp.hotSpotDataDetail$,
          this.hotspotcp.hotSpotStatusData$,
          this.hotspotcp.hotSpotStatisticData$,
        ]).subscribe(
          ([hotSpotDataDetail, hotSpotStatusData, hotSpotStatisticData]) => {
            this.socket.sendBroadcastChannel({
              type: EventId.POPUP,
              data: {
                ...event,
                Detail: {
                  dataDetail: hotSpotDataDetail,
                  statusData: hotSpotStatusData,
                  statisticData: hotSpotStatisticData,
                },
              },
            });
          },
        );
        break;
      case 'BocGo':
        this.isShowBocGo = true;
        this.resultcp.bocgoDetailData$.subscribe((bocgoDetailData) => {
          this.socket.sendBroadcastChannel({
            type: EventId.POPUP,
            data: {
              ...event,
              Detail: bocgoDetailData, // Use the emitted data
            },
          });
        });
        break;

      case 'ChiThi':
        this.isShowChiThi = true;
        this.resultcp.chithiDetailData$.subscribe((chithiDetailData) => {
          this.socket.sendBroadcastChannel({
            type: EventId.POPUP,
            data: {
              ...event,
              Detail: chithiDetailData, // Use the emitted data
            },
          });
        });
        break;
      case 'TruyenThong':
        this.isShowTruyenThong = true;
        this.socket.sendBroadcastChannel({
          type: EventId.POPUP,
          data: { ...event, Detail: this.resultcp.kenhtruyenthongDetailData },
        });
        break;
      case 'Overview':
        this.isShowTongQuan = true;
        this.socket.sendBroadcastChannel({
          type: EventId.POPUP,
          data: { ...event },
        });
        break;
      default:
        break;
    }
  }

  openMap(eventId: EventId) {
    this.setActiveWarfare(eventId);
    this.socket.sendBroadcastChannel({
      type: eventId,
      data: {},
    });
  }

  setActiveWarfare(warfareType: EventId) {
    this.isCyberWarfareActive = warfareType === EventId.CYBER_WARFARE_MAP;
    this.isInfoWarfareActive = warfareType === EventId.INFO_WARFARE_MAP;
  }

  deactivateTitles() {
    this.isInfoWarfareActive = false;
    this.isCyberWarfareActive = false;
  }

  resetActive() {
    this.isShowBocGo = false;
    this.isShowChiSoSacThai = false;
    this.isShowChiThi = false;
    this.isShowChuDeNong = false;
    this.isShowKQDangTai = false;
    this.isShowMucTieuBV = false;
    this.isShowMucTieuGS = false;
    this.isShowTruyenThong = false;
    this.isShowTongQuan = false;
    this.isShowDiemNong = false;
  }

}
