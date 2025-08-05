import { Component } from '@angular/core';
import { NuanceInforComponent } from "../../../../../dashboard/components/shared/information-warface/nuance-infor/nuance-infor.component";
import { BieuDoBvTieuCucComponent } from "../../../../../dashboard/components/shared/information-warface/bieu-do-bv-tieu-cuc/bieu-do-bv-tieu-cuc.component";
import { HotTopicComponent } from "../../../../../dashboard/components/shared/information-warface/hot-topic/hot-topic.component";
import { LineChartComponent } from "../../../shared/line-chart/line-chart.component";
import { PieChartComponent } from "../../../shared/pie-chart/pie-chart.component";
import { PipeChartConfig } from '../../../shared/pie-chart/pipe-chart.config';
import { CustomTableComponent } from '../../../shared/custom-table/custom-table.component';
import { StackChartConfig } from '../../../shared/stack-chart/stack-chart.config';
import { StackChart } from '../../../shared/stack-chart/stack-chart.component';
import { LivestreamItem, LivestreamWarningComponent } from '../../../shared/live-stream/live-stream.component';
import { ViralPost, ViralPostsComponent } from '../../../shared/viral-posts/viral-posts.component';
import { TablePtmComponent } from '../../../shared/table-ptm/table-ptm.component';
import { HeaderChartComponent } from '../../../shared/header-chart/header-chart.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-ts-2',
  standalone: true,
  templateUrl: './ts.component.html',
  styleUrls: ['./ts.component.scss'],
  imports: [NuanceInforComponent,NzDatePickerModule,FormsModule,HeaderChartComponent, BieuDoBvTieuCucComponent, TablePtmComponent, HotTopicComponent, LineChartComponent, ViralPostsComponent, LivestreamWarningComponent, PieChartComponent, CustomTableComponent, StackChart],
})
export class Ts2Component {
  date = null
  livestreamList: LivestreamItem[] = [
    {
      name: 'VOA Tiếng Việt',
      datetime: '13/03/2025',
      time: '23:30',
      views: 211,
      interactions: 0,
      avatarUrl: 'assets/avatar-voa.png'
    },
    {
      name: 'VOA Tiếng Việt',
      datetime: '13/03/2025',
      time: '20:53',
      views: 203,
      interactions: 0
    },
    {
      name: 'VOA Tiếng Việt',
      datetime: '13/03/2025',
      time: '23:30',
      views: 211,
      interactions: 0,
      avatarUrl: 'assets/avatar-voa.png'
    },
  ];
  postList: ViralPost[] = [
    {
      title: 'Đăng status Facebook',
      date: '06/03/2025',
      time: '16:14',
      likes: '69K',
      comments: '1.8K',
      shares: '1.6K'
    },
    {
      title: 'Đăng status Facebook',
      date: '09/03/2025',
      time: '08:27',
      likes: '34K',
      comments: '2.6K',
      shares: '7.7K'
    }
  ];
  data: any[] = [
    {
      'description': "Thông tin lộ lọt liên quan đến Bộ, Ban Ngành",
      'value': "12",
    },
    {
      'description': "Thông tin lộ lọt liên quan đến VPQH",
      'value': "20",
    },
    {
      'description': "Thông tin lộ lọt liên quan đến VPCP",
      'value': "30",
    },
    {
      'description': "Thông tin lộ lọt liên quan đến Quân đội",
      'value': "21",
    },
    {
      'description': "Thông tin lộ lọt khác",
      'value': "40",
    },
  ]
  chartConfig: PipeChartConfig = {
    data: [
      { value: 4, name: 'BBN', itemStyle: { color: 'rgba(28, 155, 83, 1)' } },
      { value: 5, name: 'VPQH', itemStyle: { color: 'rgba(52, 131, 251, 1)' } },
      { value: 7, name: 'VPCP', itemStyle: { color: 'rgb(221, 161, 31)' } },
      { value: 7, name: 'Quân đội', itemStyle: { color: 'rgba(210, 0, 26, 1)' } },
      { value: 7, name: 'Khác', itemStyle: { color: 'rgb(140, 119, 119)' } },
    ],
    title: '',
    colors: ['#ff4d4f', '#40a9ff', '#73d13d'],
    legendPosition: 'bottom',
    radius: ['35%', '55%'],

    showLabelInside: false,
    height: '380px',
    legend:true
  };
  config: StackChartConfig = {
    isStacked: true,
    categories: ['H', 'X', 'P', 'K', 'MAL'],
    height: '300px',
    series: [
      {
        name: 'Tàu hải cảnh',
        color: '#2f3e9e',
        data: [4, 2, 1, 3, 3]
      },
      {
        name: 'Tàu cá',
        color: '#e91d24',
        data: [4, 5, 4, 5, 2]
      },
      {
        name: 'Giàn khoan',
        color: '#ffca28',
        data: [5, 1, 5, 6, 4]
      },
      {
        name: 'Tàu dân sự',
        color: '#66bb6a',
        data: [6, 3, 1, 4, 2]
      },
      {
        name: 'Tàu quân sự',
        color: '#2196f3',
        data: [2, 0, 1, 1, 1]
      }
    ]
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
        data: [4, 2, 1, 3, 3]
      },
      {
        name: 'Tàu cá',
        color: '#e91d24',
        data: [4, 5, 4, 5, 2]
      },
      {
        name: 'Giàn khoan',
        color: '#ffca28',
        data: [5, 1, 5, 6, 4]
      },
      {
        name: 'Tàu dân sự',
        color: '#66bb6a',
        data: [6, 3, 1, 4, 2]
      },
      {
        name: 'Tàu quân sự',
        color: '#2196f3',
        data: [2, 0, 1, 1, 1]
      }
    ]
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
        color: '#ff5b57'
      },
      {
        name: 'TT liên quan địa bàn QK3',
        data: [5],
        color: '#f8a548'
      },
      {
        name: 'Hội nghị BCHTW',
        data: [13],
        color: '#fcd200'
      }
    ]
  };
  area: StackChartConfig = {
    isStacked: true,
    height: '300px',
    categories: [
      'Hướng Châu Phi - Mỹ',
      'Hướng Châu Á - TBD',
      'Hướng Châu Âu',
      'Hướng DNA'
    ],
    series: [
      {
        name: 'Tích cực',
        color: '#4caf50', // xanh lá
        data: [3, 2, 4, 0]
      },
      {
        name: 'Tiêu cực',
        color: '#e53935', // đỏ
        data: [4, 4, 5, 5]
      },
      {
        name: 'Trung lập',
        color: '#00bcd4', // xanh dương nhạt
        data: [4, 6, 6, 3]
      },
      {
        name: 'Cần xác minh',
        color: '#1a237e', // xanh đậm
        data: [5, 6, 4, 5]
      }
    ]
  };
  dataLeak: any[] = [
    {
      stt: 1,
      "thông tin lộ lọt": "Thông tin về tài khoản",
      "ngày": "15/05/2025",
      "chủ quan": "VPCP"
    },
    {
      stt: 2,
      "thông tin lộ lọt": "Thông tin về tài khoản",
      "ngày": "15/05/2025",
      "chủ quan": "Quân đội"
    },
    {
      stt: 3,
      "thông tin lộ lọt": "Thông tin về tài khoản",
      "ngày": "15/05/2025",
      "chủ quan": "Khác"
    },
    {
      stt: 4,
      "thông tin lộ lọt": "Thông tin về tài khoản",
      "ngày": "15/05/2025",
      "chủ quan": "Bộ, Ban"
    },
    {
      stt: 5,
      "thông tin lộ lọt": "Thông tin về tài khoản",
      "ngày": "15/05/2025",
      "chủ quan": "VPCP"
    },
    {
      stt: 6,
      "thông tin lộ lọt": "Thông tin về tài khoản",
      "ngày": "15/05/2025",
      "chủ quan": "VPCP"
    },
    {
      stt: 7,
      "thông tin lộ lọt": "Thông tin về tài khoản",
      "ngày": "15/05/2025",
      "chủ quan": "VPCP"
    }
  ];
  dataFollow = [
    {
      stt: 1,
      "thông tin lộ lọt": "Thông tin KGM về A50 cần theo dõi",
      "số lượng": 3.142,
      "thời gian": "15/03/2025",
      "trạng thái": "Bình thường"
    },
    {
      stt: 2,
      "thông tin lộ lọt": "Thông tin KGM về A50 cần theo dõi",
      "số lượng": 2.718,
      "thời gian": "22/07/2025",
      "trạng thái": "Bình thường"
    },
    {
      stt: 3,
      "thông tin lộ lọt": "Thông tin KGM về A50 cần theo dõi",
      "số lượng": 4.669,
      "thời gian": "05/11/2025",
      "trạng thái": "Nguy cơ cao"
    },
    {
      stt: 4,
      "thông tin lộ lọt": "Thông tin KGM về A50 cần theo dõi",
      "số lượng": 1.414,
      "thời gian": "18/08/2025",
      "trạng thái": "Bình thường"
    },
    {
      stt: 5,
      "thông tin lộ lọt": "Thông tin KGM về A50 cần theo dõi",
      "số lượng": 6.283,
      "thời gian": "30/01/2025",
      "trạng thái": "Nguy cơ cao"
    },
    {
      stt: 6,
      "thông tin lộ lọt": "Thông tin KGM về A50 cần theo dõi",
      "số lượng": 5.000,
      "thời gian": "12/04/2025",
      "trạng thái": "Bình thường"
    },
    {
      stt: 7,
      "thông tin lộ lọt": "Thông tin KGM về A50 cần theo dõi",
      "số lượng": 7.389,
      "thời gian": "27/09/2025",
      "trạng thái": "Nguy cơ cao"
    },
    {
      stt: 8,
      "thông tin lộ lọt": "Thông tin KGM về A50 cần theo dõi",
      "số lượng": 8.000,
      "thời gian": "21/06/2025",
      "trạng thái": "Theo dõi"
    },
    {
      stt: 9,
      "thông tin lộ lọt": "Thông tin KGM về A50 cần theo dõi",
      "số lượng": 9.000,
      "thời gian": "15/05/2025",
      "trạng thái": "Bình thường"
    },
     {
      stt: 10,
      "thông tin lộ lọt": "Thông tin KGM về A50 cần theo dõi",
      "số lượng": 9.000,
      "thời gian": "15/05/2025",
      "trạng thái": "Bình thường"
    },
  ]

  onPopupToggled: (e: any) => {

  }
  onChange(event: any) {
    // this.data = event;
    // Call your API here with the selected date range
    console.log('Selected date range:', event);
  }
}
