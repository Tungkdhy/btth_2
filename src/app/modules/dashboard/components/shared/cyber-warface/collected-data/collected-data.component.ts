import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BarSeriesService,
  CategoryService,
  ChartModule,
  ColumnSeriesService,
  DataLabelService,
  DateTimeService,
  MultiColoredLineSeriesService,
  LegendService,
  TooltipService,
} from '@syncfusion/ej2-angular-charts';
import { SupabaseService } from '../../../../services/supabase.service';
import { formatDateTime } from '../../../../../../_metronic/layout/core/common/common-utils';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';

@Component({
  selector: 'app-collected-data',
  standalone: true,
  imports: [CommonModule, ChartModule, NgxEchartsDirective],
  providers: [
    DateTimeService,
    ColumnSeriesService,
    CategoryService,
    DataLabelService,
    BarSeriesService,
    LegendService,
    MultiColoredLineSeriesService,
    TooltipService,
    provideEcharts()
  ],
  templateUrl: './collected-data.component.html',
  styleUrls: ['./collected-data.component.scss'],
})
export class CollectedDataComponent implements OnInit {
  //basic color
  public basicColor: string;

  //collect column var
  public collectPrimaryXAxis: any;
  public collectData?: Promise<any[]>;
  collectPrimaryYAxis: any;
  public collectPointMapping: Object;
  public collectMarker: Object;
  public totalCollectData: number = 0;
  public collectlegendSettings: Object;
  public chartArea: Object;
  private supabaseService = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);
  startDate$: any;

  constructor() {}

  ngOnInit() {
    const today = new Date();
    const twoDaysAgo: Date = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 7);

    this.startDate$ = formatDateTime(twoDaysAgo).split(' ')[0];
    this.basicColor = '#4f8e6b';
    
    //legend settings    
    this.collectlegendSettings = { visible: true, position: 'Top' };
    //collect data column var
    this.collectPrimaryXAxis = {
      valueType: 'Category',
      title: '',
      labelStyle: {
        size: '26px', // Change this to the desired font size
        fontWeight: 'bold',
      },
      majorGridLines : {
        width : 0
      },
    };
    this.collectPrimaryYAxis={
      majorGridLines : {
        width : 0
      },
    }
    this.collectPointMapping = 'color';
    this.collectMarker = {
      dataLabel: {
        visible: true,
        position: 'Middle', // You can also set 'Middle', 'Bottom', etc.
        font: {
          fontWeight: 'bold',
          color: '#000000', // Text color
          size: '26px', // Text size
        },
        template: '<div>${point.y}</div>', // Custom template for data label
      },
    };
    this.chartArea = {
      border:{
        width:0
      }
    }
    this.collectData = this.supabaseService.t5_dulieuthuthap().finally(() => {
      this.collectData!.then((data) => {
        // Function to assign colors based on index or some other logic
        const assignColor = (index: number): string => {
          const colors = ['rgba(195, 0, 77, 1)',
            'rgba(170, 0, 139, 1)',
            'rgba(136, 60, 192, 1)',
            'rgba(107, 103, 225, 1)',
            'rgba(84, 146, 248, 1)',
            'rgba(62, 181, 250, 1)',
            'rgba(25, 192, 211, 1)']; // Example colors
          return colors[index % colors.length];
        };
        // Exclude the last item from collectData
        const modifiedData = data.slice(0, -1).map(item => ({
          "result_number": item.result_number,
          "unit_name": item.unit_name
        })).map((item: any, index: any) => ({
          ...item,
          "color": assignColor(index),
        }));;
        // Use modifiedData for further processing
        this.totalCollectData = modifiedData.reduce(
          (acc, item) => acc + item.result_number,
          0
        );
    
        
        this.cdr.markForCheck();
    
        // Optionally, reassign collectData to the modified data if needed
        this.collectData = Promise.resolve(modifiedData);
      });
    });
  }

  collectedDataChartOption: EChartsOption = {
    series: [
      {
        type: 'pie',
        radius: ['35%', '60%'],
        center: ['50%', '40%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{c} %',
          fontSize: '15px',
          fontWeight: 700
        },
        data: [
          { value: 30, name: 'TAW', itemStyle: { color: 'rgba(0, 60, 148, 1)' } },
          { value: 40, name: 'BRN', itemStyle: { color: 'rgba(0, 80, 199, 1)' } },
          { value: 25, name: 'K', itemStyle: { color: 'rgba(52, 131, 251, 1)' } },
          { value: 20, name: 'IDN', itemStyle: { color: 'rgba(113, 168, 252, 1)' } },
        ],
      },
    ],
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
      formatter: (name: string) => {
        const seriesData = (this.collectedDataChartOption.series as any[])[0]?.data;
        const item = seriesData?.find((d: any) => d.name === name);
        return `${name}: ${item?.value}`;
      }
    },
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: '38%',
        style: {
          text: '70',
          fontSize: 18,
          fontWeight: 'bold',
          fill: '#333',
        },
      },
    ],
  };
}
