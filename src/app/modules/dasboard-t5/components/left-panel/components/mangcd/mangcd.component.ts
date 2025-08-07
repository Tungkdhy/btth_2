import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { TablePtmComponent } from '../../../shared/table-ptm/table-ptm.component';
import { StackChart } from '../../../shared/stack-chart/stack-chart.component';
import { PieChartComponent } from '../../../shared/pie-chart/pie-chart.component';
import { PipeChartConfig } from '../../../shared/pie-chart/pipe-chart.config';
import { StackChartConfig } from '../../../shared/stack-chart/stack-chart.config';
import { StackChartHori } from '../mangqs/stack-chart-hori/stack-chart-hori.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { HeaderChartComponent } from '../../../shared/header-chart/header-chart.component';
import { FormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import dayjs from 'dayjs';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-mangcd',
  templateUrl: './mangcd.component.html',
  styleUrls: ['./mangcd.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    NzRadioModule,
    FormsModule,
    TablePtmComponent,
    StackChartHori,
    NzDatePickerModule,
    StackChart,
    PieChartComponent,
    HeaderChartComponent,
  ],
})
export class MangcdComponent {
  titleQH = { total_alerts: 0, total_devices: 0 };
  titleCP = { total_alerts: 0, total_devices: 0 };
  titleHT_QH = { total_managed_devices: 0, total_all_devices: 0 };
  titleHT_CP = { total_managed_devices: 0, total_all_devices: 0 };

  constructor(private cdr: ChangeDetectorRef) {}
  selectedOption: string = 'Radar';
  http = inject(HttpClient);
  headers = new HttpHeaders({
    apiKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE', // 🔐 Thay YOUR_API_KEY_HERE bằng key thật
  });
  date = [dayjs().subtract(7, 'day').toDate(), dayjs().toDate()];
  onChange(result: Date[]): void {
    if (result && result.length === 2) {
      const start = formatDate(result[0], 'yyyyMMddHHmmss', 'en-US');
      const end = formatDate(result[1], 'yyyyMMddHHmmss', 'en-US');
      this.fetchInfrastructureData(start, end);
      this.fetchCbatttData(start, end);
      this.fetchSuCoATTT(start, end);
    }
  }
  fetchInfrastructureData(start: string, end: string) {
    const body = {
      p_start_date: start,
      p_end_date: end,
      p_source: 'VPQH',
    };

    const bodyCP = {
      p_start_date: start,
      p_end_date: end,
      p_source: 'VPCP',
    };
    this.http
      .post<any>(
        'http://10.10.53.58:8002/rest/v1/rpc/mang_cd_ha_tang_cntt',
        body,
        {
          headers: this.headers,
        },
      )
      .subscribe((res) => {
        const details = res?.data?.device_types_detail || [];
        this.titleHT_QH = {
          total_managed_devices: res?.data?.summary.total_managed_devices,
          total_all_devices: res?.data?.summary.total_all_devices,
        };
        // 🎯 Các thiết bị cần hiển thị

        const top3Types = [...details]
          .sort((a, b) => b.total_devices - a.total_devices) // sắp xếp giảm dần theo total_devices
          .slice(0, 3) // lấy 3 phần tử đầu tiên
          .map((item) => item.device_type); // lấy ra tên device_type

        const targetTypes = top3Types;

        const typeMap = new Map(
          details.map((item: any) => [item.device_type, item]),
        );

        const categories = targetTypes;

        const managedDevices = categories.map(
          // @ts-ignore
          (type) => typeMap.get(type)?.total_managed_devices || 0,
        );

        const totalDevices = categories.map(
          // @ts-ignore
          (type) => typeMap.get(type)?.total_devices || 0,
        );

        this.stackChartConfig = {
          title: 'Biểu đồ khai thác',
          categories,
          series: [
            {
              name: 'Thiết bị quản lý',
              data: managedDevices,
              color: 'rgb(28, 155, 83)',
            },
            {
              name: 'Tổng số thiết bị',
              data: totalDevices,
              color: 'rgb(52, 131, 251)',
            },
          ],
          height: '660px',
          isStacked: false,
        };

        this.cdr.detectChanges();
      });
    this.http
      .post<any>(
        'http://10.10.53.58:8002/rest/v1/rpc/mang_cd_ha_tang_cntt',
        bodyCP,
        {
          headers: this.headers,
        },
      )
      .subscribe((res) => {
        const details = res?.data?.device_types_detail || [];
            this.titleHT_CP = {
              total_managed_devices: res?.data?.summary.total_managed_devices,
              total_all_devices: res?.data?.summary.total_all_devices,
            };
        const top3Types = [...details]
          .sort((a, b) => b.total_devices - a.total_devices) // sắp xếp giảm dần theo total_devices
          .slice(0, 3) // lấy 3 phần tử đầu tiên
          .map((item) => item.device_type); // lấy ra tên device_type

        const targetTypes = top3Types;
        const typeMap = new Map(
          details.map((item: any) => [item.device_type, item]),
        );

        const categories = targetTypes;

        const managedDevices = categories.map(
          // @ts-ignore
          (type) => typeMap.get(type)?.total_managed_devices || 0,
        );

        const totalDevices = categories.map(
          // @ts-ignore
          (type) => typeMap.get(type)?.total_devices || 0,
        );

        this.stackChartConfigCP = {
          title: 'Biểu đồ khai thác',
          categories,
          series: [
            {
              name: 'Thiết bị quản lý',
              data: managedDevices,
              color: 'rgb(28, 155, 83)',
            },
            {
              name: 'Tổng số thiết bị',
              data: totalDevices,
              color: 'rgb(52, 131, 251)',
            },
          ],
          height: '660px',
          isStacked: false,
        };

        this.cdr.detectChanges();
      });
  }
  fetchCbatttData(start: string, end: string) {
    const body = {
      p_start_date: start,
      p_end_date: end,
      p_source: 'VPQH',
    };
    const bodyCP = {
      p_start_date: start,
      p_end_date: end,
      p_source: 'VPCP',
    };

    this.http
      .post<any>('http://10.10.53.58:8002/rest/v1/rpc/mang_cd_cbattt', body, {
        headers: this.headers,
      })
      .subscribe((res) => {
        const details = res?.data?.severity_detail || [];
        this.titleQH = {
          total_alerts: res?.data?.summary.total_alerts,
          total_devices: res?.data?.summary.total_devices,
        };
        const severityLabelMap: Record<string, string> = {
          High: 'Cao',
          Medium: 'Trung bình',
          Low: 'Thấp',
        };

        const colorMap: Record<string, string> = {
          High: '#F44336', // đỏ
          Medium: '#FFC107', // vàng
          Low: '#4CAF50', // xanh lá
        };
        // @ts-ignore
        const chartData = details.map((item) => ({
          value: item.total_alerts,
          name: severityLabelMap[item.severity] || item.severity,
          itemStyle: { color: colorMap[item.severity] || '#BDBDBD' },
        }));

        this.chartConfig = {
          data: chartData,
          title: '',
          // @ts-ignore
          colors: chartData.map((d) => d.itemStyle.color),
          legendPosition: 'bottom',
          radius: ['35%', '60%'],
          showLabelInside: false,
          height: '660px',
          legend: true,
        };

        this.cdr.detectChanges();
      });
    this.http
      .post<any>('http://10.10.53.58:8002/rest/v1/rpc/mang_cd_cbattt', bodyCP, {
        headers: this.headers,
      })
      .subscribe((res) => {
        const details = res?.data?.severity_detail || [];
        this.titleCP = {
          total_alerts: res?.data?.summary.total_alerts,
          total_devices: res?.data?.summary.total_devices,
        };
        const severityLabelMap: Record<string, string> = {
          High: 'Cao',
          Medium: 'Trung bình',
          Low: 'Thấp',
        };

        const colorMap: Record<string, string> = {
          High: '#F44336', // đỏ
          Medium: '#FFC107', // vàng
          Low: '#4CAF50', // xanh lá
        };
        // @ts-ignore
        const chartData = details.map((item) => ({
          value: item.total_alerts,
          name: severityLabelMap[item.severity] || item.severity,
          itemStyle: { color: colorMap[item.severity] || '#BDBDBD' },
        }));

        this.chartConfigCP = {
          data: chartData,
          title: '',
          // @ts-ignore
          colors: chartData.map((d) => d.itemStyle.color),
          legendPosition: 'bottom',
          radius: ['35%', '60%'],
          showLabelInside: false,
          height: '660px',
          legend: true,
        };

        this.cdr.detectChanges();
      });
  }
  convertSeverity(severity: string): string {
    const map: Record<string, string> = {
      Critical: 'Cao',
      High: 'Cao',
      Medium: 'Trung bình',
      Low: 'Thấp',
    };
    return map[severity] || severity;
  }
  fetchSuCoATTT(start: string, end: string) {
    const body = {
      p_start_date: start,
      p_end_date: end,
      p_source: 'VPQH',
    };
    const bodyCP = {
      p_start_date: start,
      p_end_date: end,
      p_source: 'VPCP',
    };

    this.http
      .post<any>(
        'http://10.10.53.58:8002/rest/v1/rpc/mang_cd_su_co_attt',
        body,
        {
          headers: this.headers,
        },
      )
      .subscribe((res) => {
        const detail = res?.data?.device_incidents_detail || [];

        const tableData = detail.map((item: any, index: number) => ({
          stt: index + 1,
          'mac nguồn': item.source_mac,
          'ip nguồn': item.source_ip,
          'ip đích': item.destination_ip,
          'số lượng': item.total_incidents,
          'cảnh báo': item.latest_description,
          'thời gian': item.latest_incident_time,
          'mức độ': this.convertSeverity(item.most_common_severity),
        }));
        this.tableData = tableData;
        this.cdr.detectChanges();
      });
    this.http
      .post<any>(
        'http://10.10.53.58:8002/rest/v1/rpc/mang_cd_su_co_attt',
        bodyCP,
        {
          headers: this.headers,
        },
      )
      .subscribe((res) => {
        const detail = res?.data?.device_incidents_detail || [];

        const tableData = detail.map((item: any, index: number) => ({
          stt: index + 1,
          'mac nguồn': item.source_mac,
          'ip nguồn': item.source_ip,
          'ip đích': item.destination_ip,
          'số lượng': item.total_incidents,
          'cảnh báo': item.latest_description,
          'thời gian': item.latest_incident_time,
          'mức độ': this.convertSeverity(item.most_common_severity),
        }));

        this.tableDataCP = tableData;
        this.cdr.detectChanges();
      });
  }

  tableData = [];
  tableDataCP = [];
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
    categories: ['Thiết bị mạng', 'Máy tính', 'Máy chủ', 'Ứng dụng'], // label của các cột
    series: [
      {
        name: 'Thiết bị quản lý',
        data: [120, 220, 300, 100], // 3 giá trị tương ứng với 'Thiết bị', 'Cảnh báo', 'Loại 3'
        color: 'rgb(28, 155, 83)',
      },
      {
        name: 'Tổng số thiết bị',
        data: [132, 300, 320, 400],
        color: 'rgb(52, 131, 251)',
      },
    ],
    height: '660px',
    isStacked: false, // tắt stacked
  };
  stackChartConfigCP = {
    title: 'Biểu đồ khai thác',
    categories: ['Thiết bị mạng', 'Máy tính', 'Máy chủ', 'Ứng dụng'], // label của các cột
    series: [
      {
        name: 'Thiết bị quản lý',
        data: [120, 220, 300, 100], // 3 giá trị tương ứng với 'Thiết bị', 'Cảnh báo', 'Loại 3'
        color: 'rgb(28, 155, 83)',
      },
      {
        name: 'Tổng số thiết bị',
        data: [132, 300, 320, 400],
        color: 'rgb(52, 131, 251)',
      },
    ],
    height: '660px',
    isStacked: false, // tắt stacked
  };

  stackChartConfig2 = {
    title: 'Biểu đồ khai thác',
    categories: ['22', '3389', '80', '443', '27017'],
    series: [
      {
        name: 'Số thiết bị đăng ký',
        data: [120, 132, 101, 100, 89],
        color: 'rgb(28, 155, 83)',
      },
      {
        name: 'Số thiết bị mới mở cổng',
        data: [220, 182, 191, 159, 170],
        color: 'rgb(239, 62, 46)',
      },
    ],
    height: '660px',
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
      { value: 100, name: 'Thấp', itemStyle: { color: '#4CAF50' } },
      { value: 203, name: 'Trung bình', itemStyle: { color: '#FFC107' } },
      { value: 154, name: 'Cao', itemStyle: { color: '#F44336' } },
    ],
    title: '',
    colors: ['#ff4d4f', '#40a9ff', '#73d13d'],
    legendPosition: 'bottom',
    radius: ['35%', '60%'],
    showLabelInside: false,
    height: '660px',
    legend: true,
  };
  chartConfigCP: PipeChartConfig = {
    data: [
      { value: 100, name: 'Thấp', itemStyle: { color: '#4CAF50' } },
      { value: 203, name: 'Trung bình', itemStyle: { color: '#FFC107' } },
      { value: 154, name: 'Cao', itemStyle: { color: '#F44336' } },
    ],
    title: '',
    colors: ['#ff4d4f', '#40a9ff', '#73d13d'],
    legendPosition: 'bottom',
    radius: ['35%', '60%'],
    showLabelInside: false,
    height: '660px',
    legend: true,
  };
  stackChartHoriPOC = {
    title: 'Phạm vi săn tìm',
    categories: ['BDBP', 'QC HQ', 'QC PKKQ'],
    series: [
      {
        name: 'Máy tính',
        type: 'bar',
        // stack: 'Tổng',
        data: [48, 48, 48],
        color: 'rgba(35, 166, 94, 1)', // màu xanh lá
      },
      {
        name: 'EDR',
        type: 'bar',
        // stack: 'Tổng',
        data: [9, 9, 9],
        color: 'rgba(51, 126, 255, 1)', // màu xanh dương
      },
      {
        name: 'Định danh',
        type: 'bar',
        data: [30, 33, 28],
        color: 'rgba(251, 171, 0, 1)', // màu vàng cam
      },
    ],
    height: '660px',
    tooltipFormatter: (params: any) => {
      console.log(params);

      const param = params;
      return `${param.name}`;
    },
    legendFormatter: (name: string) => {
      const item = this.stackChartHoriPort.series.find(
        (s: any) => s.name === name,
      );
      return name;
    },
    isStacked: false,
  };
  stackChartHoriPort = {
    title: 'Phạm vi săn tìm',
    categories: ['21', '22', '23', '80', '443', '3389', '8080', '27017'],
    series: [
      {
        name: 'Số thiết bị đăng ký',
        type: 'bar',
        stack: 'Tổng',
        data: [48, 48, 40, 48, 50, 48, 52, 48],
        color: 'rgba(35, 166, 94, 1)', // màu xanh lá
      },
      {
        name: 'Số thiết bị mở cổng mới',
        type: 'bar',
        stack: 'Tổng',
        data: [9, 13, 12, 9, 10, 9, 7, 15],
        color: 'rgba(210, 0, 26, 1)', // màu xanh dương
      },
    ],
    height: '660px',
    tooltipFormatter: (params: any) => {
      console.log(params);

      const param = params;
      return `${param.name}`;
    },
    legendFormatter: (name: string) => {
      const item = this.stackChartHoriPort.series.find(
        (s: any) => s.name === name,
      );
      return name;
    },
    isStacked: false,
  };
  nonStackChartConfig: StackChartConfig = {
    title: 'Dấu hiệu tấn công theo chiến - kỹ thuật',
    height: '660px',
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
  malwareData: any[] = [
    {
      stt: 1,
      'thông tin lộ lọt': 'Thông tin về tài khoản',
      ngày: '15/05/2025',
      'chủ quan': 'VPCP',
    },
    {
      stt: 2,
      'thông tin lộ lọt': 'Thông tin về tài khoản',
      ngày: '15/05/2025',
      'chủ quan': 'Quân đội',
    },
    {
      stt: 3,
      'thông tin lộ lọt': 'Thông tin về tài khoản',
      ngày: '15/05/2025',
      'chủ quan': 'Khác',
    },
    {
      stt: 4,
      'thông tin lộ lọt': 'Thông tin về tài khoản',
      ngày: '15/05/2025',
      'chủ quan': 'Bộ, Ban',
    },
    {
      stt: 5,
      'thông tin lộ lọt': 'Thông tin về tài khoản',
      ngày: '15/05/2025',
      'chủ quan': 'VPCP',
    },
    {
      stt: 6,
      'thông tin lộ lọt': 'Thông tin về tài khoản',
      ngày: '15/05/2025',
      'chủ quan': 'VPCP',
    },
    {
      stt: 7,
      'thông tin lộ lọt': 'Thông tin về tài khoản',
      ngày: '15/05/2025',
      'chủ quan': 'VPCP',
    },
  ];
  getLevelOnly(name: string): string {
    const parts = name.split(' '); // Tách theo dấu cách
    return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : name;
  }

  countByLevel(level: string): number {
    return this.tableData.filter((item) => item['mức độ'] === level).length;
  }

  countByLevelCP(level: string): number {
    return this.tableDataCP.filter((item) => item['mức độ'] === level).length;
  }
  ngOnInit(): void {
    const start = formatDate(this.date[0], 'yyyyMMddHHmmss', 'en-US');
    const end = formatDate(this.date[1], 'yyyyMMddHHmmss', 'en-US');
    this.fetchInfrastructureData(start, end);
    this.fetchCbatttData(start, end);
    this.fetchSuCoATTT(start, end);
  }
}
