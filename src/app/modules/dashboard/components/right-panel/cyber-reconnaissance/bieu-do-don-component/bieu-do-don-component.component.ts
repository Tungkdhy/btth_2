import {
  ChangeDetectorRef,
  Component,
  Input,
  inject,
  OnInit,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AccumulationAnnotationService,
  AccumulationChartModule,
  AccumulationDataLabelService,
  AccumulationLegendService,
  AccumulationTooltipService,
  AxisModel,
  BarSeriesService,
  CategoryService,
  ChartModule,
  ColumnSeriesService,
  DataLabelService,
  DateTimeService,
  LegendService,
  LegendSettingsModel,
  LineSeriesService,
  MultiColoredLineSeriesService,
  ParetoSeriesService,
  PieSeriesService,
  SplineAreaSeriesService,
  SplineSeriesService,
  StackingColumnSeriesService,
  StackingLineSeriesService,
  StepLineSeriesService,
  TooltipService,
  TooltipSettingsModel,
} from '@syncfusion/ej2-angular-charts';
import { SupabaseService } from '../../../../services/supabase.service';
import { PayloadChannelData } from '../../../../models/payload-channel';
import { formatDateTime } from 'src/app/_metronic/layout/core/common/common-utils';
import { SupabaseGiamSatService } from '../../../shared/information-warface/monitoring-target/services/supabase.service';
@Component({
  selector: 'app-bieu-do-don-component',
  standalone: true,
  providers: [
    AccumulationDataLabelService,
    AccumulationTooltipService,
    AccumulationLegendService,
    AccumulationAnnotationService,
    CategoryService,
    DataLabelService,
    BarSeriesService,
    LegendService,
    TooltipService,
    CategoryService,
    LineSeriesService,
    StepLineSeriesService,
    SplineSeriesService,
    StackingLineSeriesService,
    DateTimeService,
    SplineAreaSeriesService,
    MultiColoredLineSeriesService,
    ParetoSeriesService,
    ColumnSeriesService,
  ],
  imports: [CommonModule, AccumulationChartModule, ChartModule],
  templateUrl: './bieu-do-don-component.component.html',
  styleUrls: ['./bieu-do-don-component.component.scss'],
})
export class BieuDoDonComponentComponent implements OnInit {
  get payload(): any {
    return this._payload;
  }

  @Input() set payload(value: any) {
    this._payload = value;
  }
  private _payload: PayloadChannelData;
  @Output() popupToggled = new EventEmitter<{
    isPopupVisible: boolean;
    typePopup: string;
  }>();

  // article correlation bar
  public articleCorrelationData?: Promise<any[]>;
  public articleCorrelationDataDetail?: Promise<any[]>;
  public articleCorrelationPrimaryXAxis: AxisModel;
  public articleCorrelationPrimaryYAxis: AxisModel;
  public articleCorrelationTooltip: TooltipSettingsModel;
  articleCorrelationPalette: string[];
  public articleCorrelationMarker: Object;
  public articleCorrelationColorMapping: Object;

  // target correlation donut var
  public targetCorrelationData?: Promise<any[]>;
  public targetCorrelationDataDetail?: Promise<any[]>;
  public targetCorrelationDataLabel: Object;
  public enableSmartLabels: boolean;
  public accumulationLegendSettings: LegendSettingsModel;
  public targetCorrelationColors: string[] = [
    '#045E2B',
    '#940808',
    '#BD0A0A',
    '#D00B0B',
    '#E05C5C',
    '#E98F8F',
  ];
  public relatedTargetTitle: string;

  private supabaseGiamSatService = inject(SupabaseGiamSatService);
  private supabaseService = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);

  public chartData?: any; // line graph
  // public primaryXAxisLine?: Object;
  primaryXAxisLine = {
    valueType: 'DateTime',
    labelFormat: 'dd/MM',
    intervalType: 'Days',
    majorGridLines: { width: 0 },
    interval: 1,
    edgeLabelPlacement: 'Shift',
    labelIntersectAction: 'Rotate45',
    labelStyle: {
      size: '2rem', // Change this to the desired font size
      fontWeight: 'bold', // Make the labels bold
    },
    plotOffsetRight: 25,
    plotOffsetLeft: 5,
  };

  public titleLine?: string;
  public markerLine?: Object;
  // public primaryYAxisLine?: Object;
  primaryYAxisLine = {
    minimum: 0,
    title: '',
    labelFormat: '{value}',
    labelStyle: {
      size: '2rem', // Change this to the desired font size
      fontWeight: 'bold', // Make the labels bold
    },
    plotOffsetTop: 15,
    // Display y-axis values
  };

  constructor() {}

  ngOnInit() {
    this.updateData();

    this.initialArticleCorrelationSettings();
    this.initialAccumulationSettings();

    // const today = new Date();
    // const days: any = [];
    // for (let i = 6; i >= 0; i--) {
    //   const oneday = new Date(today);
    //   oneday.setDate(today.getDate() - i);
    //   const formattedOneday = formatDateTime(oneday).split(' ')[0];
    //   days.push(`${formattedOneday}`);
    // }

    this.markerLine = {
      visible: true,
      width: 10,
      height: 10,
      shape: 'Diamond',
      dataLabel: {
        visible: true,
        position: 'Outer', // You can also set 'Middle', 'Bottom', etc.
        font: {
          fontWeight: '600',
          color: '#000000', // Text color
          size: '2rem',
          margin: { top: 10, right: 10 },
          // Text size}
        },
        template: '<div style="margin-bottom: 0.5em">${point.y}</div>',
      },
      margin: { top: 10, right: 10 },
      //
      position: 'Outside',
    };
    // this.chartData = days.map((day: any) => ({
    //   x: day,
    //   y: Math.floor(Math.random() * (30 - 20 + 1)) + 20,
    // }));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.payload &&
      !changes.payload.firstChange &&
      this.isDatePayload(changes.payload.currentValue)
    ) {
      this.updateData();
    }

    // togglePopup(open: boolean, type: string) {
    //   this.popupToggled.emit({ open, type });
    // }
  }
  togglePopup(isPopupVisible: boolean, typePopup: string) {
    this.popupToggled.emit({ isPopupVisible, typePopup });
  }

  private updateData() {
    const { startDate, endDate } = this.getDateRangeFromPayload();

    // this.chartData = this.supabaseService
    //   .tctt_ty_le_bai_viet_tieu_cuc(startDate, endDate)
    //   .finally(() => this.cdr.markForCheck());

    // Fetch chart data from the service
    // this.supabaseService
    //   .tctt_ty_le_bai_viet_tieu_cuc(startDate, endDate)
    //   .then((data) => {
    //     // Process data to add dynamic marker configuration
    //     this.chartData = data.map((item: any) => {
    //       return {
    //         ...item,
    //         markerLine: item.highlight
    //           ? {
    //               visible: true,
    //               shape: 'Diamond',
    //               fill: 'red',
    //             }
    //           : {
    //               visible: true,
    //               shape: 'Circle',
    //               fill: 'blue',
    //             },
    //       };
    //     });

    //     // Check the processed data for correct marker assignment
    //     console.log(this.chartData);

    //     // Trigger change detection manually if needed
    //     this.cdr.markForCheck();
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching chart data: ', error);
    //   })
    //   .finally(() => {
    //     this.cdr.markForCheck();
    //   });

    // this.articleCorrelationData = this.supabaseService
    //   .tctt_tuong_quan_bai_viet(startDate, endDate)
    //   .finally(() => {
    //     this.articleCorrelationData!.then((data) => {
    //       // Function to assign colors based on index or some other logic
    //       const assignColor = (index: number): string => {
    //         const colors = [
    //           'rgb(28,213,103)',
    //           'rgba(189, 10, 10, 1)',
    //           'rgba(148, 8, 8, 1)',
    //           'rgba(114, 6, 6, 1)',
    //           'rgb(89,1,1)',
    //           'rgb(70,3,3)',
    //           'rgb(124,68,68)',
    //         ]; // Example colors
    //         return colors[index % colors.length];
    //       };

    //       // Add color property to each item
    //       const dataWithColors = data.map((item, index) => ({
    //         ...item,
    //         color: assignColor(index),
    //       }));
    //       this.articleCorrelationData = Promise.resolve(dataWithColors);
    //       this.cdr.markForCheck();
    //     });

    //     this.cdr.markForCheck();
    //   });

    this.targetCorrelationData = this.supabaseGiamSatService
      .tctt_tuong_quan_muc_tieu('0')
      .finally(() => this.cdr.markForCheck());

    // chi tiết tương quan mục tiêu
    this.supabaseGiamSatService
      .tctt_chi_tiet_doi_tuong()
      .then((data) => (this.targetCorrelationDataDetail = data))
      .finally(() => this.cdr.markForCheck());
  }

  private getDateRangeFromPayload(): { startDate: any; endDate: any } {
    const today = new Date();
    const oneday = new Date(today);
    oneday.setDate(today.getDate() - 1);
    const formattedToday = formatDateTime(today).split(' ')[0];
    console.log(formattedToday);
    const formattedOneday = formatDateTime(oneday).split(' ')[0];
    const defaultDate = {
      startDate: formattedOneday,
      endDate: formattedToday,
    };
    console.log('default Date', defaultDate);
    if (!this.payload || !this.payload.payload.data) {
      return defaultDate;
    }
    const { startDate, endDate } = this.payload.payload.data;
    const formattedStartDate = startDate
      ? formatDateTime(new Date(startDate)).split(' ')[0]
      : formattedOneday;
    const formattedEndDate = endDate
      ? formatDateTime(new Date(endDate)).split(' ')[0]
      : formattedToday;
    return {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
  }

  // kiểm tra sự kiện phải Date từ mid sang right
  private isDatePayload(payload: any): boolean {
    return payload && payload.payload.type === 'Date';
  }

  initialArticleCorrelationSettings() {
    this.articleCorrelationPalette = ['#045E2B'];

    this.articleCorrelationPrimaryXAxis = {
      valueType: 'Category',
      title: '',
      labelStyle: {
        size: '2rem',
        fontWeight: 'bold',
      },
    };
    this.articleCorrelationColorMapping = 'color';

    this.articleCorrelationMarker = {
      dataLabel: {
        visible: true,
        position: 'Middle', // You can also set 'Middle', 'Bottom', etc.
        font: {
          fontWeight: 'bold',
          color: '#ffffff', // Text color
          size: '2.5rem', // Text size
        },
        template: '<div>${point.y} bài viết</div>', // Custom template for data label
      },
    };
    this.articleCorrelationTooltip = {
      enable: true,
      textStyle: {
        size: '20px',
        textAlignment: 'Center',
      },
    };
  }
  initialAccumulationSettings() {
    this.accumulationLegendSettings = {
      shapeHeight: 20,
      shapeWidth: 20,
      itemPadding: 30,
      alignment: 'Center',
      textStyle: {
        size: '2rem',
        textAlignment: 'Center',
      },
    };

    this.targetCorrelationDataLabel = {
      visible: true,
      name: 'text',
      position: 'Outside',
      template:
        '<div class=\'fw-bold\' style="font-size: 2.5rem;">${point.percentage}%</div>',
    };
  }
}
