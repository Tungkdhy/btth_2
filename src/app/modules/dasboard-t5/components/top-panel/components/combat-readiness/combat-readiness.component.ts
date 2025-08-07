import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-combat-readiness',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './combat-readiness.component.html',
  styleUrls: ['./combat-readiness.component.scss'],
})
export class CombatReadinessComponent implements OnInit {
  data: any = {};
  combatReadinessData: any[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchCombatReadiness();
  }

  async fetchCombatReadiness() {
    const myHeaders = new Headers();
    myHeaders.append(
      'apikey',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'
    );
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      p_ngay_trang_thai: '20250805000000',
    });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    try {
      const response = await fetch(
        'http://10.10.53.58:8002/rest/v1/rpc/headers_trang_thai_vktb',
        requestOptions
      );

      const result = await response.json(); // API này trả JSON nên parse JSON
      this.data = result[0]

      if (Array.isArray(result) && result.length > 0) {
        const first = result[0];

        this.combatReadinessData = [
          {
            tenMang: 'Mạng Quân sự',
            thietBi: first.mang_qs,
            soLuong: first.mang_qs_so_luong,
          },
          {
            tenMang: 'Mạng Internet',
            thietBi: first.mang_internet,
            soLuong: first.mang_internet_so_luong,
          },
          {
            tenMang: 'Mạng Chuyên dùng',
            thietBi: first.mang_chuyen_dung,
            soLuong: first.mang_chuyen_dung_so_luong,
          },
        ];
      }

      this.cdr.detectChanges();
    } catch (error) {
      console.error('API error:', error);
    }
  }

  getStatusClass(value: number): string {
    switch (value) {
      case 1:
        return 'status-green';
      case 2:
        return 'status-yellow';
      case 3:
        return 'status-orange';
      case 4:
        return 'status-red';
      default:
        return '';
    }
  }

  getStatusText(value: number, id: number): string {
    if (id === 2 || id === 3) {
      switch (value) {
        case 1:
          return 'Cấp 1';
        case 2:
          return 'Cấp 2';
        case 3:
          return 'Cấp 3';
        case 4:
          return 'Cấp 4';
        default:
          return '';
      }
    } else {
      switch (value) {
        case 1:
          return 'TX';
        case 2:
          return 'Tăng cường';
        case 3:
          return 'Cao';
        case 4:
          return 'Toàn bộ';
        default:
          return '';
      }
    }
  }
}
