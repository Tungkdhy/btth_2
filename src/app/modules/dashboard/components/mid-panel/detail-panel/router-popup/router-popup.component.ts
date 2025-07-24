import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { TableDetailRouterComponent } from './table-detail-router/table-detail-router.component';
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';
import { ColumnChartLeftPanelComponent } from './column-chart-left-panel/column-chart-left-panel.component';
import { Constant } from 'src/app/core/config/constant';
import { StatisticPieChartPopupComponent } from '../../../shared/statistic-chart-popup/statistic-pie-chart-popup.component';

@Component({
  selector: 'app-router-popup',
  standalone: true,
  imports: [CommonModule, ColumnChartLeftPanelComponent, TableDetailRouterComponent, StatisticPieChartPopupComponent],
  templateUrl: './router-popup.component.html',
  styleUrls: ['./router-popup.component.scss']
})
export class RouterPopupComponent implements OnInit, OnChanges {
  constructor(
    private supabase: SupabaseService,
    private convertService: ConvertServiceComponent,
    private cdr: ChangeDetectorRef,
  ) { }

  @Input() mainType: string = "";
  @Input() subType: string = "728";
  @Input() regionType: string = "all";

  pieData: any[] = [];
  columnData: any[] = [];
  tableData: any[] = [];


  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();

  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }


  async ngOnInit() {
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

    // if(this.subType == Constant.SUB_TYPE_DEVICE.ALL){
    //   if(this.mainType == Constant.MAIN_TYPE.QS){
    //     this.subType = Constant.SUB_TYPE_DEVICE.QS_QP;
    //   }else if(this.mainType == Constant.MAIN_TYPE.CD){
    //     this.subType = Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA;
    //   }
    // }
    let thongKeThietBi = await this.supabase.getThongKeBieuDoTronPopupMiddPanel(this.mainType, this.subType, "ROUTER", this.convertService.getRegionType(this.regionType));

    this.pieData = [
      {
        name: 'Đang hoạt động',
        value: thongKeThietBi?.find((e: any) => e?.status == true)?.count || 0,
        itemStyle: { color: 'rgba(4, 94, 43, 1)' }
      },
      {
        name: 'Mất kết nối',
        value: thongKeThietBi?.find((e: any) => e?.status == false)?.count || 0,
        itemStyle: { color: 'rgba(242, 159, 6, 1)' }
      },
    ];

    let thongKeBieuDoCotRouter: any = await this.supabase.getThongKeBieuDoCotRouter(this.mainType, this.subType, this.convertService.getRegionType(this.regionType));

    const statistics: any = {};

    // Duyệt qua từng đối tượng trong mảng `data` bằng vòng lặp `for`
    for (let i = 0; i < thongKeBieuDoCotRouter.length; i++) {
      const item = thongKeBieuDoCotRouter[i];
      const sources = item.sources;

      // Duyệt qua từng nguồn trong mảng `sources`
      for (let j = 0; j < sources.length; j++) {
        const source = sources[j];

        // Nếu nguồn (source) chưa có trong thống kê, tạo nó
        if (!statistics[source]) {
          statistics[source] = {
            source,
            connect: 0,
            disconnect: 0
          };
        }

        // Thống kê số lần `status` là `true` (connect) hoặc `false` (disconnect)
        if (item.status) {
          statistics[source].connect += item?.count;
        } else {
          statistics[source].disconnect += item?.count;
        }
      }
    }
    console.log("result: ", thongKeBieuDoCotRouter);


    // Chuyển đổi đối tượng thành mảng kết quả
    const result = Object.values(statistics);

    this.columnData = result;

    // let tempTable:any  = await this.supabase.getDanhSachThietBiPopupMidPanel(this.mainType,this.subType,"ROUTER",this.convertService.getRegionType(this.regionType),'','',"HSM");

    // this.tableData = tempTable;
    this.cdr.detectChanges();
  };
  getValueName(str: string) {
    let key: any = {
      truycap: "Định tuyến",
      loi: "Lớp lõi",
      bien: "Lớp biên",
      rcy: 'Cơ yếu'
    };

    return key[str];
  }
}
