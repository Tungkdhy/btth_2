import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { SupabaseProtectingTargetService } from '../protecting-target-modal/services/supabase.service';
import { FormsModule } from '@angular/forms';
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
  ILegendRenderEventArgs,
  ITextRenderEventArgs,
  LegendService,
  LegendSettingsModel,
  LineSeriesService,
  MultiColoredLineSeriesService,
  ParetoSeriesService,
  SplineAreaSeriesService,
  SplineSeriesService,
  StackingLineSeriesService,
  StepLineSeriesService,
  TooltipService,
} from '@syncfusion/ej2-angular-charts';
import {
  formatDatePosition,
  formatNumberWithDot,
} from 'src/app/_metronic/layout/core/common/common-utils';

@Component({
  selector: 'app-protecting-target-information',
  templateUrl: './protecting-target-information.component.html',
  styleUrls: ['./protecting-target-information.component.scss'],
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
  imports: [FormsModule, CommonModule, AccumulationChartModule, ChartModule],
  standalone: true,
})
export class ProtectingTargetInformationComponent implements OnInit, OnChanges {
  @Input() startDate!: string;
  @Input() endDate!: string;
  @Input() id!: string;

  public donutChartData: any;
  public donutMonitorChartData: any[] = [];
  public selectedSystem: string = 'platform' || 'spyder' || 'ct86';
  public accumulationLegendSettings: LegendSettingsModel;
  public targetColors: string[] = [
    '#850000',
    '#FF0B0B',
    '#E90000',
    '#C70000',
    '#A60000',
    '#8B0000',
    '#900000',
  ];
  public targetCorrelationDataLabel: Object;
  public targetCenterLabel?: Object;
  public dateOptions = [
    { value: '-1', label: '7 ngày gần nhất' },
    { value: '0', label: '30 ngày gần nhất' },
    { value: '1', label: 'Theo ngày' },
    { value: '2', label: 'Theo tuần' },
    { value: '3', label: 'Theo tháng' },
    { value: '4', label: 'Theo năm' },
  ];

  public donutDataLabel: Object;
  public donutColors: string[];
  public donutTitle: string;
  public donutlegendSettings: Object;
  public enableSmartLabels: Object;
  public centerLabel?: Object;
  public primaryXAxis: AxisModel;
  public primaryYAxis: AxisModel;
  public sacThaiMarker: any;

  public border: Object = {
    width: 2,
    radius: 10, // Apply border-radius here
  };
  colorChart: string;
  /*----------------*/
  public lineChartData: any[] = [];
  public titleLine?: string;
  public primaryXAxisLine: AxisModel;
  public primaryYAxisLine: AxisModel;
  public markerLine?: Object;
  public selectedDateOption: string = '-1';

  private supabaseService = inject(SupabaseProtectingTargetService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {}

  async ngOnInit(): Promise<any> {
    this.selectedSystem = 'platform';

    this.colorChart = this.getCssVariable('body', '--colorText');
    // Method to get the CSS variable value from a specific element
    this.donutDataLabel = {
      visible: true,
      name: 'text',
      position: 'Outside',
      template:
        '<div class=\'fw-bold custom-color-text\' style="font-size: 2em;">${point.percentage}%</div>',
    };
    this.enableSmartLabels = true;
    this.donutColors = ['#045E2B', '#1D85E7', '#D00B32'];
    this.donutlegendSettings = {
      visible: true,
      position: 'Bottom',
      textStyle: {
        size: '2em',
        textAlignment: 'Center',
        color: this.colorChart,
      },
      shapeWidth: 30,
      shapeHeight: 30,
      itemPadding: 40,
    };

    this.initialAccumulationSettings();

    this.cdr.detectChanges();

    /*------------------------- */
    this.primaryXAxisLine = {
      valueType: 'Category',
      majorGridLines: { width: 0 },
      interval: 1,
      edgeLabelPlacement: 'Shift',
      labelIntersectAction: 'Rotate45',
      labelStyle: {
        size: '2rem', // Change this to the desired font size
        fontWeight: 'bold',
        color: 'red', // Make the labels bold
      },
      plotOffsetRight: 25,
      plotOffsetLeft: 5,
    };

    // public primaryYAxisLine?: Object;
    this.primaryYAxisLine = {
      visible: false,
      minimum: 0,
      // interval: "auto,
      title: '',
      labelFormat: '{value}',
      labelStyle: {
        size: '1.5rem', // Change this to the desired font size
        fontWeight: 'bold',
        textAlignment: 'Near',
        color: this.colorChart, // Make the labels bold
      },
      rangePadding: 'Additional',
      plotOffsetTop: 10, // Add space at the top
      plotOffsetBottom: 10,
      placeNextToAxisLine: true,
      // Display y-axis values
    };
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
          color: '#ffffff', // Text color
          size: '2rem',
          margin: { top: 10, right: 10 },
          // Text size}
        },
      },
      margin: { top: 10, right: 10 },
      //
      position: 'Outside',
    };

    await this.updateChartData(this.selectedSystem);
    await this.updateLineChartData();
  }

  async handleRadioChange(selectedOption: string) {
    this.selectedSystem = selectedOption;

    // Implement your logic based on the selected option
    await this.updateChartData(selectedOption);
  }

  async updateChartData(system?: string) {
    this.donutChartData = await this.supabaseService
      .tctt_sac_thai_muc_tieu_bao_ve(this.id!, this.selectedDateOption, system!)
      .then((data: any) => {
        this.centerLabel = {
          text: `${formatNumberWithDot(data.centerLabel)}`,
          textStyle: {
            fontWeight: '700',
            size: '30px',
          },
        };
        return data;
      })
      .finally(() => this.cdr.markForCheck());

    this.donutMonitorChartData = await this.supabaseService
      .tctt_sac_thai_muc_tieu_bao_ve_theo_nen_tang(
        this.id!,
        this.selectedDateOption,
        system!,
      )
      .then((data) => {
        const totalY = data?.reduce(
          (sum: any, item: any) => sum + item.tongtinbai,
          0,
        );
        this.targetCenterLabel = {
          tooltip: { enable: true },
          text: `${formatNumberWithDot(totalY)}`,
          textStyle: {
            fontWeight: '700',
            size: '2em',
          },
        };
        return data?.filter((item: any) => item.tongtinbai !== 0);
      })
      .finally(() => this.cdr.markForCheck());
  }

  async updateLineChartData() {
    this.lineChartData = await this.supabaseService
      .tctt_xu_huong_tieu_cuc_theo_muc_tieu_bao_ve(
        this.id!,
        this.selectedDateOption,
      )
      .then((data) => {
        this.cdr.markForCheck();
        return data?.map((item: any) => ({
          ...item,
          ngay: item?.ngay,
          markerLine: item?.highlight
            ? {
                visible: true,
                shape: 'Diamond',
                fill: 'red',
              }
            : {
                visible: true,
                shape: 'Circle',
                fill: 'blue',
              },
        }));
      })
      .finally(() => this.cdr.markForCheck());
  }

  private getCssVariable(selector: string, variable: string): string {
    const element = document.querySelector(selector);
    if (element) {
      return getComputedStyle(element).getPropertyValue(variable).trim();
    }
    return '';
  }

  public legendRender(args: ILegendRenderEventArgs, data: any[]): void {
    if (data && data.length > 0) {
      const currentItem = data.find((item) => item['nentang'] === args.text);
      if (currentItem) {
        if (currentItem['nentang'] === 'Các trang báo điện tử') {
          args.text = `Báo điện tử: ${currentItem['tongtinbai']}`;
        } else {
          args.text = `${currentItem['nentang']}: ${currentItem['tongtinbai']}`;
        }
      }
    }
  }

  initialAccumulationSettings() {
    this.accumulationLegendSettings = {
      margin: { left: 20, right: 20 },
      width: 'fit-content',
      shapeHeight: 30,
      shapeWidth: 30,
      itemPadding: 40,
      alignment: 'Center',
      textStyle: {
        size: '2rem',
        textAlignment: 'Center',
        color: this.colorChart,
      },
      position: 'Bottom',
    };

    this.targetCorrelationDataLabel = {
      visible: true,
      name: 'text',
      position: 'Outside',
      template:
        '<div class=\'fw-bold custom-color-text\' style="font-size: 2rem;">${point.percentage}%</div>',
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if any input properties have changed
    console.log('Changes: ', changes);
  }

  private convertFormatDateTime(value: string) {
    const dateObj = new Date(value);

    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');

    return `${day}-${month}`;
  }

  // public textRender(args: ITextRenderEventArgs | any): void {
  //   if (
  //     this.convertFormatDateTime(this.startDate) === args.point.x ||
  //     this.convertFormatDateTime(this.endDate) === args.point.x
  //   ) {
  //     args.border = {
  //       width: 1.5,
  //       color: 'yellow',
  //     };
  //     args.color = 'yellow';
  //   }
  //   if (args.text === '0') {
  //     args.text = '';
  //   }
  // }

  onOptionChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedDateOption = selectedValue;
    this.updateChartData(this.selectedSystem);
    this.updateLineChartData();
  }
}
