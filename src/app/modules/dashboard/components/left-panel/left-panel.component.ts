import {
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

import { NetworkDefendITTableComponent } from './components/network-defend-ittable/network-defend-ittable.component';
import { RealtimeChannel } from '@supabase/supabase-js';
import { filter, first, Observable, tap } from 'rxjs';
import { SupabaseService } from '../../services/supabase.service';
import { ModeToggleService } from '../../../mode-toggle/mode-toggle.service';
import { EventId } from '../../models/btth.interface';
import { SocketService } from '../../services/socket.service';
import { Store } from '@ngrx/store';
import { loadDateV2, setDateV2 } from 'src/app/store/date-time-range-v2/date-time-range-v2.actions';
import { selectDateV2 } from 'src/app/store/date-time-range-v2/date-time-range-v2.selectors';
import { AvatarComponent } from '../shared/avatar/avatar.component';

@Component({
  selector: 'app-left-panel',
  standalone: true,
  imports: [CommonModule, NetworkDefendITTableComponent, AvatarComponent],
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
})
export class LeftPanelComponent implements OnInit {
  channel: RealtimeChannel;
  payloadData$: Observable<any>;
  date$: Observable<any>;

  regionType: any = 'all';
  @Input() subType: any = '728';  
  startDate: any;
  endDate: any;
  mode: any;
  borderClass='';
  @ViewChild(NetworkDefendITTableComponent) networkDefendITTableComponent!: NetworkDefendITTableComponent
  private supabase = inject(SupabaseService);
  private socket = inject(SocketService);
  private cdr = inject(ChangeDetectorRef);

  constructor(
    private modeToggleService: ModeToggleService,
    private store: Store,
  ) {}

  async ngOnInit() {
    // this.date$ = this.store.select(selectDateV2).pipe(
    //   filter((date) => !!(date && date.startDate && date.endDate)),
    //   tap((date) => {
    //     // DO sth
    //     this.startDate = date.startDate;
    //     this.endDate = date.endDate;
    //   })
    // );
    // this.store.dispatch(loadDateV2());
    this.payloadData$ = this.socket.payload$.pipe(
      tap((payload) => {
        if (payload?.payload?.type === EventId.DATE) {
          // const { startDate, endDate } = payload.payload.data;
          // this.store.dispatch(
          //   setDateV2({ startDate: startDate, endDate: endDate }),
          // );
          this.startDate = new Date(payload.payload.data.startDate);
          this.endDate = new Date(payload.payload.data.endDate);
        } else if (payload?.payload?.type === EventId.AREA) {
          this.regionType = payload.payload.data;
        } else if (payload?.payload?.type === EventId.CHANGE_THEME) {
          this.mode =payload.payload.data.mode;
          localStorage.clear();
          this.modeToggleService.selectMode(this.mode);
          this.cdr.markForCheck();
        } else if (payload?.payload?.type === EventId.UNIT) {
          this.subType = payload.payload.data.unit_path;
        }else if (payload?.payload?.type === EventId.CLOSE_POPUP){
          this.networkDefendITTableComponent.resetChildState();
        }else if (payload?.payload?.type === EventId.PANEL3) {
          this.borderClass = 'border-red'
          console.log(this.borderClass)
          this.cdr.markForCheck();
        }
        else{
          this.borderClass='';
        }
      }),
    );
    let settingList = await this.supabase.fetchSettings();

    let settingTime = settingList?.find((e:any)=>e.name=='main');
    this.startDate = settingTime?.from;
    this.endDate = settingTime?.to;
  }
}
