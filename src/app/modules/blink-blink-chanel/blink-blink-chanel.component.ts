import { ChangeDetectorRef, Component , inject, OnInit , Renderer2} from '@angular/core';
import { SocketService } from '../dashboard/services/socket.service';
import { SupabaseService } from '../dashboard/services/supabase.service';
import { EventId } from '../dashboard/models/btth.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RealtimeChannel } from '@supabase/supabase-js';
import { filter, Observable, startWith, Subscription, tap } from 'rxjs';




@Component({
  selector: 'app-blink-blink-chanel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blink-blink-chanel.component.html',
  styleUrls: ['./blink-blink-chanel.component.scss']
})

export class BlinkBlinkChanelComponent implements OnInit {

  channel: RealtimeChannel;
  payloadData$: Observable<any>;
  startDate: any;
  private socket = inject(SocketService);
  

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
  onSelectChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;


    console.log(selectedValue)

    // app.component.ts
    
    // Cập nhật màu viền dựa trên giá trị của tùy chọn được chọn
    switch (selectedValue) {
      case '1':
          // Tùy chọn 1 - Màu xanh dương
        this.socket.sendBroadcastChannel({
          type: EventId.PANEL1,
          data: {},
        });
        console.log('send')
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
        });   // Tùy chọn 3 - Màu đỏ
        break;
      case '4':
        this.socket.sendBroadcastChannel({
          type: EventId.PANEL4,
          data: {},
          });   // Tùy chọn 3 - Màu đỏ
          break;
      default:
        this.socket.sendBroadcastChannel({
          type: EventId.PANELALL,
          data: {},
        });  // Màu mặc định
    }
  }
}

