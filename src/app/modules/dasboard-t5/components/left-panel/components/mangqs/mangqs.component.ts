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
  selector: 'app-mangqs',
  templateUrl: './mangqs.component.html',
  styleUrls: ['./mangqs.component.scss'],
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
export class MangqsComponent {
  selectedOption: string = 'Radar';
  date = null;
  tableData = [
    { stt: 1, 'mã độc': 'Mustang Panda', 'số lượng': 12 },
    { stt: 2, 'mã độc': 'Redline Stealer', 'số lượng': 33 },
    { stt: 3, 'mã độc': 'DarkPink', 'số lượng': 21 },
    { stt: 4, 'mã độc': 'BlackCat', 'số lượng': 4 },
    { stt: 5, 'mã độc': 'Mustang Panda', 'số lượng': 27 },
    { stt: 6, 'mã độc': 'Redline Stealer', 'số lượng': 121 },
    { stt: 7, 'mã độc': 'DarkPink', 'số lượng': 4 },
    { stt: 8, 'mã độc': 'BlackCat', 'số lượng': 29 },
    { stt: 9, 'mã độc': 'Mustang Panda', 'số lượng': 71 },
    { stt: 10, 'mã độc': 'Redline Stealer', 'số lượng': 19 },
    { stt: 11, 'mã độc': 'DarkPink', 'số lượng': 59 },
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
    categories: ['BĐBP', 'QCHQ', 'QC PKKQ'], // label của các cột
    series: [
      {
        name: 'Máy Tính',
        data: [120, 220, 300], // 3 giá trị tương ứng với 'Thiết bị', 'Cảnh báo', 'Loại 3'
        color: 'rgb(28, 155, 83)',
      },
      {
        name: 'EDR',
        data: [132, 182, 260],
        color: 'rgb(52, 131, 251)',
      },
      {
        name: 'Định danh',
        data: [101, 191, 280],
        color: 'rgb(254, 180, 44)',
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
      { value: 100, name: 'Tên miền độc hại', itemStyle: { color: '#4CAF50' } },
      { value: 203, name: 'Mã độc', itemStyle: { color: '#FFC107' } },
      { value: 154, name: 'IP độc hại', itemStyle: { color: '#F44336' } },
      {
        value: 183,
        name: 'Vi phạm chính sách',
        itemStyle: { color: '#9E9E9E' },
      },
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
}
