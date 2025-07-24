import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AccumulationChartModule,
  ChartModule,
} from '@syncfusion/ej2-angular-charts';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { RadioButtonModule } from '@syncfusion/ej2-angular-buttons';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Observable, tap } from 'rxjs';
import { EventId } from '../../../../models/btth.interface';
import { SocketService } from '../../../../services/socket.service';
import { FormsModule } from '@angular/forms';
import { Constant } from 'src/app/core/config/constant';
import { ItInfrasComponent } from '../network-defense/it-infras/it-infras.component';
import { SafetyInformationAlertComponent } from '../network-defense/safety-information-alert/safety-information-alert.component';
import { SafetyInformationComponent } from '../network-defense/safety-information/safety-information.component';
import { InfrastructureAlertComponent } from '../network-defense/infrastructure-alert/infrastructure-alert.component';
import { PayloadChannelData } from '../../../../models/payload-channel';
import { AvatarComponent } from '../../../shared/avatar/avatar.component';
import { MidPanelComponent } from "../../../mid-panel/mid-panel.component";
import { BreadcrumLeftRightComponent } from '../../../shared/breadcrum-left-right/breadcrum-left-right.component';
@Component({
  selector: 'app-network-defend-ittable',
  standalone: true,

  imports: [
    CommonModule,
    AccumulationChartModule,
    ChartModule,
    RadioButtonModule,
    ChartModule,
    ItInfrasComponent,
    InfrastructureAlertComponent,
    SafetyInformationComponent,
    SafetyInformationAlertComponent,
    FormsModule,
    AvatarComponent,
    MidPanelComponent,
    BreadcrumLeftRightComponent
  ],
  templateUrl: './network-defend-ittable.component.html',
  styleUrls: ['./network-defend-ittable.component.scss'],
})
export class NetworkDefendITTableComponent implements OnInit, OnChanges {
  channel: RealtimeChannel;
  payloadData$: Observable<any>;
  showMidPanel: boolean = false;
  typePopup: any = '';
  @Input() mainType: any = '';
  @Input() subType: any = '728';
  @Input() startDate: any = '';
  @Input() endDate: any = '';
  @Input() regionType: any = '';
  @ViewChild(ItInfrasComponent) itInfrasComponent!: ItInfrasComponent;
  @ViewChild(SafetyInformationComponent)
  safetyInformationComponent!: SafetyInformationComponent;
  titlePopup: string = '';
  resetChildState() {
    this.itInfrasComponent.resetActive();
    this.safetyInformationComponent.resetActive();
  }

  ngOnChanges(changes: SimpleChanges) { }
  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef,
    private socket: SocketService,
  ) { }
  ngOnInit() {
    this.channel = this.socket.joinChannel(EventId.POPUP);
    // this.supabase.listenToEventV2(this.channel, 'mid-right', () => {});
    this.channel.subscribe((res) => console.log('child: ', res));

    this.payloadData$ = this.socket.payload$.pipe(
      tap((channelData) => {
        const payload = channelData.payload as PayloadChannelData;
        if (payload.type === EventId.SHOW_MID_LEFT) {
          this.showMidPanel = payload.data.show
        }
        if (payload.type === EventId.CLOSE_POPUP) {
          this.titlePopup = '';
        }
        if (payload.type !== EventId.RESET_STATE) return;
        this.reset();
      }),
    );
  }
  onShowMid(show: boolean) {
    this.socket.sendBroadcastChannel({
      type: EventId.SHOW_MID_RIGHT,
      data: {
        show: show
      },
    });
  }
  onCloseMidPanel() {
    this.showMidPanel = false;
  }
  reset() {
    this.subType = Constant.SUB_TYPE_DEVICE.ALL;
    this.mainType = '';
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
    console.log('Popup Toggled:', { ...event, mainType: this.mainType });
    console.log(this.channel);
    this.typePopup = event?.typePopup;
    // gửi sự kiện
    this.socket.sendBroadcastChannel({
      type: EventId.POPUP,
      data: {
        ...event,
        mainType: this.mainType,
        subType: this.subType,
        startDate: this.startDate,
        endDate: this.endDate,
      },
    });
  }
  onChangeTilePopup(data: string) {
    this.titlePopup = data;
  }
}
