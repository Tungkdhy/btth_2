import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import { IntelInformationComponent } from './intel-info/intel-information.component';
import { PopUp2Component } from './pop-up-2/pop-up-2.component';
import { AddOperatorComponent } from './add-operator/add-operator.component';
import { ClientPopupComponent } from './client-popup/client-popup.component';
import { CommonPopupComponent } from './common-popup/common-popup.component';
import { FirewallPopupComponent } from './firewall-popup/firewall-popup.component';
import { FmsPopupComponent } from './fms-popup/fms-popup.component';
import { OtherDevicePopupComponent } from './other-device-popup/other-device-popup.component';
import { PortalPopupComponent } from './portal-popup/portal-popup.component';
import { RouterPopupComponent } from './router-popup/router-popup.component';
import { ServerPopupComponent } from './server-popup/server-popup.component';
import { SwitchPopupComponent } from './switch-popup/switch-popup.component';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Observable, tap } from 'rxjs';
import { SupabaseService } from '../../../services/supabase.service';
import { ModeToggleService } from '../../../../mode-toggle/mode-toggle.service';
import { TcttPopupChudenongComponent } from '../tctt-detail/tctt-popup-chudenong/tctt-popup-chudenong.component';
import { Card2ColComponent } from './shared/card-2-col/card-2-col.component';
import { TcttPopupKqdangtaiComponent } from '../tctt-detail/tctt-popup-kqdangtai/tctt-popup-kqdangtai.component';
import { TcttPopupSacthaiComponent } from '../tctt-detail/tctt-popup-sacthai/tctt-popup-sacthai.component';
import { TcttPopupTuongquanbaivietComponent } from '../tctt-detail/tctt-popup-tuongquanbaiviet/tctt-popup-tuongquanbaiviet.component';
import { TcttPopupTuongquanmuctieuComponent } from '../tctt-detail/tctt-popup-tuongquanmuctieu/tctt-popup-tuongquanmuctieu.component';
import { TcttPopupComponent } from '../tctt-detail/tctt-popup/tctt-popup.component';
import { OperationalDetailCommandComponent } from './chi-tiet-nhiem-vu-popup/operational-command.component';
import { DetailDeviceModalComponent } from '../../shared/detail-device-modal/detail-device-modal.component';
import { AgentsQsPopupComponent } from './agents-qs-popup/agents-popup.component';
import { MMSPopupComponent } from './mms-popup/mms-popup.component';
import { SocketService } from '../../../services/socket.service';
import { CleanedMalwarePopupComponent } from './cleaned-malware-popup/cleaned-malware-popup.component';
import { UncleanedMalwareClientServerListCardComponent } from '../../shared/client-server-component-modal/uncleaned-malware-list-card/uncleaned-malware-list-card.component';
import { UncleanedMalwareListCardComponent } from '../../shared/uncleaned-malware-list-card/uncleaned-malware-list-card.component';
import { DinhDanhKhongDongNhatPopupComponent } from './dinh-danh-khong-dong-nhat-popup/dinh-danh-khong-dong-nhat-popup.component';
import { ThietBiDauCuoiPopupComponent } from './thiet-bi-dau-cuoi-popup/thiet-bi-dau-cuoi-popup.component';
import { Ta21PopupComponent } from './ta21-popup/ta21-popup.component';
import { CCPopupComponent } from './cc-popup/cc-popup.component';
import { AgentsChuyenDungPopupComponent } from './agents-chuyendung-popup/agents-popup.component';
import { NacsPopupComponent } from './nacs-popup/nacs-popup.component';
import { DuPhong86PopupComponent } from './du-phong-86/du-phong-86-popup.component';
import { FidelisPopupComponent } from './fidelis-popup/nacs-popup.component';
import { TcttDiemNongPopupComponent } from '../tctt-detail/tctt-diem-nong-popup/tctt-popup-diemnong.component';
import { CT86PopupComponent } from './ct86-popup/chi-tiet-nhiem-vu-full-popup.component';
import { TcttTruyenthongPopupComponent } from '../tctt-detail/tctt-truyenthong-popup/tctt-truyenthong-popup.component';

@Component({
  selector: 'app-detail-panel',
  templateUrl: './detail-panel.component.html',
  styleUrls: ['./detail-panel.component.scss'],
  imports: [
    TcttTruyenthongPopupComponent,
    PopUp2Component,
    IntelInformationComponent,
    AddOperatorComponent,
    ClientPopupComponent,
    CommonPopupComponent,
    FirewallPopupComponent,
    OtherDevicePopupComponent,
    PortalPopupComponent,
    RouterPopupComponent,
    ServerPopupComponent,
    SwitchPopupComponent,
    FmsPopupComponent,
    TcttPopupChudenongComponent,
    Card2ColComponent,
    TcttPopupKqdangtaiComponent,
    TcttPopupSacthaiComponent,
    TcttPopupTuongquanbaivietComponent,
    TcttPopupTuongquanmuctieuComponent,
    TcttPopupComponent,
    OperationalDetailCommandComponent,
    DetailDeviceModalComponent,
    AgentsQsPopupComponent,
    MMSPopupComponent,
    CleanedMalwarePopupComponent,
    UncleanedMalwareClientServerListCardComponent,
    UncleanedMalwareListCardComponent,
    DinhDanhKhongDongNhatPopupComponent,
    ThietBiDauCuoiPopupComponent,
    Ta21PopupComponent,
    CCPopupComponent,
    AgentsChuyenDungPopupComponent,
    NacsPopupComponent,
    DuPhong86PopupComponent,
    FidelisPopupComponent,
    TcttDiemNongPopupComponent,
    CT86PopupComponent,
  ],
  standalone: true,
})
export class DetailPanelComponent implements OnInit {
  channel: RealtimeChannel;
  payloadData$: Observable<any>;
  startDate: any;
  // endDate$: Observable<Date>;
  mode: any;
  private socket = inject(SocketService);
  private cdr = inject(ChangeDetectorRef);

  constructor(private modeToggleService: ModeToggleService) {}

  ngOnInit() {
    // this.supabase.sendAllChanel(this.channel, 'change-theme');
    this.payloadData$ = this.socket.payload$.pipe(
      tap((payload) => {
        this.mode = localStorage.getItem('mode');
        localStorage.clear();
        this.modeToggleService.selectMode(this.mode);
      }),
    );
  }
}
