import { Component } from '@angular/core';
import { TablePtmComponent } from '../../../shared/table-ptm/table-ptm.component';
import { StackChart } from '../../../shared/stack-chart/stack-chart.component';
import { PieChartComponent } from '../../../shared/pie-chart/pie-chart.component';
import { PipeChartConfig } from '../../../shared/pie-chart/pipe-chart.config';
import { StackChartConfig } from '../../../shared/stack-chart/stack-chart.config';
import { StackChartHori } from '../../../shared/stack-chart-hori/stack-chart-hori.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { HeaderChartComponent } from '../../../shared/header-chart/header-chart.component';
import { FormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
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
  selectedOption: string = 'Radar';
  date = null;
  tableData = [
    {
      stt: 1,
      'mac nguồn': '48:91:D5:E7:05:D0',
      'ip nguồn': '159.223.162.113',
      'ip đích': '172.16.22.58',
      'số lượng': 5,
      'cảnh báo': 'ET DROP Spamhaus DROP Listed Traffic Inbound group 14',
      'thời gian': '07/7/2025',
      'mức độ': 'Cao',
    },
    {
      stt: 2,
      'mac nguồn': '48:91:D5:E7:05:D0',
      'ip nguồn': '122.8.186.87',
      'ip đích': '172.16.22.36',
      'số lượng': 2,
      'cảnh báo': 'ET DROP Spamhaus DROP Listed Traffic Inbound group 9',
      'thời gian': '07/7/2025',
      'mức độ': 'Cao',
    },
    {
      stt: 3,
      'mac nguồn': '48:91:D5:D9:59:10',
      'ip nguồn': '192.168.100.23',
      'ip đích': '111.10.0.32',
      'số lượng': 3,
      'cảnh báo': 'GPL RPC xdmcp info query',
      'thời gian': '07/7/2025',
      'mức độ': 'Trung bình',
    },
    {
      stt: 4,
      'mac nguồn': '48:91:D5:E7:05:D0',
      'ip nguồn': '36.93.154.207',
      'ip đích': '172.16.22.50',
      'số lượng': 4,
      'cảnh báo': 'ET DROP Spamhaus DROP Listed Traffic Inbound group 1',
      'thời gian': '07/7/2025',
      'mức độ': 'Thấp',
    },
    {
      stt: 5,
      'mac nguồn': '48:91:D5:E7:05:D0',
      'ip nguồn': '104.164.104.45',
      'ip đích': '172.16.22.42',
      'số lượng': 4,
      'cảnh báo':
        'ET DOS Possible NTP DDoS Inbound Frequent Un-Authed MON_LIST Request',
      'thời gian': '07/7/2025',
      'mức độ': 'Cao',
    },
    {
      stt: 6,
      'mac nguồn': 'D0:DC:2C:70:41:FF',
      'ip nguồn': '83.222.191.166',
      'ip đích': '10.22.72.102',
      'số lượng': 7,
      'cảnh báo':
        'MITRE-Discovery-Network Service Scanning: ET SCAN Potential VNC Scan 5500-5600',
      'thời gian': '07/7/2025',
      'mức độ': 'Cao',
    },
    {
      stt: 7,
      'mac nguồn': '00:09:0D:00:09:1A',
      'ip nguồn': '80.82.16.100',
      'ip đích': '172.16.105.166',
      'số lượng': 2,
      'cảnh báo': 'ET Drop Dshield Block Listed Source group 1',
      'thời gian': '07/7/2025',
      'mức độ': 'Trung bình',
    },
    {
      stt: 8,
      'mac nguồn': '48:91:D5:E7:05:D0',
      'ip nguồn': '80.82.77.144',
      'ip đích': '172.16.22.201',
      'số lượng': 1,
      'cảnh báo': 'GPL RPC xdmcp info query',
      'thời gian': '07/7/2025',
      'mức độ': 'Thấp',
    },
    {
      stt: 9,
      'mac nguồn': '48:91:D5:E7:1B:2C',
      'ip nguồn': '80.82.77.144',
      'ip đích': '172.16.22.203',
      'số lượng': 3,
      'cảnh báo': 'ET DROP Dshield Block Listed Source group 1',
      'thời gian': '07/7/2025',
      'mức độ': 'Trung bình',
    },
    {
      stt: 10,
      'mac nguồn': '50:91:D5:E7:05:56',
      'ip nguồn': '128.82.224.100',
      'ip đích': '172.16.22.172',
      'số lượng': 2,
      'cảnh báo':
        'ET DOS Possible NTP DDoS Inbound Frequent Un-Authed MON_LIST Request',
      'thời gian': '07/7/2025',
      'mức độ': 'Thấp',
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
  onChange(result: Date[]): void {
    console.log('onChange: ', result);
  }
  countByLevel(level: string): number {
    return this.tableData.filter((item) => item['mức độ'] === level).length;
  }
}
