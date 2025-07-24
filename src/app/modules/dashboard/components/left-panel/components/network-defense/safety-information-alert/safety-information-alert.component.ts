import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EChartsOption } from 'echarts';
import {
  CategoryService,
  ChartAnnotationService,
  ChartModule,
  ColumnSeriesService,
  DataLabelService,
  DateTimeService,
  LegendService,
  LegendSettingsModel,
  LineSeriesService,
  RangeColumnSeriesService,
  ScrollBarService,
  StackingColumnSeriesService,
  TooltipService,
} from '@syncfusion/ej2-angular-charts';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';
import { debounceTime, Observable, Subject, tap } from 'rxjs';
import { RealtimeChannel } from '@supabase/supabase-js';
import { TooltipModule } from '@syncfusion/ej2-angular-popups';
import { SupabaseSafeTyInformationAlertService } from './services/supabase';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { Constant } from 'src/app/core/config/constant';
import { NumberFormatPipe } from 'src/app/core/pipes/number-format/number-format.pipe';
import { ApiFilter, MainType, MapSubType, EventId } from 'src/app/modules/dashboard/models/btth.interface';
import { EventDataPayload, DataTypePayload } from 'src/app/modules/dashboard/models/payload-channel';
import { Breadcrumb, BreadcrumbIds } from 'src/app/modules/dashboard/services/breadcrumb.service';
import { SocketService } from 'src/app/modules/dashboard/services/socket.service';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';

@Component({
  selector: 'app-safety-information-alert',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule,
    NumberFormatPipe,
    NgbPagination,
    TooltipModule,
    NgxEchartsDirective
  ],
  providers: [
    CategoryService,
    DateTimeService,
    ScrollBarService,
    LineSeriesService,
    ColumnSeriesService,
    ChartAnnotationService,
    RangeColumnSeriesService,
    StackingColumnSeriesService,
    LegendService,
    TooltipService,
    DataLabelService,
    provideEcharts()
  ],
  templateUrl: './safety-information-alert.component.html',
  styleUrls: ['./safety-information-alert.component.scss'],
})
export class SafetyInformationAlertComponent implements OnInit {
  @Output() popupToggled = new EventEmitter<{
    isPopupVisible: boolean;
    typePopup: string;
    alertType: string;
  }>();
  private colorChart: any;

  togglePopup(isPopupVisible: boolean, typePopup: string) {
    this.popupToggled.emit({
      isPopupVisible,
      typePopup,
      alertType: this.alertType,
    });
  }

  page = 1;
  pageSize = 3;
  total = 0;
  columnName: string = '';
  xuLyType: string = '';

  private eventSubject = new Subject<any>();

  eventListPromise: Promise<any>;
  disconnectedListPromise: Promise<any>;
  private channel: RealtimeChannel;

  // biểu đồ sự cố hạ tầng
  public columnData: Object[] = [];
  private intervalId: any;

  canhBaoSuCoATTT: any;
  public malware_daxuly: Object[] = [];
  public black_domain_daxuly: Object[] = [];
  public internet_daxuly: Object[] = [];
  public hunting_daxuly: Object[] = [];

  public primaryXAxis: Object = [];
  public primaryYAxis: Object = [];
  public legendSettings: LegendSettingsModel;
  public dataLabel: Object = [];
  public marker: Object;

  public countDaXuLyChartSuCoATTT: number = 0;
  public countDangXuLyChartSuCoATTT: number = 0;
  public countChuaXuLyChartSuCoATTT: number = 0;

  public summaryMalware: any = {};
  public summaryBlackDomain: any = {};
  public summaryInternet: any = {};
  public summaryHunting: any = {};

  @Input() alertType: string = '';
  @Input() mainType: string = '';
  @Input() subType: string = '728';
  @Input() regionType: string = '';
  @Input() startDate: string = '';
  @Input() endDate: string = '';

  public border: Object = {
    width: 2,
    radius: 10, // Apply border-radius here
  };

  private getCssVariable(selector: string, variable: string): string {
    const element = document.querySelector(selector);
    if (element) {
      return getComputedStyle(element).getPropertyValue(variable).trim();
    }
    return '';
  }

  onTextRender(args: any): void {
    const point = args.point;
    // args.text = `${this.getValueDaXuLySuCoATTT(
    //   this.canhBaoSuCoATTT,
    //   this.getAlertTypeByName(point?.x),
    // )}/${this.getValueDangXuLySuCoATTT(
    //   this.canhBaoSuCoATTT,
    //   this.getAlertTypeByName(point?.x),
    // )}/${this.getValueChuaXuLySuCoATTT(
    //   this.canhBaoSuCoATTT,
    //   this.getAlertTypeByName(point?.x),
    // )}`; // Hiển thị 2 nhãn

    args.text = `${this.getValueDangVaChuaSuCoATTT(
      this.canhBaoSuCoATTT,
      this.getAlertTypeByName(point?.x),
    )}`;
  }
  async ngOnChanges(changes: SimpleChanges) {
    this.resetInterval();

    let subType = Constant.SUB_TYPE_DEVICE.ALL;

    if (changes?.startDate?.currentValue && changes?.endDate?.currentValue) {
      if (this.subType == Constant.SUB_TYPE_DEVICE.ALL) {
        if (changes?.mainType?.currentValue == Constant.MAIN_TYPE.QS) {
          subType = Constant.SUB_TYPE_DEVICE.QS_QP;
        } else if (changes?.mainType?.currentValue == Constant.MAIN_TYPE.CD) {
          subType = Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA;
        }
      } else {
        subType = this.subType;
      }
      this.getDanhSachCanhBao(
        '',
        this.mainType,
        subType,
        this.alertType,
        this.convertService.getRegionType(this.regionType),
        null,
        '',
        '',
        this.xuLyType,
        1,
        3,
        this.startDate,
        this.endDate,
      );
      await this.getDataChart(
        this.mainType,
        subType,
        this.convertService.getRegionType(this.regionType),
        this.startDate,
        this.endDate,
      );
    } else if (changes?.subType?.currentValue) {
      this.getDanhSachCanhBao(
        '',
        this.mainType,
        changes?.subType?.currentValue,
        this.alertType,
        this.convertService.getRegionType(this.regionType),
        null,
        '',
        '',
        this.xuLyType,
        1,
        3,
        this.startDate,
        this.endDate,
      );
        await this.getDataChart(
          this.mainType,
          changes?.subType?.currentValue,
          this.convertService.getRegionType(this.regionType),
          this.startDate,
          this.endDate,
        );
    } else if (
      changes?.mainType?.currentValue ||
      changes?.mainType?.currentValue == ''
    ) {
      let subType = Constant.SUB_TYPE_DEVICE.ALL;

      if (this.subType == Constant.SUB_TYPE_DEVICE.ALL) {
        if (changes?.mainType?.currentValue == Constant.MAIN_TYPE.QS) {
          subType = Constant.SUB_TYPE_DEVICE.QS_QP;
        } else if (changes?.mainType?.currentValue == Constant.MAIN_TYPE.CD) {
          subType = Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA;
        }
      } else {
        subType = this.subType;
        if (changes?.mainType?.currentValue == Constant.MAIN_TYPE.QS) {
          subType = Constant.SUB_TYPE_DEVICE.QS_QP;
        } else if (changes?.mainType?.currentValue == Constant.MAIN_TYPE.CD) {
          subType = Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA;
        }
      }
      this.getDanhSachCanhBao(
        '',
        this.mainType,
        subType,
        this.alertType,
        this.convertService.getRegionType(this.regionType),
        null,
        '',
        '',
        this.xuLyType,
        1,
        3,
        this.startDate,
        this.endDate,
      );
      await this.getDataChart(
        this.mainType,
        subType,
        this.convertService.getRegionType(this.regionType),
        this.startDate,
        this.endDate,
      );
    } else if (changes?.regionType?.currentValue) {
      this.getDanhSachCanhBao(
        '',
        this.mainType,
        this.subType,
        this.alertType,
        this.convertService.getRegionType(this.regionType),
        null,
        '',
        '',
        this.xuLyType,
        1,
        3,
        this.startDate,
        this.endDate,
      );
      await this.getDataChart(
        this.mainType,
        this.subType,
        this.convertService.getRegionType(this.regionType),
        this.startDate,
        this.endDate,
      );
    } else {
      this.getDanhSachCanhBao(
        '',
        this.mainType,
        this.subType,
        this.alertType,
        this.convertService.getRegionType(this.regionType),
        null,
        '',
        '',
        this.xuLyType,
        1,
        3,
        this.startDate,
        this.endDate,
      );

      await this.getDataChart(
        this.mainType,
        this.subType,
        this.convertService.getRegionType(this.regionType),
        this.startDate,
        this.endDate,
      );
    }
  }
  constructor(
    private supabase: SupabaseSafeTyInformationAlertService,
    private supabaseService: SupabaseService,
    private socket: SocketService,
    private convertService: ConvertServiceComponent,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit(): Promise<void> {
    // biểu đồ sự cố hạ tầng ứng dụng dich v
    this.colorChart = this.getCssVariable('body', '--colorText');

    this.primaryXAxis = {
      majorGridLines: { width: 0 },
      minorGridLines: { width: 0 },
      majorTickLines: { width: 0 },
      minorTickLines: { width: 0 },
      interval: 1,
      lineStyle: { width: 0 },
      valueType: 'Category',
      labelStyle: {
        size: '2rem',
        color: this.colorChart,
      },
    };
    this.primaryYAxis = {
      minimum: 0,
      title: '',
      // labelFormat: '{value}',
      labelStyle: {
        size: '2rem', // Change this to the desired font size
        fontWeight: 'bold', // Make the labels bold
      },
      rangePadding: 'None',
      plotOffsetTop: 15,
      visible: false,
    };

    this.legendSettings = {
      visible: true,
      position: 'Right',
      shapeWidth: 30,
      shapeHeight: 30,
      opacity: 5,
      // Change the position to 'Top', 'Bottom', 'Left', or 'Right'
      textStyle: {
        size: '2.5rem', // Change the font size as needed
        color: this.colorChart,
      },
    };
    this.dataLabel = {
      visible: true,
      position: 'Top',
      font: {
        fontWeight: '600',
        color: this.colorChart,
        size: '2rem',
      },
    };

    this.marker = {
      visible: false,
      dataLabel: this.dataLabel,
    };

    // this.channel = this.supabase
    //   .getSupabase()
    //   .channel('schema-db-changes')
    //   .on(
    //     'postgres_changes',
    //     { event: '*', schema: 'btth', table: 'security_event' },
    //     async (payload: any) => {
    //       this.eventSubject.next(payload);
    //     },
    //   )
    //   .subscribe();

    // this.eventSubject
    //   .pipe(
    //     debounceTime(60 * 1000), // Điều chỉnh thời gian debounce theo nhu cầu
    //   )
    //   .subscribe(async (payload) => {
    //     this.getDanhSachCanhBao(
    //       '',
    //       this.mainType,
    //       this.subType,
    //       '',
    //       this.convertService.getRegionType(this.regionType),
    //       null,
    //       '','',
    //       1,
    //       3,
    //       this.startDate,
    //       this.endDate,
    //     );

    //     await this.getDataChart(
    //       this.mainType,
    //       this.subType,
    //       this.convertService.getRegionType(this.regionType),
    //       this.startDate,
    //       this.endDate,
    //     );
    //   });
  }

  resetInterval() {
    // Clear the existing interval

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Set a new interval
    let interval = setInterval(async () => {
      this.getDanhSachCanhBao(
        '',
        this.mainType,
        this.subType,
        this.alertType,
        this.convertService.getRegionType(this.regionType),
        null,
        '',
        '',
        this.xuLyType,
        this.page,
        this.pageSize,
        this.startDate,
        this.endDate,
      );

      await this.getDataChart(
        this.mainType,
        this.subType,
        this.convertService.getRegionType(this.regionType),
        this.startDate,
        this.endDate,
      );
    }, Constant.TIME_INTERVAL_LEFT_PANEL);

    this.intervalId = interval;
  }

  ngOnDestroy() {
    this.supabase.getSupabase().removeChannel(this.channel);
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  barChartOption: EChartsOption = {
    grid: {
      left: '5px', 
      right: 0, 
      top: '18%',  
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
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      axisLine: { show: false }, // Ẩn đường trục X
      axisTick: { show: false }, // Ẩn vạch nhỏ trên trục X
      axisLabel: { show: true, fontSize: 18, fontWeight: 500, color: '#000' },
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Sales',
        type: 'bar',
        data: [20, 15, 10, 16, 17],
        barWidth: '50%',
        label: {
          show: true, 
          position: 'top',
          fontSize: 18,
          fontWeight: 500,
          color: '#000'
        },
        itemStyle: {
          borderRadius: [8, 8, 8, 8], 
          color: 'rgba(210, 0, 26, 1)'
        }
      }
    ]
  };

  async onPageChange(page: number) {
    this.page = page;
    this.getDanhSachCanhBao(
      '',
      this.mainType,
      this.subType,
      this.alertType,
      this.convertService.getRegionType(this.regionType),
      null,
      '',
      '',
      this.xuLyType,
      page,
      this.pageSize,
      this.startDate,
      this.endDate,
    );
    this.cdr.detectChanges();
  }
  async getDanhSachCanhBao(
    source_mac: any = null,
    main_type: any,
    sub_type: any,
    column_type: string = '',
    loploi: any = '',
    lopbien: any = '',
    searchText: string = '',
    alertSource: string = '',
    xuLy: string = '',
    page_index: number = 1,
    page_size: number = 3,
    from: any = '',
    to: any = '',
  ) {
    this.page = page_index;
    this.pageSize = page_size;
    this.eventListPromise = this.supabaseService.getDanhSachCanhBao(
      source_mac,
      main_type,
      sub_type,
      column_type,
      loploi,
      lopbien,
      searchText,
      alertSource,
      xuLy,
      page_index,
      page_size,
      from,
      to,
    );
  }

  // async getDanhSachCanhBaoToMap(
  //   source_mac: any = null,
  //   main_type: any,
  //   sub_type: any,
  //   column_type: string = '',
  //   loploi: any = '',
  //   from: any = '',
  //   to: any = '',
  //   page_index: number = 1,
  //   page_size: number = 999999,
  // ) {
  //   return await this.supabaseService.getDanhSachCanhBao(
  //     source_mac,
  //     main_type,
  //     sub_type,
  //     column_type,
  //     loploi,
  //     null,
  //     '',
  //     null,
  //     null,
  //     page_index,
  //     page_size,
  //     from,
  //     to,
  //   );
  // }
  getAlertTypeByName(name: string) {
    let key: any = {
      [Constant.SU_CO_ATTT_TYPE.INTERNET]: 'INTERNET',
      [Constant.SU_CO_ATTT_TYPE.BLACK_DOMAIN]: 'BLACK_DOMAIN',
      [Constant.SU_CO_ATTT_TYPE.MALWARE]: 'MALWARE',
      [Constant.SU_CO_ATTT_TYPE.HUNTING]: 'HUNTING',
    };
    return key[name];
  }

  async onClickKetQuaXuLy(xuly: string) {
    this.xuLyType = xuly;
    this.getDanhSachCanhBao(
      '',
      this.mainType,
      this.subType,
      this.alertType,
      this.convertService.getRegionType(this.regionType),
      null,
      '',
      '',
      this.xuLyType,
      1,
      3,
      this.startDate,
      this.endDate,
    );
    this.cdr.detectChanges();
  }

  async axisLabelClick(event: any) {
    this.columnName = event?.text; // this.getValueColumnName(event.point.series.properties.stackingGroup);
    this.alertType = this.getAlertTypeByName(event?.text);
    this.xuLyType = '';
    this.clickPointChart();
  }
  async onClickChartSuCoATTT(event: any) {
    this.columnName = event.point.x; // this.getValueColumnName( event.point.series.properties.stackingGroup);
    this.alertType = this.getAlertTypeByName(this.columnName);
    this.xuLyType = '';
    this.clickPointChart();
  }

  clickPointChart() {
    this.countDaXuLyChartSuCoATTT = this.getValueDaXuLySuCoATTT(
      this.canhBaoSuCoATTT,
      this.alertType,
    );
    this.countDangXuLyChartSuCoATTT = this.getValueDangXuLySuCoATTT(
      this.canhBaoSuCoATTT,
      this.alertType,
    );
    this.countChuaXuLyChartSuCoATTT = this.getValueChuaXuLySuCoATTT(
      this.canhBaoSuCoATTT,
      this.alertType,
    );
    this.getDanhSachCanhBao(
      null,
      this.mainType,
      this.subType,
      this.alertType,
      this.convertService.getRegionType(this.regionType),
      null,
      '',
      '',
      this.xuLyType,
      1,
      3,
      this.startDate,
      this.endDate,
    );

    // this.togglePopup(true, 'SAFETY_INFORMATION_ALERT');
    this.cdr.detectChanges();
  }
  getValueColumnName(name: string): string {
    return this.convertService.getTypeSecurity(name);
  }

  async reset() {
    if (this.columnName.length > 0 || this.alertType.length > 0 || this.xuLyType.length > 0) {
      this.xuLyType = '';
      this.alertType = '';
      this.columnName = '';
      this.getDanhSachCanhBao(
        '',
        this.mainType,
        this.subType,
        '',
        this.convertService.getRegionType(this.regionType),
        null,
        '',
        '',
        this.xuLyType,
        1,
        3,
        this.startDate,
        this.endDate,
      );

      await this.getDataChart(
        this.mainType,
        this.subType,
        this.convertService.getRegionType(this.regionType),
        this.startDate,
        this.endDate,
      );
    }

    this.cdr.detectChanges();
  }
  async getDataChart(
    main_type: any,
    sub_type: any,
    regionType: any,
    from: any = '',
    to: any = '',
  ) {
    this.canhBaoSuCoATTT = await this.supabase.getThongKeCanhBao(
      main_type,
      sub_type,
      regionType,
      from,
      to,
    );

    this.countDangXuLyChartSuCoATTT = 0;
    this.countChuaXuLyChartSuCoATTT = 0;
    this.countDaXuLyChartSuCoATTT = 0;

    for (let i = 0; i < this.canhBaoSuCoATTT.length; i++) {
      if (
        this.alertType ? this.alertType == this.canhBaoSuCoATTT[i].sys : true
      ) {
        // Duyệt qua mảng con 'data' bên trong từng đối tượng
        for (let j = 0; j < this.canhBaoSuCoATTT[i]?.data.length; j++) {
          let subItem = this.canhBaoSuCoATTT[i]?.data[j];
          if (subItem?.xuly === 'Đã xử lý') {
            this.countDaXuLyChartSuCoATTT += subItem?.giatri || 0;
          } else if (subItem?.xuly === 'Đang xử lý') {
            this.countDangXuLyChartSuCoATTT += subItem?.giatri || 0;
          } else if (subItem?.xuly === 'Chưa xử lý') {
            this.countChuaXuLyChartSuCoATTT += subItem?.giatri || 0;
          }
        }
      }
    }

    this.columnData = [
      {
        x: Constant.SU_CO_ATTT_TYPE.INTERNET,
        y: this.getValueDangVaChuaSuCoATTT(this.canhBaoSuCoATTT, 'INTERNET'),
      },
      {
        x: Constant.SU_CO_ATTT_TYPE.BLACK_DOMAIN,
        y: this.getValueDangVaChuaSuCoATTT(
          this.canhBaoSuCoATTT,
          'BLACK_DOMAIN',
        ),
      },
      {
        x: Constant.SU_CO_ATTT_TYPE.MALWARE,
        y: this.getValueDangVaChuaSuCoATTT(this.canhBaoSuCoATTT, 'MALWARE'),
      },
      {
        x: Constant.SU_CO_ATTT_TYPE.HUNTING,
        y: this.getValueDangVaChuaSuCoATTT(this.canhBaoSuCoATTT, 'HUNTING'),
      },
    ];

    this.cdr.detectChanges();
  }

  async pagination(page: number, page_size: number) {
    this.getDanhSachCanhBao(
      '',
      this.mainType,
      this.subType,
      this.alertType,
      this.convertService.getRegionType(this.regionType),
      null,
      '',
      '',
      this.xuLyType,
      page,
      page_size,
    );
  }

  getValueChuaXuLySuCoATTT(key_list: any, alert_type: any) {
    return (
      key_list
        ?.find((e: any) => e?.sys == alert_type)
        ?.data?.find((e: any) => e?.xuly == 'Chưa xử lý')?.giatri || 0
    );
  }
  getValueDaXuLySuCoATTT(key_list: any, alert_type: any) {
    return (
      key_list
        ?.find((e: any) => e?.sys == alert_type)
        ?.data?.find((e: any) => e?.xuly == 'Đã xử lý')?.giatri || 0
    );
  }
  getValueDangXuLySuCoATTT(key_list: any, alert_type: any) {
    return (
      key_list
        ?.find((e: any) => e?.sys == alert_type)
        ?.data?.find((e: any) => e?.xuly == 'Đang xử lý')?.giatri || 0
    );
  }

  getValueDangVaChuaSuCoATTT(key_list: any, alert_type: any) {
    return (
      key_list
        .find((e: any) => e?.sys == alert_type)
        ?.data?.reduce((sum: number, current: any) => {
          if (current?.xuly == 'Chưa xử lý' || current?.xuly == 'Đang xử lý') {
            return sum + current?.giatri || 0;
          }
          return sum;
        }, 0) || 0
    );
  }

  getValueTongSuCoATTT(key_list: any, alert_type: any) {
    return (
      key_list
        ?.find((e: any) => e?.sys == alert_type)
        ?.data?.reduce(
          (sum: number, current: any) => sum + current?.giatri || 0,
          0,
        ) || 0
    );
  }

  getValueNetwork(name: any) {
    return this.convertService.getTypeNetwork(name);
  }
  getValueAlertType(name: any) {
    // let key: any = {
    //   MALWARE: 'Mã độc',
    //   BLACK_DOMAIN: 'Tên miền độc hại',
    //   INTERNET: 'Kết nối Internet',
    //   HUNTING: 'Bất thường',
    // };
    // return key[name] || '';
    return this.convertService.getTypeSecurity(name);
  }
  getTypeRegion(type: string) {
    return this.convertService.getName(type);
  }
  getLastActive(data: any) {
    let result =
      data?.last_active ||
      data?.last_up ||
      data?.nms?.last_active ||
      data?.nac?.last_active;
    // return new Date(a).toISOString().split('T')[0];
    return result;
  }

  sendArrayEventMap() {
    // Send event to map
    const apiFilter: Partial<ApiFilter> = {
      mainType: this.mainType as MainType,
      subType: this.subType,
      columnType: this.alertType,
      core: this.convertService.getRegionType(this.regionType),
      // page: 1,
      // limit: 999999,
      from: this.startDate,
      to: this.endDate,
    };

    const title: Breadcrumb[] = [
      {
        id: BreadcrumbIds.INFO_SEC_ALERT_LIST,
        label: Constant.DEFAULT_VALUES.ALERT.INFOSEC,
      },
    ];

    if (this.columnName) {
      title.push({
        id: this.alertType,
        label: this.columnName,
      });
    }

    const data: EventDataPayload = {
      subType: MapSubType.CYBER_SECURITY_ALERT,
      dataType: 'array',
      actualData: {
        apiFilter,
        title,
      },
    };

    this.socket.sendBroadcastChannel({
      type: EventId.MAP,
      data: data,
    });
  }

  sendObjectEventMap(actualData: any = null, dataType: DataTypePayload = null) {
    const data: EventDataPayload = {
      subType: MapSubType.CYBER_SECURITY_ALERT,
      dataType,
      actualData,
    };
    this.socket.sendBroadcastChannel({
      type: EventId.MAP,
      data: data,
    });
  }
  getUnitName(unit_id: any) {
    let unitStr: any = localStorage.getItem('getUnits')?.toString();

    let unitJSON = JSON?.parse(unitStr) || null;

    let unit = unitJSON?.find((e: any) => e?.path == unit_id);
    return unit?.name_short;
  }

  getUnitNameParent(unit_id: any) {
    let unitStr: any = localStorage.getItem('getUnits')?.toString();

    let unitJSON = JSON?.parse(unitStr) || null;

    // let unit = unitJSON?.find((e:any)=>e?.path == unit_id);

    // Tìm vị trí của dấu chấm cuối cùng
    let lastDotIndex =
      unit_id?.lastIndexOf('.') != -1
        ? unit_id?.lastIndexOf('.')
        : unit_id.length;

    // Lấy phần chuỗi từ đầu đến trước dấu chấm cuối cùng
    let trimmedUnitPath = unit_id?.substring(0, lastDotIndex);

    let unit_parent = unitJSON?.find((e: any) => e?.path == trimmedUnitPath);
    return unit_parent?.name_short;
  }
}
