import { Component } from '@angular/core';
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
@Component({
  selector: 'app-ptm',
  templateUrl: './ptm.component.html',
  styleUrls: ['./ptm.component.scss'],
  standalone: true,
  imports: [TablePtmComponent,FormsModule,NzDatePickerModule,StackChartHori, StackChart, PieChartComponent, HeaderChartComponent,CommonModule],
})
export class PtmComponent {
    date = null
    data = [
    { label: 'Thiết bị', value: 12000 },
    { label: 'Máy tính', value: 14000 },
    { label: 'EDR', value: 1500 },
    { label: 'Định danh', value: 22000 },
  ];

  tableData = [
    { website: 'quanlyvanban.bqp', 'thời gian': '01/05/2025 12:00:45', 'trạng thái': "Mất kết nối" },
    { website: 'htt2.bt186.bqp', 'thời gian': '03/05/2025 15:10:46', 'trạng thái': "Hoạt động" },
    { website: 'mail.bqp', 'thời gian': '04/05/2025 16:20:05', 'trạng thái': "Theo dõi" },
    { website: 'quanlyvanban.bqp', 'thời gian': '01/05/2025 12:00:45', 'trạng thái': "Mất kết nối" },
    { website: 'htt2.bt186.bqp', 'thời gian': '03/05/2025 15:10:46', 'trạng thái': "Bình thường" },
    { website: 'mail.bqp', 'thời gian': '04/05/2025 16:20:05', 'trạng thái': "Theo dõi" },
    { website: 'quanlyvanban.bqp', 'thời gian': '01/05/2025 12:00:45', 'trạng thái': "Mất kết nối" },
    { website: 'htt2.bt186.bqp', 'thời gian': '03/05/2025 15:10:46', 'trạng thái': "Bình thường" },
    { website: 'mail.bqp', 'thời gian': '04/05/2025 16:20:05', 'trạng thái': "Theo dõi" },
    { website: 'quanlyvanban.bqp', 'thời gian': '01/05/2025 12:00:45', 'trạng thái': "Mất kết nối" },
    { website: 'htt2.bt186.bqp', 'thời gian': '03/05/2025 15:10:46', 'trạng thái': "Bình thường" },
    { website: 'mail.bqp', 'thời gian': '04/05/2025 16:20:05', 'trạng thái': "Theo dõi" },
    { website: 'quanlyvanban.bqp', 'thời gian': '01/05/2025 12:00:45', 'trạng thái': "Mất kết nối" },
    { website: 'htt2.bt186.bqp', 'thời gian': '03/05/2025 15:10:46', 'trạng thái': "Bình thường" },
    { website: 'mail.bqp', 'thời gian': '04/05/2025 16:20:05', 'trạng thái': "Theo dõi" },
    { website: 'quanlyvanban.bqp', 'thời gian': '01/05/2025 12:00:45', 'trạng thái': "Mất kết nối" }
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
  ]
  tableDataMalware = [
    { case: 'Mã độc MF', value: '20' },
    { case: 'Mã độc APT', value: '120' },
    // { connect: '86.36.123.10:8000', bytes: '80' },
  ]
  stackChartConfig = {
    title: 'Biểu đồ khai thác',
    categories: ['Quân khu 5', 'Quân khu 2', 'TC CNQP','BTL BĐBP','QC PKKQ','QCHQ'],
    series: [
      { name: 'Thiết bị', data: [120, 132, 101,90,102,105], color: 'rgba(28, 155, 83, 1)' },
      { name: 'Cảnh báo', data: [220, 182, 191,200,187,210], color: '#fcd200' },

    ],
    height: '360px',
    tooltipFormatter: (params: any) => {
      const param = params;
      return `${param.name}: ${param.value} mục tiêu ${this.getLevelOnly(param.seriesName ?? '')}`;
    },
    isStacked: true
  };
  stackChartConfig2 = {
    title: 'Biểu đồ khai thác',
    categories: ['22', '3389', '80', '443', '27017'],
    series: [
      { name: 'Số máy', data: [120, 132, 101, 100, 89], color: 'rgba(28, 155, 83, 1)' },
      { name: 'Mới', data: [220, 182, 191, 159, 170], color: 'rgba(52, 131, 251, 1)' },

    ],
    height: '360px',
    tooltipFormatter: (params: any) => {
      const param = params;
      return `${param.name}: ${param.value} mục tiêu ${this.getLevelOnly(param.seriesName ?? '')}`;
    },
    isStacked: true
  };
  chartConfig: PipeChartConfig = {
    data: [
      { value: 41.7, name: 'Tên miền độc hại', itemStyle: { color: 'rgba(28, 155, 83, 1)' } },
      { value: 29.2, name: 'Mã độc', itemStyle: { color: 'rgba(52, 131, 251, 1)' } },
      { value: 12.8, name: 'IP độc hại', itemStyle: { color: 'rgba(210, 0, 26, 1)' } },
      { value: 16.7, name: 'Vi phạm chính sách', itemStyle: { color: 'yellow' } },
    ],
    title: '',
    colors: ['#ff4d4f', '#40a9ff', '#73d13d'],
    legendPosition: 'bottom',
    radius: ['30%', "50%"], 
    showLabelInside: false,
    height: '480px',
    legend: true,

  };
  stackChartConfigRedfox = {
    title: 'Biểu đồ khai thác',
    categories: ['Thiết bị', 'NDR', 'EDR'],
    series: [
      { name: 'Online', data: [120, 132, 101], color: 'rgba(28, 155, 83, 1)' },
      { name: 'Offline', data: [220, 182, 191], color: 'rgba(52, 131, 251, 1)' },

    ],
    height: '230px',
    tooltipFormatter: (params: any) => {
      const param = params;
      return `${param.name}: ${param.value} mục tiêu ${this.getLevelOnly(param.seriesName ?? '')}`;
    },
    isStacked: true
  };
  nonStackChartConfig: StackChartConfig = {
    title: 'Dấu hiệu tấn công theo chiến - kỹ thuật',
    height: '480px',
    isStacked: false,
    isShowLabel:false,
    categories: ['Initial Access', 'Execution', 'Persistence', 'Privilege Escalation', 'Defense Evasion', 'Credential Access', 'Discovery', 'Lateral Movement', 'Collection', 'Exfiltration', 'Command and Control', 'Impact'],
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
              '#DC143C'  // H
            ];
            return colorList[params.dataIndex];
          }
        },
      }
    ],
  };
  getLevelOnly(name: string): string {
    const parts = name.split(' ');  // Tách theo dấu cách
    return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : name;
  }
    onChange(result: Date[]): void {
    console.log('onChange: ', result);
  }
}
