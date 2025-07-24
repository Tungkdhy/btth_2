import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { TableDetail1Component } from "./table-detail-dau-cuoi/table-detail-1.component";
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';
import { Constant } from 'src/app/core/config/constant';
import { ColumnChartLeftPanelComponent } from "./column-chart-left-panel/column-chart-left-panel.component";
import { StatisticPieChartPopupComponent } from '../../../shared/statistic-chart-popup/statistic-pie-chart-popup.component';

@Component({
  selector: 'app-thiet-bi-dau-cuoi-popup',
  standalone: true,
  imports: [CommonModule, TableDetail1Component, ColumnChartLeftPanelComponent, StatisticPieChartPopupComponent],
  templateUrl: './thiet-bi-dau-cuoi-popup.component.html',
  styleUrls: ['./thiet-bi-dau-cuoi-popup.component.scss']
})
export class ThietBiDauCuoiPopupComponent {
  @Input() mainType: string = "";
  @Input() subType: string = "728";
  @Input() isClickTrongNgay:boolean = false;
  @Input() startDate: string = "";
  @Input() endDate:string = "";
  @Input() regionType: string = "all";

  pieData: any[] = [];
  columnData: any[] = [];
  tableData: any;

  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();


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

    let thongKeThietBi = await this.supabase.getThongKeBieuDoTronThietBiDauCuoiMidPanel(this.mainType,this.subType,1,this.convertService.getRegionType(this.regionType),this.isClickTrongNgay,this.startDate,this.endDate);
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

    let thongKeBieuDoCot:any = await this.supabase.getThongKeBieuDoCotThietBiDauCuoiMidPanel(this.mainType,this.subType,1,this.convertService.getRegionType(this.regionType),this.isClickTrongNgay,this.startDate,this.endDate);

    const result:any = {};

    for (let i = 0; i < thongKeBieuDoCot.length; i++) {
        const item = thongKeBieuDoCot[i];
        const count = item.count;

        for (let j = 0; j < item.sources.length; j++) {
            const source = item.sources[j];

            if (result[source]) {
              result[source] += count;
            } else {
              result[source] = count;
            }
        }
    }

    let jsonResult = Object.keys(result).map(key => {
      return { name: key, count: result[key] };
  });
    this.columnData = jsonResult;

    this.tableData  = await this.supabase.trienKhaiGiaiPhapATTTTrenThietBiDauCuoi(this.mainType,this.subType,this.convertService.getRegionType(this.regionType),null,[],1,this.isClickTrongNgay,'','',this.startDate,this.endDate);
    this.cdr.detectChanges();
  }
}
