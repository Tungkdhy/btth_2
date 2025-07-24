import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CONFIG } from 'src/environments/environment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-duty-roster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './duty-roster.component.html',
  styleUrls: ['./duty-roster.component.scss'],
})
export class DutyRosterComponent implements OnInit, OnDestroy {
  public shiftInformation: any;
  currentDateTime: Date = new Date();
  intervalId: any;

  // active btn 
  buttons = ['CQTT', 'Cụm 11', 'Cụm 12', 'Cụm 13'];
  activeBtnIndex: number = 0;
  setActiveBtn(index: number) {
    this.activeBtnIndex = index;
  }

  constructor(private cdr: ChangeDetectorRef) {}
  // processShiftInformation(data: any[]) {
  //   return data.map((item) => ({
  //     ...item,
  //     TrucBanPho: this.extractName(item?.TrucBanPho),
  //   }));
  // }

  extractName(fullName: string): string {
    return fullName?.split('(')[0]?.trim();
  }
  async fetchAndProcessShiftInformation() {
    let response = await fetch(
      `${CONFIG.API.BACKEND.DIEU_HANH_TRUC_URL}/api/QuanSo_LichTruc`,
    );
    let data = await response.json();
    // this.shiftInformation = this.processShiftInformation(data?.LichTruc);
    this.shiftInformation = data;
    this.cdr.markForCheck();
  }
  async ngOnInit(): Promise<void> {
    this.startRealTimeClock();
    this.fetchAndProcessShiftInformation();

    // let response = await fetch(
    //   `${CONFIG.API.BACKEND.DIEU_HANH_TRUC_URL}/api/QuanSo_LichTruc`,
    // );

    // let data = await response.json();

    // this.shiftInformation = data;

    // this.shiftInformation = {
    //   CoMat: 907,
    //   LichTruc: [
    //     {
    //       Id_DonVi: '0035',
    //       TenDonVi: 'CQ BTL',
    //       TrucBanPho: 'Bình',
    //       TrucBanTruong: 'Tùng',
    //       TrucCH: 'Tiến',
    //     },
    //     {
    //       Id_DonVi: '003510',
    //       TenDonVi: 'T1',
    //       TrucBanPho: 'Tùng(P.CHV)',
    //       TrucBanTruong: 'Đức',
    //       TrucCH: 'Việt',
    //     },
    //     {
    //       Id_DonVi: '003511',
    //       TenDonVi: 'T2',
    //       TrucBanPho: 'Hưng',
    //       TrucBanTruong: 'Anh',
    //       TrucCH: 'Anh',
    //     },
    //     {
    //       Id_DonVi: '003512',
    //       TenDonVi: 'T3',
    //       TrucBanPho: 'Phan',
    //       TrucBanTruong: 'Hoàng',
    //       TrucCH: 'Duy',
    //     },
    //     {
    //       Id_DonVi: '003507',
    //       TenDonVi: 'V4',
    //       TrucBanPho: 'Huy',
    //       TrucBanTruong: 'Lệ',
    //       TrucCH: 'Dũng',
    //     },
    //     {
    //       Id_DonVi: '003509',
    //       TenDonVi: 'T6',
    //       TrucBanPho: '',
    //       TrucBanTruong: '',
    //       TrucCH: 'Cương',
    //     },
    //     {
    //       Id_DonVi: '003515',
    //       TenDonVi: 'T7',
    //       TrucBanPho: '',
    //       TrucBanTruong: '',
    //       TrucCH: 'Đoàn',
    //     },
    //   ],
    //   NgayBaoCao: '22/07/2024',
    //   QuanSo: 1045,
    //   TrucChiHuy: 'Đại tá Nguyễn Tiền Giang',
    //   Vang: 138,
    // };
  }

  startRealTimeClock(): void {
    this.intervalId = setInterval(() => {
      this.currentDateTime = new Date();
      this.cdr.detectChanges();
    }, 1000); // Cập nhật mỗi 1 giây
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getLastWord(words: string): string {
    let str = words?.trim()?.split(' ');
    return str[str.length - 1] || '';
  }
}
