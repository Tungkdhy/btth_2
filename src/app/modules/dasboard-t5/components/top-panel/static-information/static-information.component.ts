import {
  Component,
  EventEmitter,
  Output,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { RealtimeChannel } from '@supabase/supabase-js';
import { SocketService } from 'src/app/modules/dashboard/services/socket.service';
import { TrucComponent } from '../components/truc/truc.component';
import { WeaponsStatusComponent } from 'src/app/modules/dashboard/components/shared/weapons-status/weapons-status.component';
import { CombatReadinessComponent } from '../components/combat-readiness/combat-readiness.component';
import { OperationalCommandComponent } from 'src/app/modules/dashboard/components/shared/operational-command/operational-command.component';
import { QSComponent } from '../components/qs/combat-readiness.component';
@Component({
  selector: 'app-static-information',

  standalone: true,
  imports: [
    CommonModule,TrucComponent,OperationalCommandComponent,CombatReadinessComponent,WeaponsStatusComponent,QSComponent
  ],
  templateUrl: './static-information.component.html',
  styleUrls: ['./static-information.component.scss'],
})
export class StaticInformationComponent {
  private supabase = inject(SupabaseService);
  private socket = inject(SocketService);
  channel: RealtimeChannel;
  private cdr = inject(ChangeDetectorRef);
  @Output() popupToggled = new EventEmitter<{
    isPopupVisible: boolean;
    typePopup: string;
  }>();
  togglePopup(isPopupVisible: boolean, typePopup: string) {
    this.popupToggled.emit({ isPopupVisible, typePopup });
  }

  ngOnInit(): void {
    // this.supabaseChangeTheme.sendAllChanel(this.channel, 'change-theme');
    // this.payloadDataChangeTheme$ = this.supabase.payload$.pipe(
    //   tap((payload) => {
    //     this.mode = localStorage.getItem('mode');
    //     localStorage.clear();
    //     this.modeToggleService.selectMode(this.mode);
    //   }),
    // );
  }
  onPopupToggled(event: {
      isPopupVisible: boolean;
      typePopup: string;
      data?: any;
    }) :void { 

  }
  // onPopupToggled(event: {
  //   isPopupVisible: boolean;
  //   typePopup: string;
  //   data?: any;
  // }) {
  //   console.log(event);
  //   switch (event.typePopup) {
  //     case 'AddOperator':
  //       this.socket.sendBroadcastChannel({
  //         type: EventId.POPUP,
  //         data: {
  //           ...event,
  //         },
  //       });
  //       break;
  //     case 'AgentsQSPopup':
  //       this.socket.sendBroadcastChannel({
  //         type: EventId.POPUP,
  //         data: {
  //           ...event,
  //         },
  //       });
  //       break;
  //     case 'AgentsCDPopup':
  //       this.socket.sendBroadcastChannel({
  //         type: EventId.POPUP,
  //         data: {
  //           ...event,
  //         },
  //       });
  //       break;
  //     case 'ChiTietNhiemVuPopup':
  //       this.socket.sendBroadcastChannel({
  //         type: EventId.POPUP,
  //         data: {
  //           ...event,
  //           data: event?.data,
  //         },
  //       });
  //       break;
  //     case 'FmsPopup':
  //       this.socket.sendBroadcastChannel({
  //         type: EventId.POPUP,
  //         data: {
  //           ...event,
  //         },
  //       });
  //       break;
  //     case 'MmsPopup':
  //       this.socket.sendBroadcastChannel({
  //         type: EventId.POPUP,
  //         data: {
  //           ...event,
  //         },
  //       });
  //       break;
  //     case 'CCPopup':
  //       this.socket.sendBroadcastChannel({
  //         type: EventId.POPUP,
  //         data: {
  //           ...event,
  //         },
  //       });
  //       break;
  //     case 'Ta21Popup':
  //       this.socket.sendBroadcastChannel({
  //         type: EventId.POPUP,
  //         data: {
  //           ...event,
  //         },
  //       });
  //       break;
  //     case 'NacsPopup':
  //       this.socket.sendBroadcastChannel({
  //         type: EventId.POPUP,
  //         data: {
  //           ...event,
  //         },
  //       });
  //       break;
  //     case 'Duphong86Popup':
  //       this.socket.sendBroadcastChannel({
  //         type: EventId.POPUP,
  //         data: {
  //           ...event,
  //         },
  //       });
  //       break;
  //     case 'CT86Popup':
  //       this.socket.sendBroadcastChannel({
  //         type: EventId.POPUP,
  //         data: {
  //           ...event,
  //         },
  //       });
  //       break;
  //     case 'AgentsIntPopup':
  //       this.socket.sendBroadcastChannel({
  //         type: EventId.POPUP,
  //         data: {
  //           ...event,
  //         },
  //       });
  //       break;
  //     case 'FidelisPopup':
  //       this.socket.sendBroadcastChannel({
  //         type: EventId.POPUP,
  //         data: {
  //           ...event,
  //         },
  //       });
  //       break;
  //     case 'DieuHanhTrucChiTietPopup':
  //       this.socket.sendBroadcastChannel({
  //         type: EventId.POPUP,
  //         data: {
  //           ...event,
  //         },
  //       });
  //       break;
  //     default:
  //       break;
  //   }
  //   this.cdr.detectChanges();
  // }
}
