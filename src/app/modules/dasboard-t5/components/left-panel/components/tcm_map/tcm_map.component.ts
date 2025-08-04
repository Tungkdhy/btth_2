import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { EChartsOption } from 'echarts';

import { TargetComponent } from 'src/app/modules/dashboard/components/shared/cyber-warface/target/target.component';
import { ExploitLevelComponent } from 'src/app/modules/dashboard/components/shared/cyber-warface/warface-technique/exploit-level.component';
import { ForceComponent } from 'src/app/modules/dashboard/components/shared/cyber-warface/force/force.component';
import { CollectedDataComponent } from 'src/app/modules/dashboard/components/shared/cyber-warface/collected-data/collected-data.component';
// import { ExploitLevelChartComponent } from '../../../shared/stack-chart/stack-chart.component';
import { StackChart } from '../../../shared/stack-chart/stack-chart.component';
import { ApiService } from 'src/app/modules/dasboard-t5/services/exploit.service';
import { StackChartHori } from '../../../shared/stack-chart-hori/stack-chart-hori.component';
import { PieChartComponent } from '../../../shared/pie-chart/pie-chart.component';
import { PipeChartConfig } from '../../../shared/pie-chart/pipe-chart.config';
import { forkJoin } from 'rxjs';
import { StackChartConfig } from '../../../shared/stack-chart/stack-chart.config';
import { HeaderChartComponent } from '../../../shared/header-chart/header-chart.component';
import { TablePtmComponent } from '../../../shared/table-ptm/table-ptm.component';
import { TablePtmV2Component } from '../../../shared/table-ptm_v2/table-ptm-v2.component';
import { HeaderChartV2Component } from '../../../shared/header-chart-v2/header-chart-v2.component';
import { ChuthichComponent } from '../../../shared/chuthich/chuthich.component';

@Component({
  selector: 'app-tcm-map',
  standalone: true,
  templateUrl: './tcm_map.component.html',
  styleUrls: ['./tcm_map.component.scss'],
  imports: [
    TargetComponent,
    ForceComponent,
    StackChart,
    CollectedDataComponent,
    HttpClientModule,
    StackChartHori,
    PieChartComponent,
    HeaderChartComponent,
    HeaderChartV2Component,
    TablePtmComponent,
    TablePtmV2Component,
    ChuthichComponent
  ]
})
export class TcmMapComponent implements OnInit {
  reportData: any;  // Variable to hold the API response data
  dataReport = [
    {
      stt: 1,
      direction: 'H',
      targetType: 'Chủ yếu',
      exploitData: '40GB',
      deepReport: '21 Báo cáo',
      details: [
        { name: 'CVE-2024-2001', level: 'Cao' },
        { name: 'CVE-2024-0002', level: 'Trung bình' }
      ]
    },
    {
      stt: 2,
      direction: 'MAL',
      targetType: 'Quan trọng',
      exploitData: '120GB',
      deepReport: '20 Báo cáo',
      details: [
        { name: 'CVE-2024-0001', level: 'Cao' },
        { name: 'CVE-2024-0002', level: 'Trung bình' }
      ]
    }
  ];
  stackChartConfig = {
    title: 'Biểu đồ khai thác',
    categories: ['H', 'MAI', 'IND', 'K', 'BRN', 'TAW'],
    series: [
      { name: 'Mức 1 K.Thác cơ bản', data: [120, 132, 101, 134, 90, 230], color: 'rgba(28, 155, 83, 1)' },
      { name: 'Mức 2 Duy trì kết nối', data: [220, 182, 191, 234, 290, 330], color: 'rgba(52, 131, 251, 1)' },
      { name: 'Mức 3 Thâm nhập sâu', data: [150, 212, 201, 154, 190, 330], color: 'rgba(255, 191, 74, 1)' },
      { name: 'Mức 4 Tấn công phá hủy', data: [320, 332, 301, 334, 390, 320], color: 'rgba(239, 62, 46, 1)' }
    ],
    height: '455px',
    tooltipFormatter: (params: any) => {
      console.log(params);

      const param = params;
      return `${param.name}: ${param.value} mục tiêu ${this.getLevelOnly(param.seriesName ?? '')}`;
    },
    isStacked: true
  };
  stackChartHoriPOC = {
    title: 'Lỗ hổng bảo mật - Mã khai thác',
    categories: ['H', 'MAI', 'IND', 'K', 'BRN', 'TAW'],
    series: [
      {
        name: 'Trung bình',
        type: 'bar',
        stack: 'CVE',
        barGap: '30%',
        barCategoryGap: '50%',
        data: [8, 20, 8, 8, 8, 8],
        color: 'rgba(52, 131, 251, 1)'
      },
      {
        name: 'Cao',
        type: 'bar',
        stack: 'CVE',
        data: [20, 8, 20, 20, 20, 20],
        color: 'rgba(255, 191, 74, 1)'
      },
      {
        name: 'Nghiêm trọng',
        type: 'bar',
        stack: 'CVE',
        data: [20, 20, 20, 20, 20, 20],
        color: 'rgba(239, 62, 46, 1)'
      },

      // POC Stack
      {
        name: 'Trung bình',
        type: 'bar',
        stack: 'POC',
        data: [9, 8, 9, 9, 9, 1],
        color: 'rgba(52, 131, 251, 1)'
      },
      {
        name: 'Cao',
        type: 'bar',
        stack: 'POC',
        data: [8, 9, 8, 8, 8, 20],
        color: 'rgba(255, 191, 74, 1)'
      },
      {
        name: 'Nghiêm trọng',
        type: 'bar',
        stack: 'POC',
        data: [6, 6, 6, 6, 6, 20],
        color: 'rgba(239, 62, 46, 1)'
      }
    ],
    height: '455px',
    tooltipFormatter: (params: any) => {
      console.log(params);

      const param = params;
      return `${param.name}: ${param.value} mục tiêu ${this.getLevelOnly(param.seriesName ?? '')}`;
    },
    legendFormatter: (name: string) => {
      return name
    },
    isStacked: true
  };
  stackChartHoriConfig = {
    title: 'Mục tiêu tác chiến',
    categories: ['H', 'MAI', 'IND', 'K', 'BRN', 'TAW'],
    series: [
      { name: 'Đã khai thác thành công', data: [120, 132, 101, 134, 90, 230], color: 'rgba(28, 155, 83, 1)' },
      { name: 'Đang tiến hành khai thác', data: [220, 182, 191, 234, 290, 330], color: '#045e2b' },

    ],
    height: '480px',
    tooltipFormatter: (params: any) => {
      console.log(params);

      const param = params;
      return `${param.name}: ${param.value} mục tiêu ${this.getLevelOnly(param.seriesName ?? '')}`;
    },
    legendFormatter: (name: string) => {
      const item = this.stackChartHoriConfig.series.find((s: any) => s.name === name);
      return name
    },
    isStacked: true
  };
  nonStackChartConfig: StackChartConfig = {
    title: 'Dữ liệu thu thập',
    subTitle: 'Tổng: 40 GB',
    height: '480px',
    isStacked: false, // 🔁 RẤT QUAN TRỌNG
    categories: ['H', 'MAI', 'IND', 'K', 'BRN', 'TAW'],
    series: [
      {
        // name: 'Mức 1',
        data: [11, 12, 4, 13, 1, 4],
        itemStyle: {
          color: function (params: any) {
            const colorList = [
              'rgba(52, 131, 251, 1)', // TAW
              'rgba(52, 131, 251, 1)', // BRN
              'rgba(52, 131, 251, 1)', // K
              'rgba(52, 131, 251, 1)', // IND
              'rgba(52, 131, 251, 1)', // MAI
              'rgba(52, 131, 251, 1)'  // H
            ];
            return colorList[params.dataIndex];
          }
        },
      }
    ]
  };
  stackChartConfig2: StackChartConfig = {
    title: 'Báo cáo chuyên sâu',
    subTitle: 'Tổng: 70 Báo cáo',
    categories: ['H', 'MAI', 'IND', 'K', 'BRN', 'TAW'],
    series: [
      { name: 'Cấp 1: Bộ tư lệnh', data: [120, 132, 101, 134, 90, 230], color: 'rgba(28, 155, 83, 1)' },
      { name: 'Cấp 2: Cục tác chiến', data: [220, 182, 191, 234, 290, 330], color: 'rgba(52, 131, 251, 1)' },
      { name: 'Cấp 3: TT BTTM, BQP', data: [150, 212, 201, 154, 190, 330], color: 'rgba(255, 191, 74, 1)' },
      { name: 'LĐ Đảng, Nhà nước', data: [320, 332, 301, 334, 390, 320], color: 'rgba(239, 62, 46, 1)' }
    ],
    height: '455px',
    tooltipFormatter: (params: any) => {
      console.log(params);

      const param = params;
      return `${param.name}: ${param.value} mục tiêu ${this.getLevelOnly(param.seriesName ?? '')}`;
    },
    isStacked: true
  };
  chartConfig: PipeChartConfig = {
    data: [
      { value: 4, name: 'C', itemStyle: { color: 'rgba(28, 155, 83, 1)' } },
      { value: 5, name: 'T', itemStyle: { color: 'rgba(52, 131, 251, 1)' } },
      { value: 7, name: 'H', itemStyle: { color: 'rgba(210, 0, 26, 1)' } },
    ],
    title: '',
    colors: ['#ff4d4f', '#40a9ff', '#73d13d'],
    legendPosition: 'bottom',
    radius: ['30%', '55%'], // 👈 thu nhỏ để tạo khoảng trống
    showLabelInside: false,
    height: '455px',

  };
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    forkJoin({
      report1: this.apiService.getReportData(),
      report2: this.apiService.getExploitData()
    }).subscribe({
      next: ({ report1, report2 }) => {
        console.log('Report 1:', report1);
        console.log('Report 2:', report2);

        // this.reportData = report1;
        // this.anotherReportData = report2;
        this.stackChartHoriConfig = this.convertToStackChartExploitConfig(report1);
        this.stackChartConfig2 = this.convertToStackChartConfig(report2);
        this.stackChartConfig = this.convertToStackChartLevelConfig(report1);
        this.chartConfig = this.convertToPipeChartConfig(report1);
        // this.anotherChartConfig = this.convertToStackChartConfig(report2); // nếu cần
      },
      error: (err) => {
        console.error('Error fetching reports:', err);
      }
    });
  }
  getLevelOnly(name: string): string {
    const parts = name.split(' ');  // Tách theo dấu cách
    return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : name;
  }
  convertToStackChartConfig(data: any[]) {
    const categories = data.map(d => d.target);

    return {
      title: 'Báo cáo chuyên sâu',
      categories: categories,
      isStacked: true,
      series: [
        {
          name: 'Cấp 1: Bộ tư lệnh',
          data: data.map(d => d.level_one),
          color: 'rgba(28, 155, 83, 1)'
        },
        {
          name: 'Cấp 2: Cục tác chiến',

          data: data.map(d => d.level_two),
          color: 'rgba(52, 131, 251, 1)'
        },
        {
          name: 'Cấp 3: TT BTTM, BQP',

          data: data.map(d => d.level_three),
          color: 'rgba(255, 191, 74, 1)'
        },
        {
          name: 'LĐ Đảng, Nhà nước',
          data: data.map(d => d.level_four),
          color: 'rgba(239, 62, 46, 1)'
        }
      ],
      height: '455px',
      tooltipFormatter: (params: any) => {
        console.log(params);

        const param = params;
        return `${param.name}: ${param.value} mục tiêu ${this.getLevelOnly(param.seriesName ?? '')}`;
      },
    };
  }
  convertToStackChartLevelConfig(data: any[]) {
    const categories = data.map(d => d.target);

    return {
      title: 'Biểu đồ khai thác',
      categories: categories,
      isStacked: true,
      series: [
        {
          name: 'Mức 1 K.Thác cơ bản',
          data: data.map(d => d.level_one),
          color: 'rgba(28, 155, 83, 1)'
        },
        {
          name: 'Mức 2 Duy trì kết nối',

          data: data.map(d => d.level_two),
          color: 'rgba(52, 131, 251, 1)'
        },
        {
          name: 'Mức 3 Thâm nhập sâu',

          data: data.map(d => d.level_three),
          color: 'rgba(255, 191, 74, 1)'
        },
        {
          name: 'Mức 4 Tấn công phá hủy',
          data: data.map(d => d.level_four),
          color: 'rgba(239, 62, 46, 1)'
        }
      ],
      height: '455px',
      tooltipFormatter: (params: any) => {
        console.log(params);

        const param = params;
        return `${param.name}: ${param.value} mục tiêu ${this.getLevelOnly(param.seriesName ?? '')}`;
      },
    };
  }
  convertToStackChartExploitConfig(data: any[]) {
    const categories = data.map(d => d.target);

    return {
      title: 'Mục tiêu tác chiến',
      categories: this.stackChartHoriConfig.categories,
      isStacked: true,
      series: [
        {
          name: 'Đã khai thác thành công',
          data: data.map(d => d.current),
          color: 'rgba(28, 155, 83, 1)'
        },
        {
          name: 'Đang tiến hành khai thác',

          data: data.map(d => d.non_current),
          color: '#045e2b'
        },
      ],
      height: '455px',
      tooltipFormatter: (params: any) => {
        console.log(params);

        const param = params;
        return `${param.name}: ${param.value} mục tiêu ${this.getLevelOnly(param.seriesName ?? '')}`;
      },
      legendFormatter: (name: string) => {
        return name;
      }
    };
  }
  convertToPipeChartConfig(input: any[]) {
    const colorPalette = [
      'rgba(28, 155, 83, 1)',
      'rgba(52, 131, 251, 1)',
      'rgba(210, 0, 26, 1)',
      'rgba(255, 174, 0, 1)',
      'rgba(128, 0, 255, 1)',
      'rgba(255, 0, 127, 1)'
    ];

    const data = input.map((item, index) => ({
      value: item.level_one + item.level_two + item.level_three + item.level_four,
      name: item.target,
      itemStyle: {
        color: colorPalette[index % colorPalette.length]
      }
    }));

    const config: PipeChartConfig = {
      data,
      title: '',
      colors: colorPalette,
      legendPosition: 'bottom',
      radius: ['30%', '55%'],
      showLabelInside: false,
      height: '455px'
    };

    return config;
  }
  handleRowClick(row: any) {
    console.log('Click từ component con:', row);
    // Ví dụ mở modal chi tiết:
    // this.selectedRow = row;
    // this.showDetailModal = true;
  }

}



