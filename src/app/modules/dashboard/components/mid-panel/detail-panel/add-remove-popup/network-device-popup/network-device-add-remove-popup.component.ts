import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { TableDetail1Component } from "./table-detail-portal/table-detail-1.component";
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';
import { ColumnChartLeftPanelComponent } from "./column-chart-left-panel/column-chart-left-panel.component";
import { Constant } from 'src/app/core/config/constant';
import { PieChartLeftPanelComponent } from './pie-chart-left-panel/pie-chart-left-panel.component';

@Component({
  selector: 'app-network-device-add-remove-popup',
  standalone: true,
  imports: [CommonModule, PieChartLeftPanelComponent, TableDetail1Component, ColumnChartLeftPanelComponent],
  templateUrl: './network-device-add-remove-popup.component.html',
  styleUrls: ['./network-device-add-remove-popup.component.scss']
})
export class NetworkDeviceAddRemovePopupComponent implements OnInit, OnChanges {
  constructor(
    private supabase: SupabaseService,
    private convertService: ConvertServiceComponent,
    private cdr: ChangeDetectorRef,
  ) { }

  @Input() mainType: string = "";
  @Input() regionType: string = "all";
  @Input() subType: string = Constant.SUB_TYPE_DEVICE.ALL;
  @Input() startDate: string = "";
  @Input() endDate: string = "";
  @Input() typeAddRemove:string = "ROUTER";

  pieData: any[] = [];
  columnData: any[] = [];
  tableData: any[] = [];

  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();

  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }

  async ngOnInit() {
    // await this.getData();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes?.subType?.currentValue) {
      if (this.subType == Constant.SUB_TYPE_DEVICE.ALL) {
        if (this.mainType == Constant.MAIN_TYPE.QS) {
          this.subType = Constant.SUB_TYPE_DEVICE.QS_QP;
        } else if (this.mainType == Constant.MAIN_TYPE.CD) {
          this.subType = Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA;
        }
      }
    } else if (changes?.mainType?.currentValue == '' || changes?.mainType?.currentValue) {
      if (this.mainType == Constant.MAIN_TYPE.QS) {
        this.subType = Constant.SUB_TYPE_DEVICE.QS_QP;
      } else if (this.mainType == Constant.MAIN_TYPE.CD) {
        this.subType = Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA;
      } else {
        this.subType = Constant.SUB_TYPE_DEVICE.ALL;
      }
    }
    await this.getData();
  }

  async getData() {

    let danhSachTron = await this.supabase.getThongKeBieuDoTronTangGiamNetworkDevicePopupMidPanel(this.mainType, this.subType,this.typeAddRemove, this.convertService.getRegionType(this.regionType), this.startDate, this.endDate);

    this.pieData = [
      { x: 'Thêm mới', y: danhSachTron?.find((e: any) => !e?.is_deleted)?.count || 0 },
      { x: 'Gỡ bỏ', y: danhSachTron?.find((e: any) => e?.is_deleted == true)?.count || 0 },
    ];


    let danhSachCot: any = await this.supabase.getThongKeBieuDoCotTangGiamNetworkDevicePopupMidPanel(this.mainType, this.subType, this.typeAddRemove, this.convertService.getRegionType(this.regionType), this.startDate, this.endDate);

    const result = [];

    for (let i = 0; i < danhSachCot.length; i++) {
      const { is_deleted, source, count } = danhSachCot[i];

      // Tìm xem đã có source này trong result chưa
      let found = false;
      for (let j = 0; j < result.length; j++) {
        if (result[j].name === source) {
          // Nếu tìm thấy, cộng dồn giá trị add hoặc remove
          if (is_deleted) {
            result[j].remove += count;
          } else {
            result[j].add += count;
          }
          found = true;
          break;
        }
      }

      // Nếu chưa tìm thấy, thêm mới vào result
      if (!found) {
        result.push({
          name: source,
          add: is_deleted ? 0 : count,
          remove: is_deleted ? count : 0
        });
      }
    }
    this.columnData = result;


    let tempTable:any  = await this.supabase.getDanhSachTangGiamNetworkDevicePopupMidPanel(this.mainType,this.subType,this.typeAddRemove, this.convertService.getRegionType(this.regionType),null,'','',this.startDate,this.endDate);

    // console.log("tgemp",tempTable);
    this.tableData = tempTable;

    this.cdr.detectChanges();
  }

  getTypeNetworkDeviceType(){
    let key:any = {
      "ROUTER":"định tuyến, cơ yếu",
      "SWITCH":"chuyển mạch",
      "FIREWALL":"tường lửa"
    }
    return key[this.typeAddRemove];
  }
}
