import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import { PayloadChannelData } from '../../../../models/payload-channel';
import {
  getAreaPayload,
  getDateRangePayload,
} from 'src/app/_metronic/layout/core/common/common-utils';
import { SupabaseKQTacChienService } from './services/supabase.service';
import {
  catchError,
  debounceTime,
  filter,
  from,
  map,
  Observable,
  of,
  Subject,
  tap,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { selectDateV2 } from 'src/app/store/date-time-range-v2/date-time-range-v2.selectors';

@Component({
  selector: 'app-information-wareface-result',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './information-wareface-result.component.html',
  styleUrls: ['./information-wareface-result.component.scss'],
})
export class InformationWarefaceResultComponent
  implements OnInit, OnChanges, OnDestroy
{
  get payload(): any {
    return this._payload;
  }

  @Input() set payload(value: any) {
    this._payload = value;
  }
  @Input() isShowBocGo: boolean;
  @Input() isShowChiThi: boolean;
  @Input() isShowTruyenThong: boolean;

  private _payload: PayloadChannelData;

  @Output() popupToggled = new EventEmitter<{
    isPopupVisible: boolean;
    typePopup: string;
  }>();

  private supabaseService = inject(SupabaseKQTacChienService);
  private cdr = inject(ChangeDetectorRef);

  public kenhtruyenthongData: any[] = [];
  public tongKenhTruyenThong: number = 0;
  public kenhtruyenthongDetailData: any[] = [];
  bocgoData$: Observable<any>;
  chithiData$: Observable<any>;
  bocgoDetailData$: Observable<any>;
  chithiDetailData$: Observable<any>;
  private eventSubject = new Subject<any>();
  private channel: any;

  isActive: boolean = false;
  defaultDataLoaded: boolean = false;
  previousPayloadValue: any;
  selectedStartDate: string | Date;
  selectedEndDate: string | Date;
  selectedArea: string;

  date$: Observable<any>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.date$ = this.store.select(selectDateV2).pipe(
      filter((date) => !!(date && date.startDate && date.endDate)),
      tap((date) => {
        // DO sth
        const { startDate, endDate } = getDateRangePayload(
          date.startDate!,
          date.endDate!,
          '0',
        );
        this.selectedStartDate = startDate;
        this.selectedEndDate = endDate;

        this.bocgoData$ = this.getBocGoData(startDate, endDate);
        this.chithiData$ = this.getChiThiData(startDate, endDate);
        this.bocgoDetailData$ = this.getChiTietBocGoData(startDate, endDate);
        this.chithiDetailData$ = this.getChiTietChiThiData(startDate, endDate);
      }),
    );

    const area = getAreaPayload(this.payload?.payload?.data);
    this.selectedArea = area;
    this.updateData(area);

    this.channel = this.supabaseService
      .getSupabase()
      .channel('schema-db-changes-10')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'TCTT_KenhTuyenTruyen' },
        (payload) => {
          this.eventSubject.next(payload);
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'TCTT_DonVi' },
        (payload) => {
          this.eventSubject.next(payload);
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'TCTT_TinBaiDangChuY' },
        (payload) => {
          this.eventSubject.next(payload);
        },
      )
      .subscribe();

    this.eventSubject
      .pipe(
        debounceTime(10 * 1000), // Điều chỉnh thời gian debounce theo nhu cầu
      )
      .subscribe(async (payload) => {
        this.updateData(this.selectedArea);
      });
  }

  togglePopup(isPopupVisible: boolean, typePopup: string) {
    this.popupToggled.emit({ isPopupVisible, typePopup });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.payload && !changes.payload.firstChange) {
      const currentValue = changes.payload.currentValue;

      // Nếu payload thay đổi liên quan đến `Area`
      if (this.isAreaPayload(currentValue)) {
        this.isActive = true;
        const area = getAreaPayload(currentValue.payload.data);
        this.selectedArea = area;
        this.updateData(area); // Cập nhật dữ liệu với Area mới
      } else {
        this.isActive = false;
      }
    }
  }

  ngOnDestroy() {
    // Xóa setInterval khi component bị hủy
  }

  getBocGoData(
    startDate: Date | string,
    endDate: Date | string,
  ): Observable<any> {
    return from(this.supabaseService.tctt_boc_go(startDate, endDate)).pipe(
      map((data: any) => data),
      catchError((error) => {
        console.error('Error fetching bocgoData:', error);
        return of([]); // Return an empty array in case of error
      }),
    );
  }

  getChiThiData(
    startDate: Date | string,
    endDate: Date | string,
  ): Observable<any> {
    return from(
      this.supabaseService.tctt_tong_quan_chi_thi(startDate, endDate),
    ).pipe(
      map((data: any) => data),
      catchError((error) => {
        console.error('Error fetching tong quan chi thi:', error);
        return of([]); // Return an empty array in case of error
      }),
    );
  }

  getChiTietBocGoData(
    startDate: Date | string,
    endDate: Date | string,
  ): Observable<any> {
    return from(
      this.supabaseService.tctt_chi_tiet_boc_go(startDate, endDate),
    ).pipe(
      map((data: any) => data),
      catchError((error) => {
        console.error('Error fetching bocgoData:', error);
        return of([]); // Return an empty array in case of error
      }),
    );
  }

  getChiTietChiThiData(
    startDate: Date | string,
    endDate: Date | string,
  ): Observable<any> {
    return from(
      this.supabaseService.tctt_chi_tiet_chi_thi(startDate, endDate),
    ).pipe(
      map((data: any) => data),
      catchError((error) => {
        console.error('Error fetching chỉ thị:', error);
        return of([]); // Return an empty array in case of error
      }),
    );
  }

  updateData(area: string) {
    this.supabaseService
      .tctt_trang_thai_kenh_tuyen_truyen(area)
      .then((data) => {
        this.kenhtruyenthongData = data;
        this.tongKenhTruyenThong = data[0].danghoatdong + data[0].dunghoatdong;
        this.cdr.markForCheck();
      })
      .catch((error) => {
        console.error('Error fetching kenhtruyenthongData:', error);
        this.kenhtruyenthongData = []; // Handle error case
        this.cdr.markForCheck();
      });

    this.supabaseService
      .tctt_chi_tiet_kenh_truyen_thong(area)
      .then((data) => {
        this.kenhtruyenthongDetailData = data;
        this.cdr.markForCheck();
      })
      .catch((error) => {
        console.error('Error fetching truyen thong data:', error);
        this.kenhtruyenthongDetailData = []; // Handle error case
        this.cdr.markForCheck();
      });
  }

  private isAreaPayload(payload: any): boolean {
    return payload && payload.payload.type === 'area';
  }

  formatNumberWithDotLocal(num: number | string | number[]): string {
    if (!num) return '';
    if (Array.isArray(num)) {
      return num
        .map((item) => item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'))
        .join(' - ');
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
