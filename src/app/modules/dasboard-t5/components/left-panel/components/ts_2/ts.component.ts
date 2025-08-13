import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ApiTSService } from 'src/app/modules/dasboard-t5/services/ts.service';
import { PieChartComponent } from '../../../shared/pie-chart/pie-chart.component';
import { PipeChartConfig } from '../../../shared/pie-chart/pipe-chart.config';
import { StackChartConfig } from '../../../shared/stack-chart/stack-chart.config';
import { TablePtmComponent } from './table-ptm/table-ptm.component';
import { HeaderChartComponent } from '../../../shared/header-chart/header-chart.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';
import { ChuthichComponent } from '../../../shared/chuthich/chuthich.component';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import {
  convertStatsToChartConfig,
  convertToDataLeak,
} from 'src/app/modules/dasboard-t5/utils/covertDataLeak';
import { TableKGMComponent } from '../../../shared/table-kgm/table-kgm.component';
import { TableLLComponent } from '../../../shared/table-ll/table-ll.component';
import dayjs from 'dayjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
type SimplifiedItem = {
  stt: number;
  noi_dung_day_du: string;
  noi_dung_rut_gon: string;
  ngay_su_kien: string;
};
@Component({
  selector: 'app-ts-2',
  standalone: true,
  templateUrl: './ts.component.html',
  styleUrls: ['./ts.component.scss'],
  imports: [
    TableLLComponent,
    TableKGMComponent,
    CommonModule,
    ChuthichComponent,
    NzDatePickerModule,
    FormsModule,
    HeaderChartComponent,
    TablePtmComponent,
    PieChartComponent,
  ],
})
export class Ts2Component implements OnInit {
  formatDateToDDMMYYYY(dateStr: any) {
    const date = new Date(dateStr);
    //@ts-ignore
    if (isNaN(date)) return null; // Trả về null nếu dateStr không hợp lệ

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
  dataFollow = [];
  http = inject(HttpClient);
  headers = new HttpHeaders({
    apiKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE', // 🔐 Thay YOUR_API_KEY_HERE bằng key thật
  });
  fetchHackerGroupData(start: string, end: string) {
    const body = {
      start_date: '2024-08-01T00:00:00',
      end_date: '2025-08-05T23:59:59',
    };

    this.http
      .post<any>(
        'http://10.10.53.58:8002/rest/v1/rpc/mang_internet_tc_hackers',
        body,
        { headers: this.headers },
      )
      .subscribe((res) => {
        const groups = res?.data?.hacker_groups || [];
        this.dataFollow = groups.map((item: any, index: number) => ({
          stt: index + 1,
          ten_nhom_hacker: item.name || '',
          hinh_thuc_hoat_dong: item.description || '',
          mo_ta: item.known_for || '',
          thoi_gian_hoat_dong_gan_nhat:
            this.formatDateToDDMMYYYY(item.last_activity) || '',
          quoc_gia: item.origin_country || '',
          muc_do_hoat_dong: item.activity_level || '',
          muc_do_de_doa: item.threat_level || '',
          nam_thanh_lap: item.formation_year || '',
        }));

        this.cdr.detectChanges();
      });
  }

  date: Date[] = [
    new Date(2025, 0, 31), // tháng 1
    new Date(2025, 7, 31), // tháng 8
  ];
  thKGM: SimplifiedItem[] = [];
  data: any[] = [
    {
      description: 'Tt lộ lọt liên quan đến Bộ, Ban Ngành',
      value: '12222',
    },
    {
      description: 'Tt lộ lọt liên quan đến VPQH',
      value: '20',
    },
    {
      description: 'Tt lộ lọt liên quan đến VPCP',
      value: '30',
    },
    {
      description: 'Tt lộ lọt liên quan đến Quân đội',
      value: '21',
    },
    {
      description: 'Tt lộ lọt khác',
      value: '40',
    },
  ];
  data2 = [
    { stt: 1, title: 'TK thư viện số', ngay: '15/7/2025', chuquan: 'VPQH' },
    { stt: 2, title: 'TK Văn phòng Đ...', ngay: '11/7/2025', chuquan: 'VPCP' },
    { stt: 3, title: 'TK Đại sứ quán...', ngay: '10/7/2025', chuquan: 'Khác' },
    { stt: 4, title: 'Tài liệu SQLQ 2', ngay: '10/7/2025', chuquan: 'Bộ, Ban' },
    { stt: 5, title: 'TK Bộ công thư...', ngay: '09/7/2025', chuquan: 'VPQH' },
    { stt: 6, title: 'TK Kho bạc Nh...', ngay: '07/7/2025', chuquan: 'Khác' },
    { stt: 7, title: 'TK CSDL', ngay: '02/7/2025', chuquan: 'VPCP' },
  ];
  chartConfig: PipeChartConfig = {
    data: [
      { value: 4, name: 'BBN', itemStyle: { color: 'rgba(28, 155, 83, 1)' } },
      { value: 5, name: 'VPQH', itemStyle: { color: 'rgba(52, 131, 251, 1)' } },
      { value: 7, name: 'VPCP', itemStyle: { color: 'rgb(221, 161, 31)' } },
      {
        value: 7,
        name: 'Quân đội',
        itemStyle: { color: 'rgba(210, 0, 26, 1)' },
      },
      { value: 7, name: 'Khác', itemStyle: { color: 'rgb(140, 119, 119)' } },
    ],
    title: '',
    colors: ['#ff4d4f', '#40a9ff', '#73d13d'],
    legendPosition: 'bottom',
    radius: ['30%', '85%'],

    showLabelInside: false,
    height: '400px',
    legend: false,
  };
  config: StackChartConfig = {
    isStacked: true,
    categories: ['H', 'X', 'P', 'K', 'MAL'],
    height: '300px',
    series: [
      {
        name: 'Tàu hải cảnh',
        color: '#2f3e9e',
        data: [4, 2, 1, 3, 3],
      },
      {
        name: 'Tàu cá',
        color: '#e91d24',
        data: [4, 5, 4, 5, 2],
      },
      {
        name: 'Giàn khoan',
        color: '#ffca28',
        data: [5, 1, 5, 6, 4],
      },
      {
        name: 'Tàu dân sự',
        color: '#66bb6a',
        data: [6, 3, 1, 4, 2],
      },
      {
        name: 'Tàu quân sự',
        color: '#2196f3',
        data: [2, 0, 1, 1, 1],
      },
    ],
  };
  kri: StackChartConfig = {
    // isStacked: true,
    isStacked: true,
    categories: ['H', 'X', 'P', 'K', 'MAL'],
    height: '300px',
    series: [
      {
        name: 'Tàu hải cảnh',
        color: '#2f3e9e',
        data: [4, 2, 1, 3, 3],
      },
      {
        name: 'Tàu cá',
        color: '#e91d24',
        data: [4, 5, 4, 5, 2],
      },
      {
        name: 'Giàn khoan',
        color: '#ffca28',
        data: [5, 1, 5, 6, 4],
      },
      {
        name: 'Tàu dân sự',
        color: '#66bb6a',
        data: [6, 3, 1, 4, 2],
      },
      {
        name: 'Tàu quân sự',
        color: '#2196f3',
        data: [2, 0, 1, 1, 1],
      },
    ],
  };
  nonStackChartConfig: StackChartConfig = {
    title: 'Chủ đề giám sát nổi bật',
    subTitle: 'Tháng 3/2025',
    height: '300px',
    isStacked: false, // 🔁 RẤT QUAN TRỌNG
    categories: [],
    series: [
      {
        name: 'TT liên quan UVBCT',
        data: [11],
        color: '#ff5b57',
      },
      {
        name: 'TT liên quan địa bàn QK3',
        data: [5],
        color: '#f8a548',
      },
      {
        name: 'Hội nghị BCHTW',
        data: [13],
        color: '#fcd200',
      },
    ],
  };
  area: StackChartConfig = {
    isStacked: true,
    height: '300px',
    categories: [
      'Hướng Châu Phi - Mỹ',
      'Hướng Châu Á - TBD',
      'Hướng Châu Âu',
      'Hướng DNA',
    ],
    series: [
      {
        name: 'Tích cực',
        color: '#4caf50', // xanh lá
        data: [3, 2, 4, 0],
      },
      {
        name: 'Tiêu cực',
        color: '#e53935', // đỏ
        data: [4, 4, 5, 5],
      },
      {
        name: 'Trung lập',
        color: '#00bcd4', // xanh dương nhạt
        data: [4, 6, 6, 3],
      },
      {
        name: 'Cần xác minh',
        color: '#1a237e', // xanh đậm
        data: [5, 6, 4, 5],
      },
    ],
  };
  dataLeak: any[] = [
    {
      stt: 1,
      'tt lộ lọt': 'Thông tin về tài khoản',
      ngày: '15/05/2025',
      'chủ quan': 'VPCP',
    },
    {
      stt: 2,
      'tt lộ lọt': 'Thông tin về tài khoản',
      ngày: '15/05/2025',
      'chủ quan': 'Quân đội',
    },
    {
      stt: 3,
      'tt lộ lọt': 'Thông tin về tài khoản',
      ngày: '15/05/2025',
      'chủ quan': 'Khác',
    },
    {
      stt: 4,
      'tt lộ lọt': 'Thông tin về tài khoản',
      ngày: '15/05/2025',
      'chủ quan': 'Bộ, Ban',
    },
    {
      stt: 5,
      'tt lộ lọt': 'Thông tin về tài khoản',
      ngày: '15/05/2025',
      'chủ quan': 'VPCP',
    },
    {
      stt: 6,
      'tt lộ lọt': 'Thông tin về tài khoản',
      ngày: '15/05/2025',
      'chủ quan': 'VPCP',
    },
    {
      stt: 7,
      'tt lộ lọt': 'Thông tin về tài khoản',
      ngày: '15/05/2025',
      'chủ quan': 'VPCP',
    },
    {
      stt: 8,
      'tt lộ lọt': 'Thông tin về tài khoản',
      ngày: '15/05/2025',
      'chủ quan': 'VPCP',
    },
    {
      stt: 9,
      'tt lộ lọt': 'Thông tin về tài khoản',
      ngày: '15/05/2025',
      'chủ quan': 'VPCP',
    },
    {
      stt: 10,
      'tt lộ lọt': 'Thông tin về tài khoản',
      ngày: '15/05/2025',
      'chủ quan': 'VPCP',
    },
    {
      stt: 11,
      'tt lộ lọt': 'Thông tin về tài khoản',
      ngày: '15/05/2025',
      'chủ quan': 'VPCP',
    },
  ];

  constructor(
    private apiTSService: ApiTSService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const body = {
      startDate: '20250101000000',
      endDate: '20250831235959',
      p_page: 1,
      p_page_size: 1000,
    };
    this.loadData('20250101000000', '20250831235959', 1, 1000);
  }
  loadData(
    startDate: string,
    endDate: string,
    p_page: number,
    p_page_size: number,
  ) {
    const body = {
      p_start_date: startDate,
      p_end_date: endDate,
      p_page,
      p_page_size,
    };
    this.fetchHackerGroupData(startDate, endDate);
    forkJoin([
      this.apiTSService.fetchData(body),
      this.apiTSService.getDataLL(body),
    ]).subscribe({
      next: ([res1, res2]) => {
        // Lấy dữ liệu
        this.thKGM = [...this.simplifyData(res1)];

        this.dataLeak = convertToDataLeak(res2);

        this.chartConfig = convertStatsToChartConfig(res2, '320px',['48%','80%']);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Lỗi:', err);
      },
    });
  }

  simplifyData(data: any): SimplifiedItem[] {
    return data.map((item: SimplifiedItem, index: number) => ({
      stt: index + 1,
      noi_dung_day_du: item.noi_dung_day_du,
      noi_dung_rut_gon: item.noi_dung_rut_gon,
      ngay_su_kien: this.formatDate(item.ngay_su_kien),
    }));
  }
  onPopupToggled: (e: any) => {};
  onChange(event: any) {
    if (event && event.length === 2) {
      const start = dayjs(event[0]).format('YYYYMMDD') + '000000'; // Bắt đầu ngày
      const end = dayjs(event[1]).format('YYYYMMDD') + '235959'; // Cuối ngày

      this.loadData(start, end, 1, 1000);
    }
  }
  formatDate(dateStr: string): string {
    if (dateStr.length < 8) return '';
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);
    const day = dateStr.slice(6, 8);
    return `${day}/${month}/${year}`;
  }
}
