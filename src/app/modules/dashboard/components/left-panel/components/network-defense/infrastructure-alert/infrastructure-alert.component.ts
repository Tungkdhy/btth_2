import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { EChartsOption } from 'echarts';
import { CommonModule } from '@angular/common';
import {
  AxisModel,
  CategoryService,
  ChartAnnotationService,
  ChartModule,
  ColumnSeriesService,
  DataLabelService,
  LegendService,
  LegendSettingsModel,
  ScrollBarService,
  StackingColumnSeriesService,
  TooltipService,
} from '@syncfusion/ej2-angular-charts';
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';
import { debounceTime, Subject, filter } from 'rxjs';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { TooltipModule } from '@syncfusion/ej2-angular-popups';
import { SupabaseInfrastructureAlertService } from './services/supabase';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { Constant } from 'src/app/core/config/constant';
import { NumberFormatPipe } from 'src/app/core/pipes/number-format/number-format.pipe';
import { ApiFilter, MainType, MapSubType, EventId } from 'src/app/modules/dashboard/models/btth.interface';
import { EventDataPayload, DataTypePayload } from 'src/app/modules/dashboard/models/payload-channel';
import { Breadcrumb, BreadcrumbIds } from 'src/app/modules/dashboard/services/breadcrumb.service';
import { SocketService } from 'src/app/modules/dashboard/services/socket.service';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts'

@Component({
  selector: 'app-infrastructure-alert',
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
    ScrollBarService,
    ColumnSeriesService,
    ChartAnnotationService,
    StackingColumnSeriesService,
    LegendService,
    TooltipService,
    DataLabelService,
    provideEcharts()
  ],
  templateUrl: './infrastructure-alert.component.html',
  styleUrls: ['./infrastructure-alert.component.scss'],
})
export class InfrastructureAlertComponent implements OnInit {
  @Output() popupToggled = new EventEmitter<{
    isPopupVisible: boolean;
    typePopup: string;
    alertType: string;
  }>();

  page = 1;
  pageSize = 3;
  total = 0;

  disconnectedListPromise: Promise<any>;
  columnName: string = '';
  private eventSubject = new Subject<any>();
  private intervalId: any;

  suCoHaTangUDDV: any;
  public columnData: Object[] = [];

  public primaryXAxis: AxisModel;
  public primaryYAxis: AxisModel = {};
  public legendSettings: LegendSettingsModel;

  public dataLabel: Object = [];
  public marker: Object;

  public countDaXuLyChartUDDV: number = 0;
  public countDangXuLyChartUDDV: number = 0;
  public countChuaXuLyChartUDDV: number = 0;

  public summaryrouterBCTTList: any = {};
  public summaryrouterRCYList: any = {};
  public summaryswitchList: any = {};
  public summaryfirewallList: any = {};

  public summaryserverList: any = {};
  public summaryportalList: any = {};
  public summarycommonList: any = {};
  public summaryserverMonitorList: any = {};

  public alertType: string = '';
  public xuLyType: string = '';

  @Input() subType: string = '728';
  @Input() mainType: string = '';
  @Input() regionType: string = 'all';
  @Input() startDate: string = '';
  @Input() endDate: string = '';
  private channel: any;

  public border: Object = {
    width: 2,
    radius: 10, // Apply border-radius here
  };
  private colorChart: string;

  constructor(
    private supabase: SupabaseInfrastructureAlertService,
    private supabaseService: SupabaseService,

    private socket: SocketService,
    private convertService: ConvertServiceComponent,
    private cdr: ChangeDetectorRef,
  ) { }

  onTextRender(args: any): void {
    const point = args.point;
    // args.text = `${this.getValueSuCoHaTangDaXuLy(
    //   this.suCoHaTangUDDV,
    //   this.getAlertTypeByName(point?.x),
    // )}/${this.getValueSuCoHaTangDangXuLy(
    //   this.suCoHaTangUDDV,
    //   this.getAlertTypeByName(point?.x),
    // )}/${this.getValueSuCoHaTangChuaXuLy(
    //   this.suCoHaTangUDDV,
    //   this.getAlertTypeByName(point?.x),
    // )}`; // Hiển thị 2 nhãn

    args.text = `${this.getValueSuCoHaTangDangVaChuaXuLy(
      this.suCoHaTangUDDV,
      this.getAlertTypeByName(point?.x),
    )}`;
  }
  async ngOnInit(): Promise<void> {
    let checkUnits: any = localStorage.getItem('getUnits');
    if (!checkUnits || checkUnits.toString() == '[]') {
      let getUnits = await this.supabase.getUnit();
      localStorage.setItem('getUnits', JSON.stringify(getUnits));
    }
    // biểu đồ sự cố hạ tầng ứng dụng dich vụ
    this.colorChart = this.getCssVariable('body', '--colorText');

    this.primaryXAxis = {
      valueType: 'Category',
      title: '',
      labelStyle: {
        size: '3em',
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
    this.dataLabel = {
      visible: true,
      position: 'Outer',
      font: {
        fontWeight: '24px',
        color: '#000000',
        size: '30px',
      },
    };

    this.marker = {
      dataLabel: this.dataLabel,
    };

    this.legendSettings = {
      visible: true,
      position: 'Right',
      shapeWidth: 30,
      shapeHeight: 30,
      opacity: 5,
      // Change the position to 'Top', 'Bottom', 'Left', or 'Right'
      textStyle: {
        size: '2.5rem',
        color: this.colorChart, // Change the font size as needed
      },
    };
    this.dataLabel = {
      visible: true,
      position: 'Top', // Căn giữa nhãn dữ liệu
      font: {
        fontWeight: '600',
        color: this.colorChart,
        size: '2rem',
      },
    };

    this.marker = {
      // visible: true,
      // width: 30,
      // height: 30,
      dataLabel: this.dataLabel,
    };

    // this.channel = this.supabase
    //   .getSupabase()
    //   .channel('schema-db-changes-1')
    //   .on(
    //     'postgres_changes',
    //     { event: '*', schema: 'btth', table: 'device_nac' },
    //     (payload: any) => {
    //       this.eventSubject.next(payload);
    //     },
    //   )
    //   .on(
    //     'postgres_changes',
    //     { event: '*', schema: 'btth', table: 'device_nms' },
    //     (payload: any) => {
    //       console.log('payload', payload);
    //       this.eventSubject.next(payload);
    //     },
    //   )
    //   .on(
    //     'postgres_changes',
    //     { event: '*', schema: 'btth', table: 'v_khacfuc_attt' },
    //     (payload: any) => {
    //       console.log('payload', payload);
    //       this.eventSubject.next(payload);
    //     },
    //   )
    //   .on(
    //     'postgres_changes',
    //     { event: '*', schema: 'btth', table: 'server_fmc' },
    //     (payload: any) => {
    //       console.log('payload', payload);
    //       this.eventSubject.next(payload);
    //     },
    //   )
    //   .on(
    //     'postgres_changes',
    //     { event: '*', schema: 'btth', table: 'server_ta21' },
    //     (payload: any) => {
    //       console.log('payload', payload);
    //       this.eventSubject.next(payload);
    //     },
    //   )
    //   .on(
    //     'postgres_changes',
    //     { event: '*', schema: 'btth', table: 'server_nac' },
    //     (payload: any) => {
    //       console.log('payload', payload);
    //       this.eventSubject.next(payload);
    //     },
    //   )
    //   .subscribe();

    // this.eventSubject
    //   .pipe(
    //     debounceTime(10 * 1000), // Điều chỉnh thời gian debounce theo nhu cầu
    //   )
    //   .subscribe(async (payload) => {
    //     await this.getDataChart(
    //       this.mainType,
    //       this.subType,
    //       this.convertService.getRegionType(this.regionType),
    //       this.startDate,
    //       this.endDate,
    //     );
    //     this.getDisconnectedList(
    //       this.mainType,
    //       this.subType,
    //       null,
    //       this.convertService.getRegionType(this.regionType),
    //       null,
    //       null,
    //       1,
    //       3,
    //       this.startDate,
    //       this.endDate,
    //     );
    //   })
  }
  ngOnDestroy(): void {
    // Xóa interval khi component bị hủy
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
          color: '#ff9800'
        }
      }
    ]
  };

  resetInterval() {
    // Clear the existing interval

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Set a new interval
    let interval = setInterval(async () => {
      this.getDisconnectedList(
        this.mainType,
        this.subType,
        this.alertType,
        this.convertService.getRegionType(this.regionType),
        null,
        null,
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
  async ngOnChanges(changes: SimpleChanges) {
    this.resetInterval();
    if (changes?.startDate?.currentValue && changes?.endDate?.currentValue) {
      let subType = Constant.SUB_TYPE_DEVICE.ALL;

      if (this.subType == Constant.SUB_TYPE_DEVICE.ALL) {
        if (changes?.mainType?.currentValue == Constant.MAIN_TYPE.QS) {
          subType = Constant.SUB_TYPE_DEVICE.QS_QP;
        } else if (changes?.mainType?.currentValue == Constant.MAIN_TYPE.CD) {
          subType = Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA;
        }
      } else {
        subType = this.subType;
      }

      this.getDisconnectedList(
        this.mainType,
        subType,
        null,
        this.convertService.getRegionType(this.regionType),
        null,
        null,
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
      this.getDisconnectedList(
        this.mainType,
        this.subType,
        this.alertType,
        this.convertService.getRegionType(this.regionType),
        null,
        null,
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

      // if (changes?.subType?.currentValue == Constant.SUB_TYPE_DEVICE.ALL) {
      //   await this.getDataChart(
      //     this.mainType,
      //     this.subType,
      //     this.convertService.getRegionType(this.regionType),
      //     this.startDate,
      //     this.endDate,
      //   );
      // } else {
      //   await this.getDataChart(
      //     this.mainType,
      //     this.subType,
      //     this.convertService.getRegionType(this.regionType),
      //     this.startDate,
      //     this.endDate,
      //   );
      // }
    } else if (changes?.mainType?.currentValue || changes?.mainType?.currentValue == '') {
      let subType = this.subType;

      this.getDisconnectedList(
        this.mainType,
        subType,
        this.alertType,
        this.convertService.getRegionType(this.regionType),
        null,
        null,
        this.xuLyType,
        1,
        3,
        this.startDate,
        this.endDate,
      );
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
      await this.getDataChart(
        this.mainType,
        subType,
        this.convertService.getRegionType(this.regionType),
        this.startDate,
        this.endDate,
      );
    } else if (changes?.regionType?.currentValue) {
      this.getDisconnectedList(
        this.mainType,
        this.subType,
        this.alertType,
        this.convertService.getRegionType(this.regionType),
        null,
        null,
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
      this.getDisconnectedList(
        this.mainType,
        this.subType,
        this.alertType,
        this.convertService.getRegionType(this.regionType),
        null,
        null,
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
  private getCssVariable(selector: string, variable: string): string {
    const element = document.querySelector(selector);
    if (element) {
      return getComputedStyle(element).getPropertyValue(variable).trim();
    }
    return '';
  }

  async reset() {
    if (this.columnName.length > 0 || this.alertType.length > 0 || this.xuLyType.length > 0) {
      this.columnName = '';
      this.alertType = '';
      this.xuLyType = '';
      this.getDisconnectedList(
        this.mainType,
        this.subType,
        null,
        this.convertService.getRegionType(this.regionType),
        null,
        null,
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

      this.cdr.detectChanges();
    }
  }
  togglePopup(isPopupVisible: boolean, typePopup: string) {
    this.popupToggled.emit({
      isPopupVisible,
      typePopup,
      alertType: this.alertType,
    });
  }

  async onPageChange(page: number) {
    this.page = page;
    this.getDisconnectedList(
      this.mainType,
      this.subType,
      this.alertType,
      this.convertService.getRegionType(this.regionType),
      null,
      null,
      this.xuLyType,
      page,
      this.pageSize,
      this.startDate,
      this.endDate,
    );
    this.cdr.detectChanges();
  }

  getDisconnectedList(
    main_type: any,
    sub_type: any,
    column_type: any = '',
    loploi: any = null,
    lopbien: any = null,
    searchText: any = null,
    xuly: any = null,
    page_index: number = 1,
    page_size: number = 3,
    from: string = '',
    to: string = '',
  ) {
    this.page = page_index;
    this.pageSize = page_size;
    this.disconnectedListPromise =
      this.supabaseService.getDanhSachHeThongMatKetNoi(
        main_type,
        sub_type,
        column_type,
        loploi,
        lopbien,
        searchText,
        xuly,
        page_index,
        page_size,
        from,
        to,
      );
  }

  // async getDisconnectedListToMap(
  //   main_type: any,
  //   sub_type: any,
  //   column_type: any = '',
  //   loploi: any = null,
  //   lopbien: any = null,
  //   searchText: any = null,
  //   page_index: number = 1,
  //   page_size: number = 99999,
  //   from: string = '',
  //   to: string = '',
  // ) {
  //   return await this.supabaseService.getDanhSachHeThongMatKetNoi(
  //     main_type,
  //     sub_type,
  //     column_type,
  //     loploi,
  //     lopbien,
  //     searchText,
  //     null,
  //     page_index,
  //     page_size,
  //     from,
  //     to,
  //   );
  // }
  getAlertTypeByName(name: string) {
    let key: any = {
      [Constant.SU_CO_MKN_TYPE.R]: 'device_ROUTER_ROUTER_BCTT',
      [Constant.SU_CO_MKN_TYPE.CY]: 'device_ROUTER_ROUTER_CY',
      [Constant.SU_CO_MKN_TYPE.SW]: 'device_SWITCH_',
      [Constant.SU_CO_MKN_TYPE.FW]: 'device_FIREWALL_',
      [Constant.SU_CO_MKN_TYPE.HTGS]: 'server_monitor',
      [Constant.SU_CO_MKN_TYPE.MC]: 'device_SERVER_',
      [Constant.SU_CO_MKN_TYPE.TTDT]: 'service_PORTAL',
      [Constant.SU_CO_MKN_TYPE.UDDC]: 'service_COMMON',
    };
    return key[name];
  }

  async axisLabelClick(event: any) {
    this.columnName = event?.text; // this.getValueColumnName(event.point.series.properties.stackingGroup);
    this.alertType = this.getAlertTypeByName(event?.text);
    this.xuLyType = '';
    this.clickPointChart();
  }
  async onClickChartSuCoUngDungHaTang(event: any) {
    this.columnName = event?.point?.x; // this.getValueColumnName(event.point.series.properties.stackingGroup);
    this.alertType = this.getAlertTypeByName(event?.point?.x);
    this.xuLyType = '';
    this.clickPointChart();
  }
  async onClickKetQuaXuLy(xuly: string) {
    this.xuLyType = xuly;
    this.getDisconnectedList(
      this.mainType,
      this.subType,
      this.alertType,
      this.convertService.getRegionType(this.regionType),
      null,
      null,
      this.xuLyType,
      1,
      3,
      this.startDate,
      this.endDate,
    );
    this.cdr.detectChanges();
  }
  async clickPointChart() {
    this.countDaXuLyChartUDDV = this.getValueSuCoHaTangDaXuLy(
      this.suCoHaTangUDDV,
      this.alertType,
    );
    this.countChuaXuLyChartUDDV = this.getValueSuCoHaTangChuaXuLy(
      this.suCoHaTangUDDV,
      this.alertType,
    );
    this.countDangXuLyChartUDDV = this.getValueSuCoHaTangDangXuLy(
      this.suCoHaTangUDDV,
      this.alertType,
    );

    this.getDisconnectedList(
      this.mainType,
      this.subType,
      this.alertType,
      this.convertService.getRegionType(this.regionType),
      null,
      null,
      this.xuLyType,
      1,
      3,
      this.startDate,
      this.endDate,
    );

    // this.togglePopup(true, 'INFRASTRUCTURE_ALERT');
    this.cdr.detectChanges();
  }
  getValueColumnName(name: string): string {
    let key: any = {
      device_ROUTER_ROUTER_BCTT: 'Định tuyến',
      device_ROUTER_ROUTER_CY: 'Cơ yếu',
      device_SWITCH_: 'Chuyển mạch',
      device_FIREWALL_: 'Tường lửa',
      server_monitor: 'Hệ thống giám sát',
      device_SERVER_: 'Máy chủ',
      service_PORTAL: 'Cổng TTĐT',
      service_COMMON: 'Dùng chung',
    };

    return key[name] || '';
  }
  getValueSuCoHaTangDangXuLy(key_list: any, sys: any) {
    return (
      key_list
        ?.find((e: any) => e?.sys == sys)
        ?.data?.find((e: any) => e?.xuly == 'Đang xử lý')?.giatri || 0
    );
  }
  getValueSuCoHaTangChuaXuLy(key_list: any, sys: any) {
    return (
      key_list
        ?.find((e: any) => e?.sys == sys)
        ?.data?.find((e: any) => e?.xuly == 'Chưa xử lý')?.giatri || 0
    );
  }
  getValueSuCoHaTangDaXuLy(key_list: any, sys: any) {
    return (
      key_list
        .find((e: any) => e?.sys == sys)
        ?.data?.find((e: any) => e?.xuly == 'Đã xử lý')?.giatri || 0
    );
  }
  getValueSuCoHaTangDangVaChuaXuLy(key_list: any, sys: any) {
    return (
      key_list
        .find((e: any) => e?.sys == sys)
        ?.data?.reduce((sum: number, current: any) => {
          if (
            current?.xuly === 'Chưa xử lý' ||
            current?.xuly === 'Đang xử lý'
          ) {
            return sum + current?.giatri || 0;
          }
          return sum;
        }, 0) || 0
    );
  }
  getValueSuCoHaTangTong(key_list: any, sys: any) {
    return (
      key_list
        .find((e: any) => e?.sys == sys)
        ?.data?.reduce(
          (sum: number, current: any) => sum + current?.giatri || 0,
          0,
        ) || 0
    );
  }
  async getDataChart(
    main_type: any,
    sub_type: any,
    loploi: any,
    from: any,
    to: any,
  ) {
    this.suCoHaTangUDDV = await this.supabase.getThongKeSuCoHaTangUDDV(
      main_type,
      sub_type,
      Constant.N_DAY,
      loploi,
      null,
      from,
      to,
    );

    this.countDangXuLyChartUDDV = 0;
    this.countChuaXuLyChartUDDV = 0;
    this.countDaXuLyChartUDDV = 0;

    for (let i = 0; i < this.suCoHaTangUDDV.length; i++) {
      // Duyệt qua mảng con 'data' bên trong từng đối tượng
      if (this.alertType ? this.alertType == this.suCoHaTangUDDV[i].sys : true) {
        for (let j = 0; j < this.suCoHaTangUDDV[i]?.data.length; j++) {
          let subItem = this.suCoHaTangUDDV[i]?.data[j];
          if (subItem?.xuly == 'Đã xử lý') {
            this.countDaXuLyChartUDDV += subItem?.giatri || 0;
          } else if (subItem?.xuly == 'Đang xử lý') {
            this.countDangXuLyChartUDDV += subItem?.giatri || 0;
          } else if (subItem?.xuly == 'Chưa xử lý') {
            this.countChuaXuLyChartUDDV += subItem?.giatri || 0;
          }
        }
      }
    }

    this.columnData = [
      {
        x: Constant.SU_CO_MKN_TYPE.R,
        y: this.getValueSuCoHaTangDangVaChuaXuLy(
          this.suCoHaTangUDDV,
          'device_ROUTER_ROUTER_BCTT',
        ),
      },
      {
        x: Constant.SU_CO_MKN_TYPE.CY,
        y: this.getValueSuCoHaTangDangVaChuaXuLy(
          this.suCoHaTangUDDV,
          'device_ROUTER_ROUTER_CY',
        ),
      },
      {
        x: Constant.SU_CO_MKN_TYPE.FW,
        y: this.getValueSuCoHaTangDangVaChuaXuLy(
          this.suCoHaTangUDDV,
          'device_FIREWALL_',
        ),
      },
      {
        x: Constant.SU_CO_MKN_TYPE.SW,
        y: this.getValueSuCoHaTangDangVaChuaXuLy(
          this.suCoHaTangUDDV,
          'device_SWITCH_',
        ),
      },
      {
        x: Constant.SU_CO_MKN_TYPE.MC,
        y: this.getValueSuCoHaTangDangVaChuaXuLy(
          this.suCoHaTangUDDV,
          'device_SERVER_',
        ),
      },
      {
        x: Constant.SU_CO_MKN_TYPE.TTDT,
        y: this.getValueSuCoHaTangDangVaChuaXuLy(
          this.suCoHaTangUDDV,
          'service_PORTAL',
        ),
      },
      {
        x: Constant.SU_CO_MKN_TYPE.UDDC,
        y: this.getValueSuCoHaTangDangVaChuaXuLy(
          this.suCoHaTangUDDV,
          'service_COMMON',
        ),
      },
      {
        x: Constant.SU_CO_MKN_TYPE.HTGS,
        y: this.getValueSuCoHaTangDangVaChuaXuLy(
          this.suCoHaTangUDDV,
          'server_monitor',
        ),
      },
    ];

    this.cdr.detectChanges();
  }

  async pagination(page: number, page_size: number) {
    this.getDisconnectedList(
      this.mainType,
      this.subType,
      this.alertType,
      this.convertService.getRegionType(this.regionType),
      null,
      null,
      this.xuLyType,
      page,
      page_size,
      this.startDate,
      this.endDate,
    );
    this.cdr.detectChanges();
  }

  getType(type: any) {
    let key: any = {
      device_ROUTER_ROUTER_BCTT: 'Định tuyến',
      device_ROUTER_ROUTER_CY: 'Cơ yếu',
      device_SWITCH_: 'Chuyển mạch',
      device_FIREWALL_: 'Tường lửa',
      server_monitor: 'HTGS',
      device_SERVER_: 'Máy chủ',
      service_PORTAL: 'Cổng TTĐT',
      service_COMMON: 'Dùng chung',
    };

    return key[type] || '';
  }
  getDescriptionSystemMonitor(item: any) {
    if (!item?.level) return '';
    if (item?.level == 'LEVEL4') return 'FMC';
    return item?.level.replace('LEVEL', item?.type?.toUpperCase() + ' cấp ');
  }
  getTenDV(data: any) {
    return data?.unit_name_full || '';
  }

  getIpTenMien(data: any) {
    return (
      data?.ip ||
      data?.management_ip ||
      data?.management_ip ||
      data?.description ||
      ''
    );
  }

  getLastActive(data: any) {
    let a = data?.last_up || data?.last_active || '';
    return a;
  }

  getValueNetwork(name: any) {
    return this.convertService.getTypeNetwork(name);
  }
  getTypeRegion(type: string) {
    return this.convertService.getName(type);
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

    let lastDotIndex =
      unit_id?.lastIndexOf('.') != -1
        ? unit_id?.lastIndexOf('.')
        : unit_id.length;

    let trimmedUnitPath = unit_id?.substring(0, lastDotIndex);

    let unit_parent = unitJSON?.find((e: any) => e?.path == trimmedUnitPath);
    return unit_parent?.name_short;
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
        id: BreadcrumbIds.INFRA_ALERT_LIST,
        label: Constant.DEFAULT_VALUES.ALERT.INFRASTRUCTURE,
      },
    ];

    if (this.columnName) {
      title.push({
        id: this.alertType,
        label: this.columnName,
      });
    }

    const data: EventDataPayload = {
      subType: MapSubType.INFRASTRUCTURE_ALERT,
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
      subType: MapSubType.INFRASTRUCTURE_ALERT,
      dataType,
      actualData,
    };
    this.socket.sendBroadcastChannel({
      type: EventId.MAP,
      data: data,
    });
  }
}
