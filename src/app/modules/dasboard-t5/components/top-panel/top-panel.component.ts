import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaticInformationComponent } from './static-information/static-information.component';

import { Observable, tap } from 'rxjs';
import { RealtimeChannel } from '@supabase/supabase-js';
// import { SupabaseService } from '../../services/supabase.service';
// import { EventId } from '../../models/btth.interface';
import { SocketService } from 'src/app/modules/dashboard/services/socket.service';

@Component({
  selector: 'app-top-panel',
  standalone: true,
  imports: [CommonModule, StaticInformationComponent],
  templateUrl: './top-panel.component.html',
  styleUrls: ['./top-panel.component.scss'],
})
export class TopPanelComponent implements OnInit {
  typePopup: any = '';
  channel: RealtimeChannel;
  payloadData$: Observable<any>;
  startDate: any;
  // endDate$: Observable<Date>;
  mode: any;
  private socket = inject(SocketService);
  private cdr = inject(ChangeDetectorRef);

  borderClass: string = ''; // Mặc định không có lớp CSS nào

  constructor(
    // private modeToggleService: ModeToggleService,
    private renderer: Renderer2,
  ) {}
  ngOnInit(): void {
    
  }
  // ngOnInit() {
  //   // this.channel = this.socket.joinChannel();
  //   // // this.supabase.sendAllChanel(this.channel, 'change-theme');z
  //   // this.payloadData$ = this.socket.payload$.pipe(
  //   //   tap((payload) => {
  //   //     if (payload.payload.type === EventId.CHANGE_THEME) {
  //   //       this.mode = payload.payload.data.mode;
  //   //       localStorage.clear();
  //   //       this.modeToggleService.selectMode(this.mode);
  //   //       this.cdr.markForCheck();
  //   //     }
  //   //     if (payload.payload.type === EventId.PANEL1) {
  //   //       this.borderClass = 'border-red';
  //   //       console.log(this.borderClass);
  //   //       this.cdr.markForCheck();
  //   //     } else {
  //   //       this.borderClass = '';
  //   //     }
  //   //   }),
  //   );

    // this.socket.onMessage().subscribe((message) => {
    //   if (message.mode && message.mode !== this.mode) {
    //     this.mode = message.mode;
    //     this.modeToggleService.selectMode(this.mode);
    //
    //     // Cập nhật localStorage cho các tab khác trong cùng trình duyệt
    //     localStorage.setItem('mode', this.mode);
    //
    //     this.cdr.markForCheck();
    //   }
    // });
  // }
  onPopupToggled(event: { isPopupVisible: boolean; typePopup: string }) {
    console.log('Popup Toggled:', { ...event });
    console.log(this.channel);
    // this.typePopup = event?.typePopup;
    // // gửi sự kiện
    // this.socket.sendBroadcastChannel({
    //   type: EventId.POPUP,
    //   data: { ...event },
    // });
  }
}
