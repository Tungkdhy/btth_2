import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import dayjs,{Dayjs } from 'dayjs';

import { ApiTcmService } from 'src/app/modules/dasboard-t5/services/tcm.service';
import { TargetComponent } from 'src/app/modules/dashboard/components/shared/cyber-warface/target/target.component';
import { convertToStackChartHoriPOCConfig } from 'src/app/modules/dasboard-t5/utils/converPOC';
// import { ExploitLevelComponent } from 'src/app/modules/dashboard/components/shared/cyber-warface/warface-technique/exploit-level.component';
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
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';
import { AppStateService } from 'src/app/core/services/app-state.service';
import { ChuthichComponent } from '../../../shared/chuthich/chuthich.component';
import { convertToStackChartExploitConfig } from 'src/app/modules/dasboard-t5/utils/convertMTTC';
import { convertToNonStackChartConfig } from 'src/app/modules/dasboard-t5/utils/convertDLTT';
import { convertToDataReport } from 'src/app/modules/dasboard-t5/utils/covertDataReport';
import { convertToStackChartConfig } from 'src/app/modules/dasboard-t5/utils/covertKQKT';
import { convertToStackChartDeepReportConfig } from 'src/app/modules/dasboard-t5/utils/convertBC';
import { TablePtmTSMComponent } from '../../../shared/table-tsm/table-ptm-tsm.component';
@Component({
  selector: 'app-tcm',
  standalone: true,
  templateUrl: './tcm.component.html',
  styleUrls: ['./tcm.component.scss'],
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
    NzDatePickerModule,
    FormsModule,
    ChuthichComponent,
    TablePtmTSMComponent
  ]
})
export class TcmComponent implements OnInit {
  reportData: any;
  date: Date[] = [
  new Date(2025, 0, 31), // tháng 1
  new Date(2025, 7, 31)  // tháng 8
]; // Variable to hold the API response data
  dataReport = [
    {
      stt: 1,
      direction: '<a style="width:300px;">H</a>',
      targetType: 'Chủ yếu',
      exploitData: '40GB',
      deepReport: '21 Báo cáo',
      details: [
        {
          stt: 1,
          tenBaoCao: "385/BC-T5 Tập trận Taming Sari 23/25",
          phatHanh: "15/07/2025",
          muc: "Gửi BTL",
          icon: "🟢"
        },
        {
          stt: 1,
          tenBaoCao: "384/BC-T5 Tập trận Kerismas 28/25 (6...)", // Bị cắt
          phatHanh: "15/07/2025",
          muc: "Gửi BTL",
          icon: "🟢"
        },
        {
          stt: 3,
          tenBaoCao: "372/BC-T5 Báo cáo Kế hoạch hoạt động...", // Bị cắt
          phatHanh: "10/07/2025",
          muc: "Gửi BTL",
          icon: "🔵"
        }
      ]
    },
    {
      stt: 2,
      direction: 'MAL',
      targetType: 'Quan trọng',
      exploitData: '120GB',
      deepReport: '20 Báo cáo',
      details: [
        {
          stt: 1,
          tenBaoCao: "385/BC-T5 Tập trận Taming Sari 23/25",
          phatHanh: "15/07/2025",
          muc: "Gửi BTL",
          icon: "🟢"
        },
        {
          stt: 1,
          tenBaoCao: "384/BC-T5 Tập trận Kerismas 28/25 (6...)", // Bị cắt
          phatHanh: "15/07/2025",
          muc: "Gửi BTL",
          icon: "🟢"
        },
        {
          stt: 3,
          tenBaoCao: "372/BC-T5 Báo cáo Kế hoạch hoạt động...", // Bị cắt
          phatHanh: "10/07/2025",
          muc: "Gửi BTL",
          icon: "🔵"
        }
      ]
    }
  ];
  stackChartConfig = {
    title: 'Biểu đồ khai thác',
    subTitle: "Tổng:21/30",
    statsList: [
      { color: '#008000', label: `Mức 1: K.Thác cơ bản (2)` },
      { color: '#1E90FF', label: `Mức 2: Duy trì kết nối (4)` },
      { color: '#FFA500', label: `Mức 3: Thâm nhập sâu (6)` },
      { color: '#FF0000', label: `Mức 4: Tấn công phá huỷ (8)` }
    ],
    categories: ['H', 'MAI', 'IND', 'K', 'BRN', 'TAW'],
    series: [
      { name: 'Mức 1 K.Thác cơ bản', data: [120, 132, 101, 134, 90, 230], color: 'rgba(28, 155, 83, 1)' },
      { name: 'Mức 2 Duy trì kết nối', data: [220, 182, 191, 234, 290, 330], color: 'rgba(52, 131, 251, 1)' },
      { name: 'Mức 3 Thâm nhập sâu', data: [150, 212, 201, 154, 190, 330], color: 'rgba(255, 191, 74, 1)' },
      { name: 'Mức 4 Tấn công phá hủy', data: [320, 332, 301, 334, 390, 320], color: 'rgba(239, 62, 46, 1)' }
    ],
    height: '330px',
    tooltipFormatter: (params: any) => {
      const param = params;
      return `${param.name}: ${param.value} mục tiêu ${this.getLevelOnly(param.seriesName ?? '')}`;
    },
    isStacked: true
  };
  stackChartHoriPOC = {
    title: 'Lỗ hổng bảo mật - Mã khai thác',
    subTitle: "Tổng: 49",
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
    height: '390px',
    tooltipFormatter: (params: any) => {

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
    subTitle: "Tổng: 12/20",
    categories: ['H', 'MAI', 'IND', 'K', 'BRN', 'TAW'],
    series: [
      { name: 'Đã khai thác thành công', data: [120, 132, 101, 134, 90, 230], color: 'rgba(28, 155, 83, 1)' },
      { name: 'Đang tiến hành khai thác', data: [220, 182, 191, 234, 290, 330], color: '#045e2b' },

    ],
    height: '390px',
    tooltipFormatter: (params: any) => {


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
    height: '430px',
    isStacked: false, // 🔁 RẤT QUAN TRỌNG
    categories: ['H', 'MAI', 'IND', 'K', 'BRN', 'TAW'],
    // legend: true,
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
    summaryList: [
      { color: '#008000', label: 'Cấp 1: Bộ tư lệnh(807)' },
      { color: '#1E90FF', label: 'Cấp 2: Cục tác chiến(1447)' },
      { color: '#FFA500', label: 'Cấp 3: TT BTTM, BQP(1237)' },
      { color: '#FF0000', label: 'Cấp 4: LĐ Đảng, Nhà nước(1997)' }
    ],
    categories: ['H', 'MAI', 'IND', 'K', 'BRN', 'TAW'],
    series: [
      { name: 'Cấp 1: Bộ tư lệnh', data: [120, 132, 101, 134, 90, 230], color: 'rgba(28, 155, 83, 1)' },
      { name: 'Cấp 2: Cục tác chiến', data: [220, 182, 191, 234, 290, 330], color: 'rgba(52, 131, 251, 1)' },
      { name: 'Cấp 3: TT BTTM, BQP', data: [150, 212, 201, 154, 190, 330], color: 'rgba(255, 191, 74, 1)' },
      { name: 'LĐ Đảng, Nhà nước', data: [320, 332, 301, 334, 390, 320], color: 'rgba(239, 62, 46, 1)' }
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
      { value: 4, name: 'C', itemStyle: { color: 'rgba(28, 155, 83, 1)' } },
      { value: 5, name: 'T', itemStyle: { color: 'rgba(52, 131, 251, 1)' } },
      { value: 7, name: 'H', itemStyle: { color: 'rgba(210, 0, 26, 1)' } },
    ],
    title: '',
    colors: ['#ff4d4f', '#40a9ff', '#73d13d'],
    legendPosition: 'bottom',
    radius: ['30%', '55%'], // 👈 thu nhỏ để tạo khoảng trống
    showLabelInside: false,
    height: '390px',

  };
  constructor(private apiService: ApiService, public appStateService: AppStateService, private apiTcmService: ApiTcmService, private cdr: ChangeDetectorRef) { }



  ngOnInit() {
    this.loadData('20250101000000', '20250831235959');
  }

  loadData(startDate: string, endDate: string) {
    const body = {
      p_start_date: startDate,
      p_end_date: endDate
    };

    forkJoin([
      this.apiTcmService.fetchData(body),
      this.apiTcmService.getDataTcm_mttc(body),
      this.apiTcmService.getDataDLTT(body),
      this.apiTcmService.getDataBC(body),
      this.apiTcmService.getDataPOC(body),
      this.apiTcmService.getDataBCCS(body)
    ]).subscribe({
      next: ([res1, res2, res3, res4, res5,res6]) => {
        // Lấy dữ liệu mục tiêu khai thác
        this.stackChartHoriConfig = convertToStackChartExploitConfig(res2);
        // Lây dữ liệu mục tiêu tác chiến
        this.stackChartConfig = convertToStackChartConfig(res1);
        // Lấy dữ liệu thu thập được
        this.nonStackChartConfig = convertToNonStackChartConfig(res3)
        //Lấy dữ liệu báo cáo chuyên sâu
        this.stackChartConfig2 = convertToStackChartDeepReportConfig(res4)
        //Lấy dữ liệu mã khai thác
        this.stackChartHoriPOC = convertToStackChartHoriPOCConfig(res5)
        //Lấy danh sách báo cáo chuyên sâu
        this.dataReport = convertToDataReport(res6)
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Lỗi:', err);
      }
    });
  }

  // Khi thay đổi thời gian
  onTimeChange(startDate: string, endDate: string) {
    this.loadData(startDate, endDate);
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
          name: 'Cấp 4:LĐ Đảng, Nhà nước',
          data: data.map(d => d.level_four),
          color: 'rgba(239, 62, 46, 1)'
        }
      ],
      height: '330px',
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
      height: '390px',
      tooltipFormatter: (params: any) => {
        console.log(params);

        const param = params;
        return `${param.name}: ${param.value} mục tiêu ${this.getLevelOnly(param.seriesName ?? '')}`;
      },
    };
  }
  // convertToStackChartExploitConfig(data: any[]) {
  //   const categories = data.map(d => d.target);

  //   return {
  //     title: 'Mục tiêu tác chiến',
  //     categories: this.stackChartHoriConfig.categories,
  //     isStacked: true,
  //     series: [
  //       {
  //         name: 'Đã khai thác thành công',
  //         data: data.map(d => d.current),
  //         color: 'rgba(28, 155, 83, 1)'
  //       },
  //       {
  //         name: 'Đang tiến hành khai thác',

  //         data: data.map(d => d.non_current),
  //         color: '#045e2b'
  //       },
  //     ],
  //     height: '390px',
  //     tooltipFormatter: (params: any) => {
  //       console.log(params);

  //       const param = params;
  //       return `${param.name}: ${param.value} mục tiêu ${this.getLevelOnly(param.seriesName ?? '')}`;
  //     },
  //     legendFormatter: (name: string) => {
  //       return name;
  //     }
  //   };
  // }

  handleRowClick(row: any) {
    console.log('Click từ component con:', row);
    // Ví dụ mở modal chi tiết:
    // this.selectedRow = row;
    // this.showDetailModal = true;
  }
  onChange(event: any) {
    if (event && event.length === 2) {
      const start = dayjs(event[0]).format('YYYYMMDD') + '000000'; // Bắt đầu ngày
      const end = dayjs(event[1]).format('YYYYMMDD') + '235959'; // Cuối ngày

      this.loadData(start, end);
    }
  }
  toggleMap() {
    this.appStateService.toggleShowMap(); // dùng được ngoài constructor
  }
}



