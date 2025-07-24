import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ModeToggleService, ModeType } from './mode-toggle.service';
import { Mode } from './mode-toggle.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../dashboard/services/supabase.service';
import { Observable, tap } from 'rxjs';
import { RealtimeChannel } from '@supabase/supabase-js';
import { EventId } from '../dashboard/models/btth.interface';
import { SocketService } from '../dashboard/services/socket.service';

/**
 * Angular component to switch the Mode
 * Also developers can create their own components with the use of `ModeToggleService`
 * @example
 * ```
 * <app-mode-toggle></app-mode-toggle>
 * ```
 */
@Component({
  selector: 'app-mode-toggle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'mode-toggle.component.html',
  styleUrls: ['mode-toggle.component.scss'],
})
export class ModeToggleComponent implements OnInit {
  channel: RealtimeChannel;
  payloadData$: Observable<any>;
  startDate: any;
  // endDate$: Observable<Date>;

  private supabase = inject(SupabaseService);
  private socket = inject(SocketService);
  private cdr = inject(ChangeDetectorRef);

  themes: { name: string; value: ModeType }[] = [
    { name: 'Lựa chọn 1', value: Mode.LIGHT },
    { name: 'Lựa chọn 2', value: Mode.DARK },
    { name: 'Lựa chọn 3', value: Mode.ORANGE },
    { name: 'Lựa chọn 4', value: Mode.SUPEDARK },
  ];

  selectedTheme: Mode = Mode.LIGHT;

  constructor(private modeToggleService: ModeToggleService) {}

  ngOnInit() {
    this.channel = this.socket.joinChannel();
    // this.socket.sendAllChanel(this.channel, 'change-theme');
    this.payloadData$ = this.socket.payload$.pipe(
      tap((payload) => {
        console.log(payload);
        this.startDate = payload.data;
      }),
    );
  }

  sendEventToMid(mode: ModeType) {
    this.socket.sendBroadcastChannel({
      type: EventId.CHANGE_THEME,
      data: { mode },
    });
  }

  toggle(mode: ModeType) {
    this.modeToggleService.selectMode(mode);
    this.sendEventToMid(mode);
    localStorage.setItem('mode', mode);
  }

  onSelectChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;

    console.log(selectedValue);

    // app.component.ts

    // Cập nhật màu viền dựa trên giá trị của tùy chọn được chọn
    switch (selectedValue) {
      case '1':
        // Tùy chọn 1 - Màu xanh dương
        this.socket.sendBroadcastChannel({
          type: EventId.PANEL1,
          data: {},
        });
        console.log('send');
        break;
      case '2':
        this.socket.sendBroadcastChannel({
          type: EventId.PANEL2,
          data: {},
        }); // Tùy chọn 2 - Màu xanh lá
        break;
      case '3':
        this.socket.sendBroadcastChannel({
          type: EventId.PANEL3,
          data: {},
        }); // Tùy chọn 3 - Màu đỏ
        break;
      case '4':
        this.socket.sendBroadcastChannel({
          type: EventId.PANEL4,
          data: {},
        }); // Tùy chọn 3 - Màu đỏ
        break;
      default:
        this.socket.sendBroadcastChannel({
          type: EventId.PANELALL,
          data: {},
        }); // Màu mặc định
    }
  }
}
