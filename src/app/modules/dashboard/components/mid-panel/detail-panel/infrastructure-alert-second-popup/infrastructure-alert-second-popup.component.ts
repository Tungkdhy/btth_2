import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { Constant } from 'src/app/core/config/constant';
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';
import { ColumnChartConTonPanelComponent } from "./column-chart-con-ton-panel/column-chart-con-ton-panel.component";
import { LineChartLeftPanelComponent } from "./line-chart-left-panel/line-chart-left-panel.component";
import { ColumnChartLeftQuaHanComponent } from "./column-chart-qua-han-panel/column-chart-qua-han-panel.component";

@Component({
  selector: 'app-infrastructure-alert-second-popup',
  standalone: true,
  imports: [CommonModule, ColumnChartConTonPanelComponent, LineChartLeftPanelComponent, ColumnChartLeftQuaHanComponent],
  templateUrl: './infrastructure-alert-second-popup.component.html',
  styleUrls: ['./infrastructure-alert-second-popup.component.scss'],
})
export class InfrastructureAlertSecondPopupComponent {

  type: string = 'date';
  suCoMKN: any;
  @Input() mainType: string = '';
  @Input() regionType: string = 'all';
  @Input() subType: string = "728";
  @Input() startDate: string = "";
  @Input() endDate: string = "";

  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();

  columnConTonData: any[] = [];
  lineMKNData: any[] = [];
  columnQuaHanData: any[] = [];

  orderCategory: any = {
    'device_ROUTER_ROUTER_BCTT': 1,
    'device_ROUTER_ROUTER_CY': 2,
    'device_SWITCH_': 3,
    'device_FIREWALL_': 4,
    'server_monitor': 5,
    'device_SERVER': 6,
    'service_PORTAL': 7,
    'service_COMMON': 8
  };
  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }
  constructor(
    private supabase: SupabaseService,
    private convertService: ConvertServiceComponent,
    private cdr: ChangeDetectorRef,
  ) { }


  async changeSelect(type: any) {

    this.type = type;
    let sucoMKN = await this.supabase.getSuCoMKNCatSecond(this.mainType, this.subType, this.convertService.getRegionType(this.regionType), null, type, this.getDateDependOnType(type), this.supabase.endOfDayFormatted(Date.now()));
    let suCoMKNAll = await this.supabase.getSuCoMKNCatSecond(this.mainType, this.subType, this.convertService.getRegionType(this.regionType), null, this.type, null, null);
    this.suCoMKN = sucoMKN;
    this.getBieuDoConTon(suCoMKNAll);
    this.mergeDevicesIntoNetwork(sucoMKN);

    this.cdr.detectChanges();
  }

  getValueColumnName(name: string): string {
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

    return key[name] || '';
  }

  getDateDependOnType(type: string) {
    switch (type) {
      case 'date':
        return this.supabase.startOfDayFormatted(Date.now() - 7 * 86400000);
      case 'week':
        return this.getMondayOfWeeksAgo(7);
      case 'month':
        return this.getStartOfMonth(7);
    }
  }
  getStartOfMonth(monthsAgo: number) {
    let date = new Date(); // Lấy ngày hiện tại
    date.setMonth(date.getMonth() - monthsAgo); // Lùi lại số tháng mong muốn
    date.setDate(1); // Đặt ngày thành 1 để lấy ngày đầu tiên của tháng
    date.setHours(0, 0, 0, 0); // Đặt thời gian về đầu ngày
    return this.supabase.startOfDayFormatted(date);
  }
  getMondayOfWeeksAgo(weeksAgo: number) {
    let date = new Date(); // Lấy ngày hiện tại
    let currentDay = date.getDay(); // Lấy chỉ số của ngày trong tuần (0 = Chủ Nhật, 1 = Thứ Hai, ...)
    let daysSinceMonday = (currentDay + 6) % 7; // Tính số ngày từ thứ Hai gần nhất
    let daysToMove = (weeksAgo * 7) + daysSinceMonday; // Tổng số ngày cần lùi
    date.setDate(date.getDate() - daysToMove); // Lùi lại số ngày mong muốn
    date.setHours(0, 0, 0, 0); // Đặt thời gian về đầu ngày
    return this.supabase.startOfDayFormatted(date);
  }

  async ngOnInit() {

    if (this.subType == Constant.SUB_TYPE_DEVICE.ALL) {
      if (this.mainType == Constant.MAIN_TYPE.QS) {
        this.subType = Constant.SUB_TYPE_DEVICE.QS_QP;
      } else if (this.mainType == Constant.MAIN_TYPE.CD) {
        this.subType = Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA;
      }
    }

    let suCoMKN = await this.supabase.getSuCoMKNCatSecond(this.mainType, this.subType, this.convertService.getRegionType(this.regionType), null, this.type, this.getDateDependOnType(this.type), this.supabase.endOfDayFormatted(Date.now()));
    let suCoMKNAll = await this.supabase.getSuCoMKNCatSecond(this.mainType, this.subType, this.convertService.getRegionType(this.regionType), null, this.type, null, null);

    this.suCoMKN = suCoMKN;
    this.getBieuDoConTon(suCoMKNAll);
    this.mergeDevicesIntoNetwork(suCoMKN);
    this.getBieuDoQuaHan(suCoMKNAll);

    this.cdr.detectChanges();
  }

  getBieuDoConTon(suCoMKNAll:any) {
    let tempArray = [];

    let suCoMKN = suCoMKNAll.sort((a: any, b: any) => this.orderCategory[a.name] - this.orderCategory[b.name])

    for (let item of suCoMKN) {
      tempArray.push({
        name: this.getValueColumnName(item?.name),
        trong_x: item?.data?.filter((e: any) => e?.delta == 0)?.reduce((sum: number, item: any) => sum + item?.tong, 0),
        homqua_x: item?.data?.filter((e: any) => e?.delta == 1)?.reduce((sum: number, item: any) => sum + item?.tong, 0),
        con_ton: item?.data?.filter((e: any) => e?.delta > 1)?.reduce((sum: number, item: any) => sum + item?.tong, 0)
      });
    }

    this.columnConTonData = tempArray;

  }
  getBieuDoQuaHan(suCoMKN: any) {
    let tempArrayQuaHan = [
      {
        name: '1-5 ngày',
        thietbimang: 0,
        mc: 0,
        uddv: 0,
        htgs: 0,
      },
      {
        name: '5-10 ngày',
        thietbimang: 0,
        mc: 0,
        uddv: 0,
        htgs: 0,
      },
      {
        name: '10-15 ngày',
        thietbimang: 0,
        mc: 0,
        uddv: 0,
        htgs: 0,
      },
      {
        name: '15-20 ngày',
        thietbimang: 0,
        mc: 0,
        uddv: 0,
        htgs: 0,
      },
      {
        name: 'Trên 20 ngày',
        thietbimang: 0,
        mc: 0,
        uddv: 0,
        htgs: 0,
      },
    ];
    suCoMKN.forEach((device: any) => {
      device.data.forEach((entry: any) => {
        let group = null;
        const { delta, tong } = entry;

        if (delta >= 0 && delta < 5) group = tempArrayQuaHan[0]; // 1-5 ngày
        else if (delta >= 5 && delta < 10) group = tempArrayQuaHan[1]; // 5-10 ngày
        else if (delta >= 10 && delta < 15) group = tempArrayQuaHan[2]; // 10-15 ngày
        else if (delta >= 15 && delta < 20) group = tempArrayQuaHan[3]; // 15-20 ngày
        else group = tempArrayQuaHan[4]; // Trên 20 ngày

        if (device.name.startsWith('device') && !device.name.startsWith('device_SERVER')) {
          group.thietbimang += tong;
        } else if (device.name.startsWith('SERVER_')) {
          group.mc += tong;
        } else if (device.name.startsWith('service_')) {
          group.uddv += tong;
        } else if (device.name === 'server_monitor') {
          group.htgs += tong;
        }
      });
    });
    this.columnQuaHanData = tempArrayQuaHan;

  }
  mergeDevicesIntoNetwork = (array: any) => {
    const networkDevice: any = {
      name: "NETWORK_DEVICE",
      data: []
    };
    const uddvDevice: any = {
      name: "UDDV",
      data: []
    };
    let dataMap: any = {};
    let dataUDDVMap: any = {};
    // Gộp dữ liệu vào networkDevice từ các thiết bị cần gộp
    array.forEach((device: any, index: any) => {
      if (["device_FIREWALL_", "device_ROUTER_ROUTER_BCTT", "device_ROUTER_ROUTER_CY", "device_SWITCH_"].includes(device.name)) {
        device.data.forEach((entry: any) => {
          let { last_active_date, tong, delta } = entry;

          if (dataMap[last_active_date]) {
            // Cộng dồn nếu ngày đã tồn tại
            dataMap[last_active_date].tong += tong;
          } else {
            // Thêm mục mới nếu ngày chưa tồn tại
            dataMap[last_active_date] = { last_active_date, tong, delta };
          }
        });
      }
    });
    array.forEach((device: any, index: any) => {
      if (["service_PORTAL", "service_COMMON"].includes(device.name)) {
        device.data.forEach((entry: any) => {
          const { last_active_date, tong, delta } = entry;

          if (dataUDDVMap[last_active_date]) {
            // Cộng dồn nếu ngày đã tồn tại
            dataUDDVMap[last_active_date].tong += tong;
          } else {
            // Thêm mục mới nếu ngày chưa tồn tại
            dataUDDVMap[last_active_date] = { last_active_date, tong, delta };
          }
        });
      }
    });
    // Thêm dữ liệu đã gộp vào networkDevice


    // networkDevice.data = Object.values(dataMap);
    uddvDevice.data = Object.values(dataUDDVMap);//.sort((a: any, b: any) => b?.delta - a?.delta);;
    networkDevice.data = Object.values(dataMap);//.sort((a: any, b: any) => b?.delta - a?.delta);

    // Lọc ra những thiết bị không phải là các thiết bị cần gộp
    const filteredDevices = array.filter(
      (device: any) => !["device_FIREWALL_", "device_ROUTER_ROUTER_BCTT", "device_ROUTER_ROUTER_CY", "device_SWITCH_", "service_PORTAL", "service_COMMON"].includes(device.name)
    );

    // Thêm networkDevice vào danh sách thiết bị mới
    if(Object.values(dataMap)?.length >0){
      filteredDevices.push(networkDevice);
    }
    if(Object.values(dataUDDVMap)?.length > 0){
      filteredDevices.push(uddvDevice);
    }
    //   this.lineMKNData = [
    //     {
    //         "name": "server_monitor",
    //         "data": [
    //             {
    //                 "last_active_date": "32/2024",
    //                 "tong": 1,
    //                 "delta": 6
    //             },
    //             {
    //                 "last_active_date": "33/2024",
    //                 "tong": 1,
    //                 "delta": 5
    //             },
    //             {
    //                 "last_active_date": "36/2024",
    //                 "tong": 4,
    //                 "delta": 2
    //             },
    //             {
    //                 "last_active_date": "37/2024",
    //                 "tong": 3,
    //                 "delta": 1
    //             },
    //             {
    //                 "last_active_date": "38/2024",
    //                 "tong": 1,
    //                 "delta": 0
    //             }
    //         ]
    //     },
    //     {
    //         "name": "NETWORK_DEVICE",
    //         "data": [
    //             {
    //                 "last_active_date": "31/2024",
    //                 "tong": 1,
    //                 "delta": 7
    //             },
    //             {
    //                 "last_active_date": "33/2024",
    //                 "tong": 2,
    //                 "delta": 5
    //             },
    //             {
    //                 "last_active_date": "37/2024",
    //                 "tong": 2,
    //                 "delta": 1
    //             },
    //             {
    //                 "last_active_date": "38/2024",
    //                 "tong": 7,
    //                 "delta": 0
    //             }
    //         ]
    //     },
    //     {
    //         "name": "UDDV",
    //         "data": []
    //     }
    // ];

    this.lineMKNData = filteredDevices;

    let lastActiveDates = this.lineMKNData.flatMap(item => item.data).sort((a, b) => b.delta - a.delta).map(item => item.last_active_date);

    this.lineMKNData.forEach((group: any) => {
      lastActiveDates.forEach(date => {
        // Kiểm tra nếu ngày đã tồn tại
        const existingEntry = group.data.find((entry: any) => entry.last_active_date === date);
        if (!existingEntry) {
          // Nếu không tồn tại, thêm mới với tong và delta = 0
          group.data.push({ last_active_date: date, tong: 0, delta: 0 });
        }
      });
    });

    this.lineMKNData.forEach(group => {
      group.data.sort((a: any, b: any) => a.last_active_date.localeCompare(b.last_active_date));
    });
  };
}
