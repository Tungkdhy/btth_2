import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { TablePtmComponent } from '../../../shared/table-ptm/table-ptm.component';
import { CommonModule } from '@angular/common';
import { StackChart } from '../../../shared/stack-chart/stack-chart.component';
import { PieChartComponent } from '../../../shared/pie-chart/pie-chart.component';
import { PipeChartConfig } from '../../../shared/pie-chart/pipe-chart.config';
import { StackChartConfig } from '../../../shared/stack-chart/stack-chart.config';
import { StackChartHori } from '../../../shared/stack-chart-hori/stack-chart-hori.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';

import { HeaderChartComponent } from '../../../shared/header-chart/header-chart.component';
import dayjs from 'dayjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-ptm',
  templateUrl: './ptm.component.html',
  styleUrls: ['./ptm.component.scss'],
  standalone: true,
  imports: [
    TablePtmComponent,
    FormsModule,
    NzDatePickerModule,
    StackChartHori,
    StackChart,
    PieChartComponent,
    HeaderChartComponent,
    CommonModule,
  ],
})
export class PtmComponent {
  constructor(private cdr: ChangeDetectorRef) {}
  http = inject(HttpClient);
  headers = new HttpHeaders({
    apiKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE', // 🔐 Thay YOUR_API_KEY_HERE bằng key thật
  });
  // attSummary;
  fetchPvstData(start: string, end: string) {
    const body = {
      start_date: start,
      end_date: end,
    };

    this.http
      .post<any>(
        `http://10.10.53.58:8002/rest/v1/rpc/mang_internet_pvst`,
        body,
        {
          headers: this.headers,
        },
      )
      .subscribe((res) => {
        const summary = res?.data?.summary || {};
        this.data = [
          { label: 'Thiết bị', value: summary.total_devices || 0 },
          { label: 'Máy tính', value: summary.total_computers || 0 },
          { label: 'EDR', value: summary.total_edr || 0 },
          { label: 'Định danh', value: summary.total_identified || 0 },
        ];
        const units = res?.data?.units_summary || [];

        const categories = units.map((unit: any) => unit.unit_id);
        const deviceData = units.map((unit: any) => unit.device_count);
        const eventData = units.map((unit: any) => unit.event_count);

        this.stackChartConfig = {
          title: 'Biểu đồ khai thác',
          categories: categories.splice(0, 10),
          series: [
            {
              name: 'Thiết bị',
              data: deviceData,
              color: '#128040ff',
            },
            {
              name: 'Cảnh báo',
              data: eventData,
              color: '#E74C3C',
            },
          ],
          height: '360px',
          tooltipFormatter: (params: any) => {
            const param = params;
            return `${param.name}: ${param.value} mục tiêu ${this.getLevelOnly(
              param.seriesName ?? '',
            )}`;
          },
          isStacked: true,
        };

        this.cdr.detectChanges();
      });
  }
  fetchCBMATTData(start: string, end: string) {
    const body = {
      start_date: start,
      end_date: end,
    };

    this.http
      .post<any>(
        `http://10.10.53.58:8002/rest/v1/rpc/mang_internet_cbmattt`,
        body,
        {
          headers: this.headers,
        },
      )
      .subscribe((res) => {
        const alertSummary = res?.data?.alert_types_summary || [];

        // Sắp xếp giảm dần theo event_count và lấy top 4
        const topAlerts = [...alertSummary]
          .sort((a, b) => b.event_count - a.event_count)
          .slice(0, 4);

        // Danh sách màu tùy chọn (nếu muốn thay đổi)
        const colors = ['#1C9B53', '#3483FB', '#FEB42C', '#EF3E2E'];

        // Map vào biểu đồ tròn
        this.chartConfig = {
          data: topAlerts.map((item, index) => ({
            value: item.percentage,
            name: item.alert_type,
            itemStyle: { color: colors[index % colors.length] },
          })),
          title: '',
          colors,
          legendPosition: 'left',
          radius: ['30%', '50%'],
          showLabelInside: false,
          height: '480px',
          legend: true,
        };

        this.cdr.detectChanges(); // nếu cần cập nhật thủ công
      });
  }
  fetchMitreData(start: string, end: string) {
    const body = {
      start_date: start,
      end_date: end,
    };

    this.http
      .post<any>(
        `http://10.10.53.58:8002/rest/v1/rpc/mang_internet_dhtc`,
        body,
        {
          headers: this.headers,
        },
      )
      .subscribe((res) => {
        const mitreData = res?.data?.mitre_tactics_summary || [];

        // Sắp xếp theo thứ tự tactic cụ thể nếu muốn
        const predefinedCategories = [
          'Initial Access',
          'Execution',
          'Persistence',
          'Privilege Escalation',
          'Defense Evasion',
          'Credential Access',
          'Discovery',
          'Lateral Movement',
          'Collection',
          'Exfiltration',
          'Command and Control',
          'Impact',
        ];

        // Tạo map để lấy nhanh event_count theo tactic
        const tacticMap = new Map(
          mitreData.map((item: any) => [item.mitre_tactic, item.event_count]),
        );

        // Map vào cấu hình biểu đồ
        const dataSeries = predefinedCategories.map(
          (cat) => tacticMap.get(cat) || 0,
        );

        this.nonStackChartConfig = {
          ...this.nonStackChartConfig,
          categories: predefinedCategories,
          series: [
            {
              // @ts-ignore
              data: dataSeries,
              itemStyle: {
                color: (params: any) => {
                  const colorList = [
                    '#86efac',
                    '#fde047',
                    '#fb923c',
                    '#f43f5e',
                    '#e11d48',
                    '#d946ef',
                    '#a78bfa',
                    '#818cf8',
                    '#60a5fa',
                    '#38bdf8',
                    '#17d2f4',
                    '#DC143C',
                  ];
                  return colorList[params.dataIndex];
                },
              },
            },
          ],
        };

        this.cdr.detectChanges(); // Nếu cần cập nhật view
      });
  }

  date: Date[] = [
    new Date(2025, 0, 31), // tháng 1
    new Date(2025, 7, 31), // tháng 8
  ];
  data = [
    { label: 'Thiết bị', value: 12000 },
    { label: 'Máy tính', value: 14000 },
    { label: 'EDR', value: 1500 },
    { label: 'Định danh', value: 22000 },
  ];

  tableData = [
    {
      website: 'quanlyvanban.bqp',
      'thời gian': '01/05/2025 12:00:45',
      'trạng thái': 'Mất kết nối',
    },
    {
      website: 'htt2.bt186.bqp',
      'thời gian': '03/05/2025 15:10:46',
      'trạng thái': 'Hoạt động',
    },
    {
      website: 'mail.bqp',
      'thời gian': '04/05/2025 16:20:05',
      'trạng thái': 'Theo dõi',
    },
    {
      website: 'quanlyvanban.bqp',
      'thời gian': '01/05/2025 12:00:45',
      'trạng thái': 'Mất kết nối',
    },
    {
      website: 'htt2.bt186.bqp',
      'thời gian': '03/05/2025 15:10:46',
      'trạng thái': 'Bình thường',
    },
    {
      website: 'mail.bqp',
      'thời gian': '04/05/2025 16:20:05',
      'trạng thái': 'Theo dõi',
    },
    {
      website: 'quanlyvanban.bqp',
      'thời gian': '01/05/2025 12:00:45',
      'trạng thái': 'Mất kết nối',
    },
    {
      website: 'htt2.bt186.bqp',
      'thời gian': '03/05/2025 15:10:46',
      'trạng thái': 'Bình thường',
    },
    {
      website: 'mail.bqp',
      'thời gian': '04/05/2025 16:20:05',
      'trạng thái': 'Theo dõi',
    },
    {
      website: 'quanlyvanban.bqp',
      'thời gian': '01/05/2025 12:00:45',
      'trạng thái': 'Mất kết nối',
    },
    {
      website: 'htt2.bt186.bqp',
      'thời gian': '03/05/2025 15:10:46',
      'trạng thái': 'Bình thường',
    },
    {
      website: 'mail.bqp',
      'thời gian': '04/05/2025 16:20:05',
      'trạng thái': 'Theo dõi',
    },
    {
      website: 'quanlyvanban.bqp',
      'thời gian': '01/05/2025 12:00:45',
      'trạng thái': 'Mất kết nối',
    },
    {
      website: 'htt2.bt186.bqp',
      'thời gian': '03/05/2025 15:10:46',
      'trạng thái': 'Bình thường',
    },
    {
      website: 'mail.bqp',
      'thời gian': '04/05/2025 16:20:05',
      'trạng thái': 'Theo dõi',
    },
    {
      website: 'quanlyvanban.bqp',
      'thời gian': '01/05/2025 12:00:45',
      'trạng thái': 'Mất kết nối',
    },
  ];

  tableDataHunting = [
    { 'kết nối bất thường': '86.36.123.10:4444', bytes: '1234' },
    { 'kết nối bất thường': '86.36.123.10:8080', bytes: '120' },
    { 'kết nối bất thường': '86.36.123.10:8000', bytes: '80' },
    { 'kết nối bất thường': '10.36.123.10:9000', bytes: '123' },
    { 'kết nối bất thường': '88.36.123.10:4444', bytes: '444' },
    { 'kết nối bất thường': '86.36.123.10:4444', bytes: '90' },
    { 'kết nối bất thường': '86.36.123.10:4444', bytes: '80' },
    { 'kết nối bất thường': '86.36.123.10:4444', bytes: '100' },
    // { website: 'qpvn.vn', time: '03/03/2025 15:10:46' },
    // { website: 'baoquankhu9.vn', time: '04/03/2025 16:20:05' },
    // { website: 'vannghequandoi.com.vn', time: '05/03/2025 16:20:05' }
  ];
  tableDataFlow = [
    { network: '86.36.123.10:4444', bytes: '1234' },
    { network: '86.36.123.10:8080', bytes: '120' },
    { network: '86.36.123.10:8000', bytes: '80' },
  ];
  tableDataMalware = [
    { case: 'Mã độc MF', value: '20' },
    { case: 'Mã độc APT', value: '120' },
    // { connect: '86.36.123.10:8000', bytes: '80' },
  ];
  stackChartConfig = {
    title: 'Biểu đồ khai thác',
    categories: [
      'QK5',
      'QK2',
      'CNQP',
      'BĐBP',
      'PKKQ',
      'QCHQ',
      'QK7',
      'TTLL',
      'TCCT',
    ],
    series: [
      {
        name: 'Thiết bị',
        data: [120, 132, 101, 90, 102, 105, 60, 77, 38],
        color: '#128040ff',
      },
      {
        name: 'Cảnh báo',
        data: [220, 182, 191, 200, 187, 210, 199, 190, 180],
        color: '#E74C3C',
      },
    ],
    height: '360px',
    tooltipFormatter: (params: any) => {
      const param = params;
      return `${param.name}: ${param.value} mục tiêu ${this.getLevelOnly(
        param.seriesName ?? '',
      )}`;
    },
    isStacked: true,
  };
  stackChartConfig2 = {
    title: 'Biểu đồ khai thác',
    categories: ['22', '3389', '80', '443', '27017'],
    series: [
      {
        name: 'Số máy',
        data: [120, 132, 101, 100, 89],
        color: 'rgba(28, 155, 83, 1)',
      },
      {
        name: 'Mới',
        data: [220, 182, 191, 159, 170],
        color: 'rgba(52, 131, 251, 1)',
      },
    ],
    height: '360px',
    tooltipFormatter: (params: any) => {
      const param = params;
      return `${param.name}: ${param.value} mục tiêu ${this.getLevelOnly(
        param.seriesName ?? '',
      )}`;
    },
    isStacked: true,
  };
  chartConfig: PipeChartConfig = {
    data: [
      { value: 41.7, name: 'File', itemStyle: { color: '#1C9B53' } },
      { value: 29.2, name: 'Socket', itemStyle: { color: '#3483FB' } },
      { value: 12.8, name: 'Registry', itemStyle: { color: '#FEB42C' } },
      { value: 14.7, name: 'HTTP', itemStyle: { color: '#EF3E2E' } },
      { value: 4, name: 'Flow', itemStyle: { color: '#898d8f' } },
    ],
    title: '',
    colors: ['#ff4d4f', '#40a9ff', '#73d13d'],
    legendPosition: 'left',
    radius: ['30%', '50%'],
    showLabelInside: false,
    height: '480px',
    legend: true,
  };
  stackChartConfigRedfox = {
    title: 'Biểu đồ khai thác',
    categories: ['Thiết bị', 'NDR', 'EDR'],
    series: [
      { name: 'Online', data: [120, 132, 101], color: 'rgba(28, 155, 83, 1)' },
      {
        name: 'Offline',
        data: [220, 182, 191],
        color: 'rgba(52, 131, 251, 1)',
      },
    ],
    height: '230px',
    tooltipFormatter: (params: any) => {
      const param = params;
      return `${param.name}: ${param.value} mục tiêu ${this.getLevelOnly(
        param.seriesName ?? '',
      )}`;
    },
    isStacked: true,
  };
  nonStackChartConfig: StackChartConfig = {
    title: 'Dấu hiệu tấn công theo chiến - kỹ thuật',
    height: '480px',
    isStacked: false,
    isShowLabel: false,
    categories: [
      'Initial Access',
      'Execution',
      'Persistence',
      'Privilege Escalation',
      'Defense Evasion',
      'Credential Access',
      'Discovery',
      'Lateral Movement',
      'Collection',
      'Exfiltration',
      'Command and Control',
      'Impact',
    ],
    series: [
      {
        // name: 'Mức 1',
        data: [11, 12, 4, 13, 1, 4, 10, 9, 8, 7, 6, 5],
        itemStyle: {
          color: function (params: any) {
            const colorList = [
              '#86efac', // TAW
              '#fde047', // BRN
              '#fb923c', // K
              '#f43f5e', // IND
              '#e11d48', // MAI
              '#d946ef', // MAI
              '#a78bfa', // MAI
              '#818cf8', // MAI
              '#60a5fa', // MAI
              '#38bdf8', // MAI
              '#17d2f4', // MAI
              '#DC143C', // H
            ];
            return colorList[params.dataIndex];
          },
        },
      },
    ],
  };
  getLevelOnly(name: string): string {
    const parts = name.split(' '); // Tách theo dấu cách
    return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : name;
  }
  onChange(event: Date[]): void {
    if (event && event.length === 2) {
      const start = dayjs(event[0]).format('YYYYMMDD') + '000000'; // Bắt đầu ngày
      const end = dayjs(event[1]).format('YYYYMMDD') + '235959'; // Cuối ngày
      this.fetchPvstData('2024-08-01T00:00:00', '2025-08-05T23:59:59');
      // this.loadData(start, end);
    }
  }
  ngOnInit(): void {
    this.fetchPvstData('2024-08-01T00:00:00', '2025-08-05T23:59:59');
    this.fetchCBMATTData('2024-08-01T00:00:00', '2025-08-05T23:59:59');
    this.fetchMitreData('2024-08-01T00:00:00', '2025-08-05T23:59:59');
  }
}
