import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { TableDetail1Component } from "./table-detail-safety-network/table-detail-1.component";
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';
import { ColumnChartLeftPanelComponent } from "./column-chart-left-panel/column-chart-left-panel.component";
import { Constant } from 'src/app/core/config/constant';
import { StatisticPieChartPopupComponent } from '../../../shared/statistic-chart-popup/statistic-pie-chart-popup.component';

@Component({
  selector: 'app-safety-network-popup',
  standalone: true,
  imports: [CommonModule, TableDetail1Component, ColumnChartLeftPanelComponent, StatisticPieChartPopupComponent],
  templateUrl: './safety-network-popup.component.html',
  styleUrls: ['./safety-network-popup.component.scss']
})
export class SafetyNetworkPopupComponent implements OnInit,OnChanges {
  constructor(
    private supabase: SupabaseService,
    private convertService:ConvertServiceComponent,
    private cdr: ChangeDetectorRef,
  ) {}

  @Input() mainType: string = "";
  @Input() subType: string = "728";
  @Input() regionType: string = "all";
  @Input() startDate: string = "";
  @Input() endDate:string = "";
  @Input() isClickTrongNgay:boolean = false;
  @Input() is_at_coban:boolean = false;

  pieData: any[] = [];
  columnData: any[] = [];
  tableData: any[] = [];

  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();

  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }

  async ngOnInit() {
    //  await this.getData();
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

  let safetyList = await this.supabase.fetchAtCat(this.mainType,this.subType,this.convertService.getRegionType(this.regionType),'','',this.isClickTrongNgay,this.startDate,this.endDate);

  const aTCoBan = safetyList
  .filter((item:any) => item?.data?.mang_at ==="ATCB")
  .reduce((sum:number, item:any) => sum + item.data.count, 0);
  const aTNangCao = safetyList
  .filter((item:any) => item?.data?.mang_at ==="ATNC")
  .reduce((sum:number, item:any) => sum + item.data.count, 0);
  this.pieData = [
      { 
        name: 'An toàn cơ bản', 
        value: aTCoBan  || 0,
        itemStyle: { color: 'rgba(4, 94, 43, 1)' }
      },
      { 
        name: 'An toàn nâng cao', 
        value: aTNangCao  || 0,
        itemStyle: { color: 'rgba(242, 159, 6, 1)' }
      },
    ];
    let tempArray:any= [];
      tempArray=[{
        name: "An toàn mạng cơ bản",
        cap1:  safetyList.find((item:any) => item?.data?.mang_at === 'ATCB' && item?.data?.cap === "Cấp 1" )?.data?.count || 0,
        cap2:safetyList.find((item:any) => item?.data?.mang_at === 'ATCB' && item?.data?.cap === "Cấp 2" )?.data?.count || 0,
        cap3:safetyList.find((item:any) => item?.data?.mang_at === 'ATCB' && item?.data?.cap === "Cấp 3" )?.data?.count || 0,
      },
    {
      name: "An toàn mạng nâng cao",
      cap1:  safetyList.find((item:any) => item?.data?.mang_at === 'ATNC' && item?.data?.cap === "Cấp 1" )?.data?.count || 0,
      cap2:safetyList.find((item:any) => item?.data?.mang_at === 'ATNC' && item?.data?.cap === "Cấp 2" )?.data?.count || 0,
      cap3:safetyList.find((item:any) => item?.data?.mang_at === 'ATNC' && item?.data?.cap === "Cấp 3" )?.data?.count || 0,
    }]

    this.columnData = tempArray;


    let tempTable:any  = await this.supabase.fetchAtList(this.mainType,this.subType,this.convertService.getRegionType(this.regionType),'',null,this.isClickTrongNgay,'','',this.startDate,this.endDate);
    this.tableData = tempTable;

    this.cdr.detectChanges();
}
}
