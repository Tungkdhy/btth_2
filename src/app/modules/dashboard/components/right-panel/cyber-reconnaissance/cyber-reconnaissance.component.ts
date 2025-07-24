import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { Observable, startWith, Subscription, filter } from 'rxjs';

import {
  selectDate,
  selectEndDate,
  selectStartDate,
} from '../../../../../store/date-time-range/date-time-range.selectors';
import {
  ChartModule,
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
  DataLabelService,
  BarSeriesService,
  LegendService,
  TooltipService,
  LegendSettingsModel,
  AxisModel,
  TooltipSettingsModel,
  StackingColumnSeriesService,
} from '@syncfusion/ej2-angular-charts';
import { ChartOptions } from 'src/app/core/models/apex-chart-options.model';
import {
  KGMPieData,
  BTLPieData,
  uploadPostData,
  targetData,
  muctieubaoveDetail,
} from './datasource';
import {
  AccumulationChartModule,
  AccumulationTooltipService,
  AccumulationLegendService,
  PieSeriesService,
  AccumulationAnnotationService,
  AccumulationDataLabelService,
} from '@syncfusion/ej2-angular-charts';
import { TitleStyle } from 'docx/build/file/styles/style';
import { DeviceType, SocketEventType } from '../../../models/utils-type';
import { PayloadChannel } from '../../../models/payload-channel';
import { SupabaseService } from '../../../services/supabase.service';
import { TCTTTargetType } from '../../../models/btth.type';
import { setDate } from '../../../../../store/date-time-range/date-time-range.actions';
import { DateTimeRangePickerComponent } from '../../../../../shared/date-time-range-picker/date-time-range-picker.component';
import { formatDateTime } from '../../../../../_metronic/layout/core/common/common-utils';
import { getCustomDateTime } from '../../../../../_metronic/layout/core/common/common-utils';
@Component({
  selector: 'app-cyber-reconnaissance',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule,
    AccumulationChartModule,
    DateTimeRangePickerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [
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
    PieSeriesService,
    AccumulationDataLabelService,
    AccumulationTooltipService,
    AccumulationLegendService,
    PieSeriesService,
    AccumulationLegendService,
    AccumulationTooltipService,
    AccumulationDataLabelService,
    AccumulationAnnotationService,
    ColumnSeriesService,
    CategoryService,
    DataLabelService,
    CategoryService,
    BarSeriesService,
    LegendService,
    TooltipService,
    StackingColumnSeriesService,
    TooltipService,
  ],
  templateUrl: './cyber-reconnaissance.component.html',
  styleUrls: ['./cyber-reconnaissance.component.scss'],
})
export class CyberReconnaissanceComponent implements OnInit {
  //basic color
  public basicColor: string;

  // target donut var
  public targetData?: Promise<any[]>;
  // public targetData: Object[];
  public targetDataLabel: Object;
  public targetColors: string[];
  public targetTitle: string;
  public targetlegendSettings: Object;
  public enableSmartLabels: boolean;
  public totaltargetData: number = 0;

  //collect column var
  public collectPrimaryXAxis: any;
  public collectData?: Promise<any[]>;
  public collectTitle?: string;
  collectPrimaryYAxis: any;
  public collectPointMapping: Object;
  public collectMarker: Object;
  public totalCollectData: number = 0;

  // warface column var
  public warfacePrimaryXAxis: any;
  public warfaceData?: Promise<any[]>;
  public warfaceTitle: string;
  warfacePrimaryYAxis: any;
  public warfacePalette: string[];
  public warfacePointMapping: Object;
  public totalWeaponCount: number = 0;

  // nuance donut var
  // public nuanceData: Object[];
  public nuanceData?: Promise<any[]>;
  public nuanceDataLabel: Object;
  public nuanceColors: string[];
  public nuanceTitle: string;
  public nuancelegendSettings: Object;
  public nuanceTooltip: Object;

  // post bar var
  // public articleCorrelationData?: Object[];
  public articleCorrelationData?: Promise<any[]>;
  public articleCorrelationPrimaryXAxis: AxisModel;
  public articleCorrelationPrimaryYAxis: AxisModel;
  public articleCorrelationTooltip: TooltipSettingsModel;
  articleCorrelationPalette: string[];
  public articleCorrelationMarker: Object;
  public articleCorrelationColorMapping: Object;

  // mục tiêu bảo vệ
  public baoveData?: Promise<any[]>;

  // related target donut var
  // public relatedTargetData: Object[];
  public relatedTargetData?: Promise<any[]>;
  public relatedTargetDataLabel: Object;
  public relatedTargetColors: string[] = [
    '#045E2B',
    '#05853C',
    '#379D63',
    '#58AD7C',
    '#8CC7A5',
    '#B2D9C3',
  ];
  public relatedTargetTitle: string;

  // biến biểu đồ chỉ số sắc thái
  public legendSettings: any;
  public KGMPieTitle: string;
  public BTLPieTitle: string;
  public KGMPieColor: string[];
  public accumulationLegendSettings: LegendSettingsModel;

  //hot topic column var
  public hotTopicPrimaryXAxis: any;
  public hotTopicData?: Promise<any[]>;
  // public hotTopicData: Object[];
  public hotTopicTitle: string;
  hotTopicPrimaryYAxis: any;
  public hotTopicMarker: Object;

  // upload post bar var
  public uploadPostPrimaryXAxis: any;
  public uploadPostData: Object[];
  public uploadPostTitle: string;
  uploadPostPrimaryYAxis: any;
  public uploadPostColorMapping: Object;

  // biểu đồ lc lượng UCSC
  public forcePrimaryXAxis: Object;
  public forceData?: Promise<
    { data: any[]; length: number } | { data: any[]; length: any }
  >;
  public title: string;
  fourcePrimaryYAxis: any;
  public forceLegendSettings: Object;
  public forceColors: string[];
  public total01: number = 0;
  public total02: number = 0;
  public total03: number = 0;
  public totalLucLuongCMF: number = 0;

  private supabaseService = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);
  private eventSubscription: Subscription;
  private eventSubscriptionArea: Subscription;

  startDate$: any;
  // endDate$: Observable<Date>;

  // handleSelectDate(date: {
  //   startDate: Date | undefined;
  //   endDate: Date | undefined;
  // }) {
  //   if (!date.startDate || !date.endDate) return;
  //   this.store.dispatch(
  //     setDate({ startDate: date.startDate, endDate: date.endDate }),
  //   );

  // }

  isPopupVisible: boolean = false;

  constructor(
    private readonly supabase: SupabaseService,
    private store: Store,
  ) {}

  async ngOnInit(): Promise<void> {
    this.KGMPieColor = ['#045E2B', '#F58501', '#D00B32'];
    // KGMPie
    this.KGMPieColor = ['#045E2B', '#F58501', '#D00B32'];
    this.legendSettings = {
      visible: true,
      position: 'Bottom',
      textStyle: {
        size: '2.5rem',
        textAlignment: 'Center',
      },
      shapeWidth: 30,
      shapeHeight: 30,
    };

    //   this.store.select(selectDate).subscribe({
    //   next: (date) => {
    //    console.log(date.startDate)
    //   },
    // });

    const today = new Date();
    const twoDaysAgo: Date = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 7);

    this.startDate$ = formatDateTime(twoDaysAgo).split(' ')[0];

    // lấy sự kiện chọn vùng
    // this.supabaseService.listenToChannel('regionSelected');
    // this.eventSubscriptionArea = this.supabaseService.payload$.pipe(

    // ).subscribe(
    //   (payload) => {
    //     console.log('Received event Area From Midpanel:', payload);
    //   },
    //   (error) => {
    //     console.error('Error subscribing to event Area:', error);
    //   }
    // );

    // this.subscribeToRegionSelected()
    // this.subscribeToDateSelected()
    this.initializeSubscriptions();

    this.updateData();

    // target donut var

    this.targetDataLabel = {
      visible: true,
      name: 'text',
      position: 'Outside',
      template:
        '<div class=\'fw-bold\' style="font-size: 2.5rem;">${point.percentage}%</div>',
    };
    this.enableSmartLabels = true;
    this.targetColors = ['#045E2B', '#F58501', '#16C8C7', '#1D85E7'];
    this.targetlegendSettings = {
      visible: true,
      position: 'Bottom',
      textStyle: {
        size: '2rem',
        textAlignment: 'Center',
      },
      shapeWidth: 30,
      shapeHeight: 30,
      itemPadding: 30,
    };

    // force column var

    this.forcePrimaryXAxis = {
      title: '',
      interval: 1,
      valueType: 'Category',
      labelStyle: {
        size: '2.5rem', // Change this to the desired font size
        fontWeight: 'bold',
      },
    };
    this.forceColors = ['#045E2B', '#F58501', '#16C8C7', '#1D85E7'];

    this.forceLegendSettings = {
      visible: false,
      position: 'Bottom', // Change the position to 'Top', 'Bottom', 'Left', or 'Right'
      textStyle: {
        size: '1em', // Change the font size as needed
      },
    };

    //collect column var

    this.collectPrimaryXAxis = {
      valueType: 'Category',
      title: '',
      labelStyle: {
        size: '2.5rem', // Change this to the desired font size
        fontWeight: 'bold',
      },
    };
    this.collectPointMapping = 'color';
    this.collectMarker = {
      dataLabel: {
        visible: true,
        position: 'Outer', // You can also set 'Middle', 'Bottom', etc.
        font: {
          fontWeight: 'bold',
          color: '#000000', // Text color
          size: '2rem', // Text size
        },
        template: '<div>${point.y} GB</div>', // Custom template for data label
      },
    };

    //warface bar var

    this.warfacePrimaryXAxis = {
      valueType: 'Category',
      title: '',
      labelStyle: {
        size: '2.5rem', // Change this to the desired font size
        fontWeight: 'bold', // Make the labels bold
      },
    };

    // this.warfacePointMapping = 'color'
    this.warfacePointMapping = [
      { value: 'T5', color: '#F58501' },
      { value: 'T1', color: '#1D85E7' },
      { value: 'T2', color: '#DAF7A6' },
      { value: 'T3', color: '#8b4ef5' },
    ];

    //nuance donut var
    this.nuanceDataLabel = {
      visible: true,
      name: 'text',
      position: 'Outside',
      template:
        '<div class=\'fw-bold\' style="font-size: 2.5rem;">${point.percentage}%</div>',
    };
    this.enableSmartLabels = true;
    this.nuanceColors = ['#045E2B', '#F58501', '#D00B32'];
    this.nuancelegendSettings = {
      visible: true,
      position: 'Bottom',
      textStyle: {
        size: '2rem',
        textAlignment: 'Center',
      },
      shapeWidth: 30,
      shapeHeight: 30,
      itemPadding: 40,
    };
    this.warfacePalette = ['#045E2B', '#045E2B', '#045E2B', '#045E2B'];

    // hot topic column var

    this.hotTopicPrimaryXAxis = {
      valueType: 'Category',
      title: '',
      labelStyle: {
        size: '2rem', // Change this to the desired font size
        fontWeight: 'bold',
      },
    };
    this.hotTopicMarker = {
      dataLabel: {
        visible: true,
        position: 'Outer', // You can also set 'Middle', 'Bottom', etc.
        font: {
          fontWeight: '100',
          color: '#000000', // Text color
          size: '2rem', // Text size
        },
        template: '<div>${point.y} bài viết</div>', // Custom template for data label
      },
    };

    //upload post bar var
    this.uploadPostData = uploadPostData;
    this.uploadPostPrimaryXAxis = {
      valueType: 'Category',
      title: '',
      labelStyle: {
        size: '2rem', // Change this to the desired font size
        fontWeight: 'bold', // Make the labels bold
      },
    };
    this.uploadPostColorMapping = 'color';
    this.basicColor = '#4f8e6b';

    // tq
    // @ts-ignore
    this.baoveData = this.supabase
      .tctt_muc_tieu_bao_ve()
      .finally(() => this.cdr.markForCheck());
    // @ts-ignore
    this.relatedTargetData = this.supabase
      .tctt_tuong_quan_muc_tieu()
      .finally(() => this.cdr.markForCheck());
    // this.articleCorrelationData = this.supabase.tctt_tuong_quan_bai_viet(this.startDate$).finally(() => this.cdr.markForCheck());
    // this.hotTopicData = this.supabase.tctt_thong_ke_chu_de_nong(this.startDate$).finally(() => this.cdr.markForCheck());
    // this.nuanceData = this.supabase.tctt_chi_so_sac_thai(this.startDate$).finally(() => this.cdr.markForCheck());

    // ky thuat tac chien
    // this.collectData = this.supabase.t5_dulieuthuthap().finally(() => this.cdr.markForCheck());
    this.collectData = this.supabase.t5_dulieuthuthap().finally(() => {
      this.collectData!.then((data) => {
        this.totalCollectData = data.reduce(
          (acc, item) => acc + item.result_number,
          0,
        );
        this.cdr.markForCheck();
      });
    });

    // this.warfaceData = this.supabase.t5_kythuattacchien().finally(() => this.cdr.markForCheck());
    this.warfaceData = this.supabase.t5_kythuattacchien().finally(() => {
      this.warfaceData!.then((data) => {
        this.totalWeaponCount = data.reduce((acc, item) => acc + item.count, 0);
        this.cdr.markForCheck();
      });
    });

    // this.forceData = this.supabase.t5_lucluong().finally(() => this.cdr.markForCheck());
    this.forceData = this.supabase.t5_lucluong().finally(() => {
      this.forceData!.then((data: any) => {
        this.total01 = this.total01 = this.calculateOverallTotal(data);
        console.log(this.total01);
        this.totalLucLuongCMF = data.reduce(
          (total: number, item: {}) => total + Object.keys(item).length,
          0,
        );
        console.log('luc luong', data);
        console.log(this.totalLucLuongCMF);

        this.cdr.markForCheck();
      });
    });

    // this.targetData = this.supabase.t5_muctieu().finally(() => this.cdr.markForCheck());
    this.targetData = this.supabase.t5_muctieu().finally(() => {
      this.targetData!.then((data) => {
        this.totaltargetData = data.reduce((acc, item) => acc + item.count, 0);
        this.cdr.markForCheck();
      });
    });

    this.initialArticleCorrelationSettings();
    this.initialAccumulationSettings();
  }

  calculateOverallTotal = (
    data: { data: any[]; length: number } | { data: any[]; length: any },
  ) => {
    return data.reduce((acc, item) => {
      const itemTotal = Object.keys(item)
        .filter((key) => key.startsWith('y'))
        .reduce((sum, key) => sum + item[key], 0);
      return acc + itemTotal;
    }, 0);
  };

  subscribeToEvents() {
    this.supabaseService.listenToChannel('RightEvent');
    this.eventSubscription = this.supabaseService.payload$
      .pipe(
        filter(
          (payload) => payload.event === 'RightEvent',
          startWith(this.startDate$),
        ),
      )
      .subscribe(
        (payload) => {
          // switch-case
          console.log('Nhận event từ mid:', payload);
          if (
            payload.payload.data.tctt &&
            payload.payload.data.tctt.type === 'Date'
          ) {
            // Xử lý sự kiện Date
            console.log('Date event:', payload.payload.data.tctt.startDate);
            this.startDate$ = payload.payload.data.tctt.startDate.split('T')[0];
            this.updateData();
          }

          if (
            payload.payload.data.tctt &&
            payload.payload.data.tctt.type === 'Area'
          ) {
            // Xử lý sự kiện Region
            console.log(
              'Region event:',
              payload.payload.data.tctt.selectedArea,
            );
          }
        },
        (error) => {
          console.error('Error subscribing to merged event:', error);
        },
      );
  }

  sendToMidEvent(
    channelName: string,
    eventName: string,
    type: SocketEventType = 'TCTT',
    data: any,
  ) {
    let channel: any;
    channel = this.supabase.joinChannel();
    channel.subscribe((status: string) => {
      if (status === 'SUBSCRIBED') {
        const payload: PayloadChannel = {
          socketEventType: type,
          data: data,
        };
        this.supabase.sendEvent(channel, eventName, payload);
        console.log('Event sent:', channel, eventName, payload);
      }
    });
  }

  // togglePopup(isPopupVisible: boolean, typePopup: any) {
  //   this.sendToMidEvent('MidChannel', 'RightEventPopup', 'TCTT', {
  //   tctt: {
  //     type: 'Popup',
  //     selectedPopup: isPopupVisible,
  //     muctieubaoveDetail: muctieubaoveDetail
  //   },
  // });
  // }

  togglePopup(isPopupVisible: boolean, typePopup?: string) {
    this.sendToMidEvent('MidChannel', 'RightEventPopup', 'TCTT', {
      tctt: {
        type: 'Popup',
        selectedPopup: isPopupVisible,
        typePopup: typePopup,
        muctieubaoveDetail: muctieubaoveDetail,
      },
    });
  }

  // subscribeToRegionSelected() {
  //   this.supabaseService.listenToChannel('regionChangeEvent');
  //   this.eventSubscriptionArea = this.supabaseService.payload$.pipe(
  //     filter((payload) => payload.event === 'regionChangeEvent'),
  //   ).subscribe(
  //     (payload) => {
  //       console.log('Received event Area From Midpanel:', payload);
  //       // ...
  //     },
  //     (error) => {
  //       console.error('Error subscribing to event Area:', error);
  //     }
  //   );
  // }
  // subscribeToDateSelected(){
  //   this.supabaseService.listenToChannel('dateSelected');
  //   this.eventSubscription = this.supabaseService.payload$.pipe(
  //     filter((payload) => payload.event === 'dateSelected'),
  //     startWith(this.startDate$)).subscribe(
  //     (payload) => {
  //       console.log('Received event Date From Midpanel:', payload);
  //       this.startDate$ = payload.payload.data.tctt.startDate.split('T')[0];
  //       this.updateData();
  //     },
  //     (error) => {
  //       console.error('Error subscribing to event:', error);
  //     }
  //   );

  // }

  sendMapEvent(
    channelName: string,
    eventName: string,
    type: SocketEventType = 'TCTT',
    tcttType: TCTTTargetType,
  ) {
    let channel: any;
    channel = this.supabaseService.joinChannel();
    channel.subscribe((status: string) => {
      if (status === 'SUBSCRIBED') {
        const payload: PayloadChannel = {
          socketEventType: type,
          data: {
            tctt: {
              type: tcttType,
            },
          },
        };
        this.supabaseService.sendEvent(channel, eventName, payload);
      }
    });
  }

  initializeSubscriptions() {
    // this.subscribeToDateSelected();
    // this.subscribeToRegionSelected();
    this.subscribeToEvents();
  }

  updateData() {
    this.articleCorrelationData = this.supabaseService
      .tctt_tuong_quan_bai_viet(this.startDate$)
      .finally(() => this.cdr.markForCheck());
    this.hotTopicData = this.supabaseService
      .tctt_thong_ke_chu_de_nong(this.startDate$)
      .finally(() => this.cdr.markForCheck());
    this.nuanceData = this.supabaseService
      .tctt_chi_so_sac_thai(this.startDate$)
      .finally(() => this.cdr.markForCheck());
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
      shapeHeight: 30,
      shapeWidth: 30,
      itemPadding: 30,
      alignment: 'Center',
      textStyle: {
        size: '1.8rem',
        textAlignment: 'Center',
      },
    };

    this.relatedTargetDataLabel = {
      visible: true,
      name: 'text',
      position: 'Outside',
      template:
        '<div class=\'fw-bold\' style="font-size: 2.5rem;">${point.percentage}%</div>',
    };
  }

  protected readonly KGMPieData = KGMPieData;
}
