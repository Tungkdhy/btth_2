import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  inject,
  ChangeDetectorRef,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {
  ChartModule,
  SeriesModel,
  AxisModel,
  CategoryService,
  ColumnSeriesService,
  LineSeriesService,
  LegendService,
  DataLabelService,
  MultiLevelLabelService,
  SelectionService,
  BarSeriesService,
  ITextRenderEventArgs,
} from '@syncfusion/ej2-angular-charts';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { formatNumberWithDot } from 'src/app/_metronic/layout/core/common/common-utils';
import { BreadcrumLeftRightComponent } from '../../../shared/breadcrum-left-right/breadcrum-left-right.component';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';

@Component({
  selector: 'app-tctt-popup-sacthai',
  templateUrl: './tctt-popup-sacthai.component.html',
  styleUrls: ['./tctt-popup-sacthai.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TreeViewModule,
    GridModule,
    ChartModule,
    TreeGridModule,
    BreadcrumLeftRightComponent,
    NgxEchartsDirective
  ],
  providers: [
    CategoryService,
    BarSeriesService,
    ColumnSeriesService,
    LineSeriesService,
    DataLabelService,
    MultiLevelLabelService,
    SelectionService,
    LegendService,
    provideEcharts()
  ],
})
export class TcttPopupSacthaiComponent implements OnInit {
  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();

  private colorChart: string;
  public treeData: Object[] = [];
  public gridData: any[] = [];
  public originalGridData: any[] = [];
  public selectedNode: any;
  public chartSeries: SeriesModel[];
  private cdr = inject(ChangeDetectorRef);
  @Input() dataDetail: Object[];

  public primaryXAxis?: AxisModel;
  public chartPlatformData: Object[];
  public chartSpyderData: Object[];
  public title?: string;
  public dataLabel?: Object = [];
  public marker: Object;
  public primaryYAxis: AxisModel;
  public sacThaiMarker: any;
  public sacThaiPlatformChartOption: EChartsOption;
  public sacThaiChartSpyderOption: EChartsOption;
  
  public legendSettings: Object;

  public originalGridData2: any[] = [];

  dataSacthaiMock = [
    { name: 'Thông tin liên quan đến Đảng, Nhà nước', tich_cuc: 20, trung_lap: 40, can_xac_minh: 40 },
    { name: 'Thông tin liên quan đến UV BCT', tich_cuc: 10, trung_lap: 30, can_xac_minh: 60 },
    { name: 'Thông tin liên quan đến quân đội', tich_cuc: 25, trung_lap: 35, can_xac_minh: 40 },
    { name: 'Thông tin liên quan đến tôn giáo, dân chủ, nhân quyền', tich_cuc: 26, trung_lap: 50, can_xac_minh: 75 },
    { name: 'Thông tin liên quan đến khiếu kiện đất đai', tich_cuc: 40, trung_lap: 32, can_xac_minh: 44 },
    { name: 'Thông tin liên quan đến tình hình biển đông', tich_cuc: 25, trung_lap: 31, can_xac_minh: 46 },
    { name: 'Thông tin liên quan đến xung đột Nga và Ukraine', tich_cuc: 60, trung_lap: 25, can_xac_minh: 77 },
    { name: 'Thông tin liên quan đến xung đột tại dải Gaza', tich_cuc: 20, trung_lap: 43, can_xac_minh: 40 },

  ];
  async ngOnInit() {
    this.colorChart = this.getCssVariable('body', '--colorText');
    if (this.dataDetail && Array.isArray(this.dataDetail)) {
      this.chartPlatformData = await this.dataDetail?.map((item: any) => ({
        name: `${item?.name} (${item?.platform_tichcuc +
          item?.platform_trungtinh +
          item?.platform_tieucuc
          })`,
        platform_tichcuc: item?.platform_tichcuc,
        platform_trungtinh: item?.platform_trungtinh,
        platform_tieucuc: item?.platform_tieucuc,
      }));
      this.chartSpyderData = await this.dataDetail?.map((item: any) => ({
        name: `${item?.name} (${item?.spyder_tichcuc + item?.spyder_trungtinh + item?.spyder_tieucuc
          })`,
        spyder_tichcuc: item?.spyder_tichcuc,
        spyder_trungtinh: item?.spyder_trungtinh,
        spyder_tieucuc: item?.spyder_tieucuc,
      }));
      console.log("chart platform: ", this.chartPlatformData);

      this.cdr.detectChanges();
    } else {
      console.error('dataDetail is null or undefined');
      this.chartPlatformData = []; // Set to an empty array to avoid issues
    }

    this.legendSettings = {
      visible: true, // Hiển thị legend
      position: 'Bottom', // Đặt legend ở dưới biểu đồ
      textStyle: {
        size: '2.2rem', // Tăng kích thước chữ
        fontWeight: '500',
      },
      alignment: 'Center',
      padding: 20,
    };

    this.primaryXAxis = {
      valueType: 'Category',
      labelIntersectAction: 'Wrap',
      title: '',
      labelStyle: {
        size: '2.5rem',
        fontWeight: 'bold',
      },
    };
    this.primaryYAxis = {
      minimum: 0,
      labelStyle: {
        size: '2rem',
      },
      rangePadding: 'Additional',
    };

    this.sacThaiMarker = {
      dataLabel: {
        visible: true,
        position: 'Outer', // You can also set 'Middle', 'Bottom', etc.
        font: {
          fontWeight: '500',
          color: this.colorChart, // Text color
          size: '2.5rem', // Text size
        },
      },
    };
    this.cdr.detectChanges();
  }

  private getCssVariable(selector: string, variable: string): string {
    const element = document.querySelector(selector);
    if (element) {
      return getComputedStyle(element).getPropertyValue(variable).trim();
    }
    return '';
  }

  public textRender(args: ITextRenderEventArgs | any): void {
    args.text = `${formatNumberWithDot(args.text)}`;
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['dataDetail'] && changes['dataDetail']?.currentValue) {
      this.chartPlatformData = changes['dataDetail']?.currentValue?.map(
        (item: any) => ({
          name: `${item?.name} (${item?.platform_tichcuc +
            item?.platform_trungtinh +
            item?.platform_tieucuc
            })`,
          platform_tichcuc: item?.platform_tieucuc,
          platform_trungtinh: item?.platform_trungtinh,
          platform_tieucuc: item?.platform_tieucuc,
        }),
      );
      this.chartSpyderData = changes['dataDetail']?.currentValue?.map(
        (item: any) => ({
          name: `${item?.name} (${item?.spyder_tichcuc + item?.spyder_trungtinh + item?.spyder_tieucuc
            })`,
          spyder_tichcuc: item?.spyder_tichcuc,
          spyder_trungtinh: item?.spyder_trungtinh,
          spyder_tieucuc: item?.spyder_tieucuc,
        }),
      );
      this.cdr.detectChanges();
    }

    // mock
    const dataChart = [
      {
        name: 'Tích cực',
        color: '#1C9B53',
        data: this.dataSacthaiMock.map(item => item.tich_cuc)
      },
      {
        name: 'Trung lập',
        color: '#3483FB',
        data: this.dataSacthaiMock.map(item => item.trung_lap)
      },
      {
        name: 'Cần xác minh',
        color: '#D2001A',
        data: this.dataSacthaiMock.map(item => item.can_xac_minh)
      }
    ];
    // option platform
    this.sacThaiPlatformChartOption = {
      grid: {
        left: '5px',
        right: 0,
        top: '8%',
        bottom: '10%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: this.dataSacthaiMock.map((item: any) => item.name),
        axisLine: { show: false }, // Ẩn đường trục X
        axisTick: { show: false }, // Ẩn vạch nhỏ trên trục X
        axisLabel: {
          show: true, fontSize: 18, fontWeight: 500, color: '#000', interval: 0,
          formatter: (value: string, index:number) => {
            const item = this.dataSacthaiMock[index];
            const total = item.tich_cuc + item.trung_lap + item.can_xac_minh;
            const words = value.split(' ');
            const firstLine = words.slice(0, 5).join(' ');
            const secondLine = words.slice(5).join(' ');
            if (secondLine) {
              return `${firstLine}\n${secondLine} (${total})`;
            }
            return `${firstLine} (${total})`;
          }
        },
      },
      yAxis: {
        type: 'value'
      },
      series: dataChart.map(item => (
        {
          name: item.name,
          type: 'bar',
          data: item.data,
          label: {
            show: true,
            position: 'top',
            fontSize: 18,
            fontWeight: 500,
            color: '#000'
          },
          itemStyle: {
            borderRadius: [8, 8, 8, 8],
            color: item.color
          }
        }
      )),
      legend: {
        show: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15',
        itemWidth: 14,
        itemHeight: 14,
        itemGap: 40,
        textStyle: {
          fontSize: 18,
          fontWeight: 500
        },
        icon: 'circle',
        // formatter: (name: string) => {
        //   const seriesData = (this.sacThaiChartOption.series as any[])[0]?.data;
        //   const item = seriesData?.find((d: any) => d.name === name);
        //   return `${name}: ${item?.value}`;
        // }
      },
    };

    // option spyder
    this.sacThaiChartSpyderOption = {
      grid: {
        left: '5px',
        right: 0,
        top: '8%',
        bottom: '10%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: this.dataSacthaiMock.map((item: any) => item.name),
        axisLine: { show: false }, // Ẩn đường trục X
        axisTick: { show: false }, // Ẩn vạch nhỏ trên trục X
        axisLabel: {
          show: true, fontSize: 18, fontWeight: 500, color: '#000', interval: 0,
          formatter: (value: string, index:number) => {
            const item = this.dataSacthaiMock[index];
            const total = item.tich_cuc + item.trung_lap + item.can_xac_minh;
            const words = value.split(' ');
            const firstLine = words.slice(0, 5).join(' ');
            const secondLine = words.slice(5).join(' ');
            if (secondLine) {
              return `${firstLine}\n${secondLine} (${total})`;
            }
            return `${firstLine} (${total})`;
          }
        },
      },
      yAxis: {
        type: 'value'
      },
      series: dataChart.map(item => (
        {
          name: item.name,
          type: 'bar',
          data: item.data,
          label: {
            show: true,
            position: 'top',
            fontSize: 18,
            fontWeight: 500,
            color: '#000'
          },
          itemStyle: {
            borderRadius: [8, 8, 8, 8],
            color: item.color
          }
        }
      )),
      legend: {
        show: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15',
        itemWidth: 14,
        itemHeight: 14,
        itemGap: 40,
        textStyle: {
          fontSize: 18,
          fontWeight: 500
        },
        icon: 'circle',
      },
    };
  }

  // xử lý sự kiện đóng popup từ component con tới component cha
  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }


}
