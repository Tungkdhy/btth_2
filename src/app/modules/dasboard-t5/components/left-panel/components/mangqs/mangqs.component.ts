import { Component } from '@angular/core';
import { TablePtmComponent } from '../ts_2/table-ptm/table-ptm.component';
import { StackChart } from '../../../shared/stack-chart/stack-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { PipeChartConfig } from '../../../shared/pie-chart/pipe-chart.config';
import { StackChartConfig } from '../../../shared/stack-chart/stack-chart.config';
import { StackChartHori } from './stack-chart-hori/stack-chart-hori.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { HeaderChartComponent } from '../../../shared/header-chart/header-chart.component';
import { FormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import dayjs from 'dayjs';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
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
  constructor(private cdr: ChangeDetectorRef) {}
  stackChartHoriPOCSummary = null;
  http = inject(HttpClient);
  headers = new HttpHeaders({
    apiKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE', // 🔐 Thay YOUR_API_KEY_HERE bằng key thật
  });
  date = [dayjs().subtract(30, 'day').toDate(), dayjs().toDate()];
  onChange(result: Date[]): void {
    if (result && result.length === 2) {
      const start = formatDate(result[0], 'yyyyMMddHHmmss', 'en-US');
      const end = formatDate(result[1], 'yyyyMMddHHmmss', 'en-US');

      this.fetchChartDataWithRange(start, end);
      this.fetchCbatttData(start, end);
      this.fetchKqSanTimData(start, end);
      this.fetchOpenPortsData(start, end);
      this.fetchCbatttDataTDH(start, end);
      this.fetchKqSanTimDataTDH(start, end);
    }
  }
  fetchChartDataWithRange(start: string, end: string) {
    const body = {
      p_start_date: start,
      p_end_date: end,
      // p_source: 'QS',
    };
    // pham vi san tim
    this.http
      .post<any>('http://10.10.53.58:8002/rest/v1/rpc/mang_qs_pvst', body, {
        headers: this.headers, // ✅ Đúng cú pháp
      })
      .subscribe((res) => {
        const units = res.data.units_detail || [];
        this.stackChartHoriPOCSummary = res.data.summary.total_all_devices;
        const categories = units.map((unit: any) => unit.unit_code).slice(0, 3);
        const deviceData = units
          .map((unit: any) => unit.total_devices)
          .slice(0, 3);
        const edrData = units.map((unit: any) => unit.total_edr).slice(0, 3);
        const dinhDanhData = units
          .map((unit: any) => unit.total_dinh_danh)
          .slice(0, 3);

        this.stackChartHoriPOC = {
          fontFamily: 'Inter, sans-serif', // Thay font tại đây
          toolbar: { show: true },
          dataLabels: {
            style: {
              fontSize: '14px',
              fontWeight: 'bold',
              colors: ['#333'],
            },
          },
          xaxis: {
            labels: {
              style: {
                fontSize: '12px',
                fontFamily: 'Inter',
                colors: 'red',
              },
            },
          },

          title: 'Phạm vi săn tìm',
          categories,
          series: [
            {
              name: 'Máy tính',
              type: 'bar',
              data: deviceData,
              color: 'rgba(35, 166, 94, 1)',
            },
            {
              name: 'EDR',
              type: 'bar',
              data: edrData,
              color: 'rgba(51, 126, 255, 1)',
            },
            {
              name: 'Định danh',
              type: 'bar',
              data: dinhDanhData,
              color: 'rgba(251, 171, 0, 1)',
            },
          ],
          height: '655px',
          tooltipFormatter: (params: any) => `${params.name}`,
          legendFormatter: (name: string) => name,
          isStacked: false,
        };
        this.cdr.detectChanges();
      });
  }

  fetchCbatttData(start: string, end: string) {
    const body = {
      p_start_date: start,
      p_end_date: end,
      p_event_source: 'QS',
    };

    this.http
      .post<any>('http://10.10.53.58:8002/rest/v1/rpc/mang_qs_cbattt', body, {
        headers: this.headers,
      })
      .subscribe((res) => {
        const details = res?.data?.event_types_detail || [];

        // 👉 Sắp xếp giảm dần theo total_events
        const sorted = [...details].sort(
          (a, b) => b.total_events - a.total_events,
        );

        // 👉 Lấy 3 phần tử đầu tiên
        const top3 = sorted.slice(0, 3);
        const others = sorted.slice(3);
        const PALETTE = ['#4CAF50', '#FFC107', '#F44336', '#9E9E9E', '#90CAF9'];
        const chartData = top3.map((item, idx) => ({
          value: item.total_events,
          name: item.event_type,
          itemStyle: {
            color: PALETTE[idx % PALETTE.length], // an toàn nếu > số màu
          },
        }));
        // 👉 Tính tổng số events còn lại và thêm mục "Other"
        const otherTotal = others.reduce(
          (sum, item) => sum + item.total_events,
          0,
        );
        if (otherTotal > 0) {
          chartData.push({
            value: otherTotal,
            name: 'Other',
            itemStyle: { color: '#BDBDBD' }, // màu xám cho "Other"
          });
        }

        this.chartConfig = {
          data: chartData,
          title: '',
          colors: chartData.map((d) => d.itemStyle.color), // đồng bộ legend/series
          legendPosition: 'bottom',
          radius: ['35%', '60%'],
          showLabelInside: false,
          height: '655px',
          legend: true,
        };

        // Lấy danh sách event_type làm categories
        const categories = details.map((item: any) => item.event_type);
        const data = details.map((item: any) => item.total_events);

        this.nonStackChartConfig = {
          title: 'Dấu hiệu tấn công theo chiến - kỹ thuật',
          height: '655px',
          isStacked: false,
          isShowLabel: false,
          categories,
          series: [
            {
              data,
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
                    '#64748b',
                    '#facc15',
                    '#14b8a6',
                  ];
                  return colorList[params.dataIndex];
                },
              },
            },
          ],
        };

        this.cdr.detectChanges();
      });
  }
  fetchCbatttDataTDH(start: string, end: string) {
    const body = {
      p_start_date: start,
      p_end_date: end,
      p_event_source: 'HQ',
    };

    this.http
      .post<any>('http://10.10.53.58:8002/rest/v1/rpc/mang_qs_cbattt', body, {
        headers: this.headers,
      })
      .subscribe((res) => {
        const details = res?.data?.event_types_detail || [];

        // 👉 Sắp xếp giảm dần theo total_events
        const sorted = [...details].sort(
          (a, b) => b.total_events - a.total_events,
        );
        const PALETTE = ['#4CAF50', '#FFC107', '#F44336', '#9E9E9E', '#90CAF9'];

        // 👉 Lấy 3 phần tử đầu tiên
        const top3 = sorted.slice(0, 3);
        const others = sorted.slice(3);

        const chartData = top3.map((item, idx) => ({
          value: item.total_events,
          name: item.event_type,
          itemStyle: {
            color: PALETTE[idx % PALETTE.length], // an toàn nếu > số màu
          },
        }));

        // 👉 Tính tổng số events còn lại và thêm mục "Other"
        const otherTotal = others.reduce(
          (sum, item) => sum + item.total_events,
          0,
        );
        if (otherTotal > 0) {
          chartData.push({
            value: otherTotal,
            name: 'Other',
            itemStyle: { color: '#BDBDBD' }, // màu xám cho "Other"
          });
        }

        this.chartConfigTDH = {
          data: chartData,
          title: '',
          colors: chartData.map((d) => d.itemStyle.color), // đồng bộ legend/series
          legendPosition: 'bottom',
          radius: ['35%', '60%'],
          showLabelInside: false,
          height: '655px',
          legend: true,
        };

        // Lấy danh sách event_type làm categories
        const categories = details.map((item: any) => item.event_type);
        const data = details.map((item: any) => item.total_events);
        this.nonStackChartConfigTDH = {
          title: 'Dấu hiệu tấn công theo chiến - kỹ thuật',
          height: '655px',
          isStacked: false,
          isShowLabel: false,
          categories,
          series: [
            {
              data,
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
                    '#64748b',
                    '#facc15',
                    '#14b8a6',
                  ];
                  return colorList[params.dataIndex % colorList.length];
                },
              },
            },
          ],
        };

        this.cdr.detectChanges();
      });
  }
  fetchKqSanTimData(start: string, end: string) {
    const body = {
      p_start_date: start,
      p_end_date: end,
      p_source: 'QS',
    };

    this.http
      .post<any>(
        'http://10.10.53.58:8002/rest/v1/rpc/mang_qs_kq_san_tim_moi_nguy_co',
        body,
        { headers: this.headers },
      )
      .subscribe((res) => {
        const rawData = res?.data?.malware_details || [];

        // 👉 Gom nhóm theo tên mã độc
        const groupedMap = new Map<string, number>();
        rawData.forEach((item: any) => {
          const name = item?.malware_name?.trim() || 'Unknown';
          groupedMap.set(name, (groupedMap.get(name) || 0) + 1);
        });

        // 👉 Biến đổi thành mảng theo format bảng
        const tableData = Array.from(groupedMap.entries()).map(
          ([name, count], index) => ({
            stt: index + 1,
            name: name,
            count: count,
          }),
        );

        this.tableData = tableData;
        this.cdr.detectChanges();
      });
  }
  fetchKqSanTimDataTDH(start: string, end: string) {
    const body = {
      p_start_date: start,
      p_end_date: end,
      p_source: 'HQ',
    };

    this.http
      .post<any>(
        'http://10.10.53.58:8002/rest/v1/rpc/mang_qs_kq_san_tim_moi_nguy_co',
        body,
        { headers: this.headers },
      )
      .subscribe((res) => {
        const rawData = res?.data?.malware_details || [];

        // 👉 Gom nhóm theo tên mã độc
        const groupedMap = new Map<string, number>();
        rawData.forEach((item: any) => {
          const name = item?.malware_name?.trim() || 'Unknown';
          groupedMap.set(name, (groupedMap.get(name) || 0) + 1);
        });

        // 👉 Biến đổi thành mảng theo format bảng
        const tableData = Array.from(groupedMap.entries()).map(
          ([name, count], index) => ({
            stt: index + 1,
            name: name,
            count: count,
          }),
        );

        this.tableDataTDH = tableData;
        this.cdr.detectChanges();
      });
  }
  fetchOpenPortsData(start: string, end: string) {
    const body = {
      p_start_date: start,
      p_end_date: end,
    };

    this.http
      .post<any>(
        'http://10.10.53.58:8002/rest/v1/rpc/mang_qs_gs_cong_mo',
        body,
        { headers: this.headers },
      )
      .subscribe((res) => {
        const details = res?.data?.port_details || [];

        // ⚙️ Các port cần hiển thị trên biểu đồ
        const targetPorts = ['22', '3389', '80', '443', '27017'];

        const portMap = new Map(
          details.map((item: any) => [item.port.toString(), item]),
        );

        const categories = targetPorts;

        // 👉 Map số thiết bị và số cổng mở theo port
        const newOpenPorts = categories.map(
          // @ts-ignore
          (port) => portMap.get(port)?.total_open_count || 0,
        );

        const registeredDevices = categories.map(
          // @ts-ignore
          (port) => portMap.get(port)?.total_devices || 0,
        );

        this.stackChartConfig2 = {
          title: 'Biểu đồ khai thác',
          categories,
          series: [
            {
              name: 'Số thiết bị đăng ký',
              data: registeredDevices,
              color: 'rgb(28, 155, 83)',
            },
            {
              name: 'Số thiết bị mới mở cổng',
              data: newOpenPorts,
              color: 'rgb(239, 62, 46)',
            },
          ],
          height: '655px',
          isStacked: true,
          tooltipFormatter: (params: any) => {
            const param = params;
            return `${param.name}: ${param.value} mục tiêu ${this.getLevelOnly(
              param.seriesName ?? '',
            )}`;
          },
        };

        this.cdr.detectChanges();
      });
  }

  selectedOption: string = 'Radar';
  tableData = [{ stt: 1, name: 'Mustang Panda', count: 12 }];
  tableDataTDH = [{ stt: 1, name: 'Mustang Panda', count: 12 }];

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
    fontFamily: 'Roboto, sans-serif', // Thay font tại đây
    toolbar: { show: false },
    dataLabels: {
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        colors: ['#333'],
      },
    },
    xaxis: {
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Roboto',
          colors: 'red',
        },
      },
    },
    title: 'Biểu đồ khai thác',
    categories: ['BĐBP', 'QCHQ', 'QC PKKQ'], // label của các cột
    series: [
      {
        name: 'Thiết bị',
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
    height: '655px',
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
    height: '655px',
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
    height: '655px',
    legend: true,
  };
  chartConfigTDH: PipeChartConfig = {
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
    height: '655px',
    legend: true,
  };
  stackChartHoriPOC = {
    fontFamily: 'Roboto, sans-serif', // Thay font tại đây
    toolbar: { show: false },
    dataLabels: {
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        colors: ['#333'],
      },
    },
    xaxis: {
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Roboto',
          colors: 'red',
        },
      },
    },
    title: 'Biểu đồ khai thác',
    categories: ['BDBP', 'QC HQ', 'QC PKKQ'],
    series: [
      {
        name: 'Máy tính',
        type: 'bar',
        // stack: 'Tổng',
        data: [0, 0, 0],
        color: 'rgba(35, 166, 94, 1)', // màu xanh lá
      },
      {
        name: 'EDR',
        type: 'bar',
        // stack: 'Tổng',
        data: [0, 0, 0],
        color: 'rgba(51, 126, 255, 1)', // màu xanh dương
      },
      {
        name: 'Định danh',
        type: 'bar',
        data: [0, 0, 0],
        color: 'rgba(251, 171, 0, 1)', // màu vàng cam
      },
    ],
    height: '655px',
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
    height: '655px',
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
    height: '655px',
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
  nonStackChartConfigTDH: StackChartConfig = {
    title: 'Dấu hiệu tấn công theo chiến - kỹ thuật',
    height: '655px',
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

  ngOnInit(): void {
    const start = formatDate(this.date[0], 'yyyyMMddHHmmss', 'en-US');
    const end = formatDate(this.date[1], 'yyyyMMddHHmmss', 'en-US');
    this.fetchChartDataWithRange(start, end);
    this.fetchCbatttData(start, end); // 👈 thêm dòng này
    this.fetchKqSanTimData(start, end);
    this.fetchOpenPortsData(start, end);
    this.fetchCbatttDataTDH(start, end);
    this.fetchKqSanTimDataTDH(start, end);
  }
}
