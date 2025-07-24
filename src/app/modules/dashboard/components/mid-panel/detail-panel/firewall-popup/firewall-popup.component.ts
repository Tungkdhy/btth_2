import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { TableDetail1Component } from './table-detail-firewall/table-detail-1.component';
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';
import { ColumnChartLeftPanelComponent } from './column-chart-left-panel/column-chart-left-panel.component';
import { Constant } from 'src/app/core/config/constant';
import { StatisticPieChartPopupComponent } from '../../../shared/statistic-chart-popup/statistic-pie-chart-popup.component';

@Component({
  selector: 'app-firewall-popup',
  standalone: true,
  imports: [CommonModule, TableDetail1Component, ColumnChartLeftPanelComponent, StatisticPieChartPopupComponent],
  templateUrl: './firewall-popup.component.html',
  styleUrls: ['./firewall-popup.component.scss']
})
export class FirewallPopupComponent implements OnInit,OnChanges {

  @Input() mainType: string = "";
  @Input() regionType: string = "all";
  @Input() subType: string = "728";

  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();
  pieData:any[];
  columnData: any[] = [];
  tableData: any;


  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }
  constructor(
    private supabase: SupabaseService,
    private convertService:ConvertServiceComponent,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    // await this.getData();
  }

  async ngOnChanges(changes: SimpleChanges){
    if(changes?.subType?.currentValue){
      if(this.subType == Constant.SUB_TYPE_DEVICE.ALL){
        if(this.mainType == Constant.MAIN_TYPE.QS){
          this.subType = Constant.SUB_TYPE_DEVICE.QS_QP;
        }else if(this.mainType == Constant.MAIN_TYPE.CD){
          this.subType = Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA;
        }
      }
    }else if(changes?.mainType?.currentValue == '' || changes?.mainType?.currentValue){
      if(this.mainType == Constant.MAIN_TYPE.QS){
        this.subType = Constant.SUB_TYPE_DEVICE.QS_QP;
      }else if(this.mainType == Constant.MAIN_TYPE.CD){
        this.subType = Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA;
      }else{
        this.subType = Constant.SUB_TYPE_DEVICE.ALL;
      }
    }
    await this.getData();
  }

  async getData(){

    // if(this.subType == Constant.SUB_TYPE_DEVICE.ALL){
    //   if(this.mainType == Constant.MAIN_TYPE.QS){
    //     this.subType = Constant.SUB_TYPE_DEVICE.QS_QP;
    //   }else if(this.mainType == Constant.MAIN_TYPE.CD){
    //     this.subType = Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA;
    //   }
    // }

    let thongKeSwitch = await this.supabase.getThongKeBieuDoTronPopupMiddPanel(this.mainType,this.subType,"FIREWALL",this.convertService.getRegionType(this.regionType));
    this.pieData = [
      { 
        name: 'Đang hoạt động', 
        value: thongKeSwitch?.find((e:any)=>e?.status == true)?.count  || 0,
        itemStyle: { color: 'rgba(4, 94, 43, 1)' }
      },
      { 
        name: 'Mất kết nối', 
        value: thongKeSwitch?.find((e:any)=>e?.status == false)?.count  || 0,
        itemStyle: { color: 'rgba(242, 159, 6, 1)' }
      },
    ];


    let thongKeBieuDoCotFirewall:any = await this.supabase.getThongKeBieuDoCotFirewallPopupMidPanel(this.mainType,this.subType,this.convertService.getRegionType(this.regionType));
    const statistics:any = {};

    // Duyệt qua từng đối tượng trong mảng `data` bằng vòng lặp `for`
    for (let i = 0; i < thongKeBieuDoCotFirewall.length; i++) {
        const item = thongKeBieuDoCotFirewall[i];
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

    // Chuyển đổi đối tượng thành mảng kết quả
    const result = Object.values(statistics);
    this.columnData = result;

    let tempTable  = await this.supabase.getDanhSachThietBiPopupMidPanel(this.mainType,this.subType,'FIREWALL',this.convertService.getRegionType(this.regionType));

    this.tableData = tempTable;
    this.cdr.detectChanges();
  }
}
