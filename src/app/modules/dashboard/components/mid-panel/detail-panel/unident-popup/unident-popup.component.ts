import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableDetail1Component } from "./table-detail/table-detail-1.component";
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';
import { Constant } from 'src/app/core/config/constant';
import { ColumnChartLeftPanelComponent } from "./column-chart-left-panel/column-chart-left-panel.component";
import { StatisticPieChartPopupComponent } from '../../../shared/statistic-chart-popup/statistic-pie-chart-popup.component';

@Component({
  selector: 'app-unident-popup',
  standalone: true,
  imports: [CommonModule, TableDetail1Component, ColumnChartLeftPanelComponent, StatisticPieChartPopupComponent],
  templateUrl: './unident-popup.component.html',
  styleUrls: ['./unident-popup.component.scss']
})
export class UnidentPopupComponent {
  @Input() mainType: string = "";
  @Input() subType: string = "728";
  @Input() startDate: string = "";
  @Input() endDate:string = "";
  @Input() isClickTrongNgay:boolean = false;
  @Input() regionType: string = "all";

  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();
  pieData: any[] = [];
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

  }
  async ngOnChanges(changes: SimpleChanges) {

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


    let thongKeThietBi = await this.supabase.getThongKeBieuDoTronThietBiDauCuoiMidPanel(this.mainType,this.subType,2,this.convertService.getRegionType(this.regionType),this.isClickTrongNgay,this.startDate,this.endDate);
    this.pieData = [
      { 
        name: 'Đang hoạt động', 
        value: thongKeThietBi?.find((e:any)=>e?.not_online == false)?.count  || 0,
        itemStyle: { color: 'rgba(4, 94, 43, 1)' }
      },
      { 
        name: 'Không hoạt động', 
        value: thongKeThietBi?.find((e:any)=>e?.not_online == true)?.count  || 0,
        itemStyle: { color: 'rgba(242, 159, 6, 1)' } 
      },
    ];
    let thongKeBieuDoCot:any = await this.supabase.getThongKeBieuDoCotThietBiDauCuoiMidPanel(this.mainType,this.subType,2,this.convertService.getRegionType(this.regionType),this.isClickTrongNgay,this.startDate,this.endDate);

    let priority = ["A40", "A91", "A99"];

    thongKeBieuDoCot.sort((a:any, b:any) => {
    return priority.indexOf(a.loploi) - priority.indexOf(b.loploi);
    });
    let tempArray = [];

    for(let item of thongKeBieuDoCot){
      tempArray.push({
        name: this.convertService.getName(item?.loploi),
        count:item?.count,
      })
    }
    this.columnData = tempArray;
    this.tableData  = await this.supabase.trienKhaiGiaiPhapATTTTrenThietBiDauCuoi(this.mainType,this.subType,this.convertService.getRegionType(this.regionType),null,[],2,this.isClickTrongNgay,'','',this.startDate,this.endDate);
    this.cdr.detectChanges();
  }
}
