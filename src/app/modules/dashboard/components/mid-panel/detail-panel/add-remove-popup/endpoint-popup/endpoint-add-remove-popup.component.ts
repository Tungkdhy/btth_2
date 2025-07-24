import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { TableDetail1Component } from "./table-detail-portal/table-detail-1.component";
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';
import { ColumnChartLeftPanelComponent } from "./column-chart-left-panel/column-chart-left-panel.component";
import { Constant } from 'src/app/core/config/constant';
import { PieChartLeftPanelComponent } from './pie-chart-left-panel/pie-chart-left-panel.component';

@Component({
  selector: 'app-endpoint-add-remove-popup',
  standalone: true,
  imports: [CommonModule, PieChartLeftPanelComponent, TableDetail1Component, ColumnChartLeftPanelComponent],
  templateUrl: './endpoint-add-remove-popup.component.html',
  styleUrls: ['./endpoint-add-remove-popup.component.scss']
})
export class EndpointAddRemovePopupComponent implements OnInit, OnChanges {
  constructor(
    private supabase: SupabaseService,
    private convertService: ConvertServiceComponent,
    private cdr: ChangeDetectorRef,
  ) { }

  @Input() mainType: string = "";
  @Input() regionType: string = "all";
  @Input() subType: string = "728";
  @Input() startDate: string = "";
  @Input() endDate: string = "";
  @Input() typeAddRemove: string = "SERVER";

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

    console.log(this.startDate,this.endDate);
    let thongKeEndPoint = await this.supabase.getThongKeBieuDoTronTangGiamEndPointMidPanel(this.mainType, this.subType, this.typeAddRemove, this.convertService.getRegionType(this.regionType),this.startDate,this.endDate);

    this.pieData = [
      { x: 'Thêm mới', y: thongKeEndPoint[0]?.count || 0 },
      { x: 'Gỡ bỏ', y: 0 },
    ];

    let danhSachThongKeTheoSource: any = await this.supabase.getThongKeBieuDoCotTangGiamEndPointMidPanel(this.mainType, this.subType, this.typeAddRemove, this.convertService.getRegionType(this.regionType),this.startDate,this.endDate);
    // Tạo một đối tượng để lưu số lượng
    const sourceCountsObj: any = {};

    // Sử dụng vòng lặp for để lặp qua mảng data
    for (let i = 0; i < danhSachThongKeTheoSource.length; i++) {
      const item = danhSachThongKeTheoSource[i];
      const sources = item.sources;
      const count = item.count;

      // Lặp qua từng source trong sources của mỗi phần tử
      for (let j = 0; j < sources.length; j++) {
        const source = sources[j];

        // Kiểm tra nếu source đã có trong sourceCountsObj, nếu có cộng thêm count
        if (sourceCountsObj[source]) {
          sourceCountsObj[source] += count;
        } else {
          // Nếu chưa có, khởi tạo với giá trị count
          sourceCountsObj[source] = count;
        }
      }
    }

    // Chuyển đối tượng thành mảng
    const sourceCountsArray = [];
    for (let source in sourceCountsObj) {
      sourceCountsArray.push({
        source: source,
        add: sourceCountsObj[source],
        remove: 0
      });
    }

    this.columnData = sourceCountsArray;


    let tempTable: any = await this.supabase.getDanhSachTangGiamEndPointMidPanel(this.mainType, this.subType, this.typeAddRemove, this.convertService.getRegionType(this.regionType), null, '', this.startDate, this.endDate);
    this.tableData = tempTable;
    this.cdr.detectChanges();
  }
  getTypeNetworkDeviceType() {
    let key: any = {
      "SERVER": "máy chủ",
      "CLIENT": "máy trạm",
      "OTHER": "thiết bị khác"
    }
    return key[this.typeAddRemove];
  }
}
