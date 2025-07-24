import { remove } from 'lodash-es';
import { interval } from 'rxjs';
import { data } from './../../right-panel/cyber-reconnaissance/datasource';
import {
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../services/supabase.service';
import { RealtimeChannel } from '@supabase/supabase-js';
import { SocketService } from '../../../services/socket.service';

@Component({
  selector: 'app-weapons-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weapons-status.component.html',
  styleUrls: ['./weapons-status.component.scss'],
})
export class WeaponsStatusComponent implements OnInit, AfterViewInit {
  genIdFromItem(item: any) {
    if (item.name == 'NACS')
      return 'nacs-' + (item?.main_type || '').toLowerCase();
    if (item.name == 'MMS') return 'fms-cd';
    if (item.name == 'FMS')
      return 'fms-' + (item?.main_type || '').toLowerCase();
    if (item.name == 'NextAV') return 'ta21-cd';
    if (item.name == 'TA21')
      return 'ta21-' + (item?.main_type || '').toLowerCase();
    // item?.name === 'FMS' ? 'fms' : null
    return null;
  }
  async handleClick(mainTypeGroup: any, item: any) {
    if (mainTypeGroup?.main_type === 'QS') {
      if (item?.level === 'Chiến thuật') {
        this.togglePopup(true, 'AgentsQSPopup');
      } else if (item?.level === 'Chiến dịch' && item?.name === 'FMS') {
        this.togglePopup(true, 'FmsPopup');
      }
    } else if (mainTypeGroup?.main_type === 'CD') {
      if (item?.level === 'Chiến thuật') {
        this.togglePopup(true, 'AgentsCDPopup');
      } else if (item?.level === 'Chiến dịch' && item?.name === 'MMS') {
        this.togglePopup(true, 'MmsPopup');
      }
    }
    if (item?.name === 'TA21' && mainTypeGroup?.main_type === 'QS') {
      this.togglePopup(true, 'Ta21Popup', 'QS');
    }
    if (item?.name === 'TA21' && mainTypeGroup?.main_type === 'INT') {
      this.togglePopup(true, 'Ta21Popup', 'INT');
    }
    if (item?.name === 'NextAV' && mainTypeGroup?.main_type === 'CD') {
      this.togglePopup(true, 'Ta21Popup', 'CD');
    }
    // if (item?.name === 'C&C') {
    //   this.togglePopup(true, 'CCPopup');
    // }
    if (item?.name === 'NACS' && mainTypeGroup?.main_type === 'QS') {
      this.togglePopup(true, 'NacsPopup', 'QS');
    }
    if (item?.name === 'NACS' && mainTypeGroup?.main_type === 'CD') {
      this.togglePopup(true, 'NacsPopup', 'CD');
    }
    if (item?.name == 'CT86') {
      this.togglePopup(true, 'CT86Popup');
    }
    if (
      item?.level === 'Chiến thuật' &&
      mainTypeGroup?.main_type === 'INT' &&
      item?.name !== 'CT86' &&
      item?.name !== 'VPN'
    ) {
      this.togglePopup(true, 'AgentsIntPopup');
    }
    if (item?.name == 'Fidelis') {
      this.togglePopup(true, 'FidelisPopup');
    }
  }

  @Output() popupToggled = new EventEmitter<{
    isPopupVisible: boolean;
    typePopup: string;
    dataTa21?: any;
  }>();
  public weaponList: any = [];
  channel: RealtimeChannel;

  constructor(
    private readonly supabase: SupabaseService,
    private readonly socket: SocketService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
  ) {}
  togglePopup(isPopupVisible: boolean, typePopup: string, dataTa21?: any) {
    this.popupToggled.emit({ isPopupVisible, typePopup, dataTa21 });
  }
  async ngOnInit(): Promise<void> {
    this.weaponList = await this.supabase.getVuKhiTrangBi(null, 0, 0);

    this.cdr.detectChanges();
  }
  async xxx(
    idTag: string,
    text: string,
    tbName: string,
    typeNet: string,
  ): Promise<void> {
    tbName = tbName || '';
    typeNet = typeNet || 'QS';
    let _supabase = this.supabase.getSpBtth();
    let sp = _supabase
      .from('view_server')
      .select('*', { count: 'exact', head: true })
      .eq('main_type', typeNet)
      .eq('status', 'down');
    if (tbName.includes('_ta21')) sp = sp.eq('type', 'ta21');
    else if (tbName.includes('_fmc')) sp = sp.eq('type', 'fms');
    else sp = sp.eq('type', 'nac');

    let countFmsQS = (await sp).count;
    setTimeout(() => {
      const fmsElement = this.elementRef.nativeElement.querySelector(idTag);
      if (fmsElement) {
        if (countFmsQS !== 0) {
          const parentElement = fmsElement?.parentElement;
          parentElement.classList?.remove('badge-success');
          parentElement.classList?.add('badge-danger');
          fmsElement.innerHTML = `${text} <span>(${countFmsQS})</span>`;
        } else {
          fmsElement.textContent = `${text}`;
        }
      } else {
        console.warn('xxx not found #idTag');
      }
    }, 1000);
  }

  errorNumber() {
    this.xxx('#fms-qs', 'FMS', 'server_fmc', 'QS');
    this.xxx('#fms-cd', 'MMS', 'server_fmc', 'CD');

    this.xxx('#ta21-qs', 'TA21', 'server_ta21', 'QS');
    this.xxx('#ta21-int', 'TA21', 'server_ta21', 'INT');
    this.xxx('#ta21-cd', 'NextAV', 'server_ta21', 'CD');

    this.xxx('#nacs-qs', 'NACS', 'server_nac', 'QS');
    this.xxx('#nacs-int', 'NACS', 'server_nac', 'INT');
    this.xxx('#nacs-cd', 'NACS', 'server_nac', 'CD');
  }
  async ngAfterViewInit(): Promise<void> {
    // await this.xxx('#fms', 'FMS', 'server_fmc', 'QS');
    this.errorNumber();
    let interval = setInterval(
      () => {
        this.errorNumber();
      },
      1000 * 60 * 3,
    );
  }
  getStatusClass(status: string): string {
    switch (status) {
      case 'Hoạt động bình thường':
        return 'status-green ';
      case 'Có sự cố':
        return 'status-red';
      case 'Nâng cấp, bảo trì':
        return 'status-orange';
      default:
        return '';
    }
  }
}
