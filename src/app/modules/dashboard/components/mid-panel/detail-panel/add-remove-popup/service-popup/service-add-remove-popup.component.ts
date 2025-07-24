import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { TableDetail1Component } from "./table-detail-portal/table-detail-1.component";
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';
import { ColumnChartLeftPanelComponent } from "./column-chart-left-panel/column-chart-left-panel.component";
import { Constant } from 'src/app/core/config/constant';
import { PieChartLeftPanelComponent } from './pie-chart-left-panel/pie-chart-left-panel.component';

@Component({
  selector: 'app-service-add-remove-popup',
  standalone: true,
  imports: [CommonModule, PieChartLeftPanelComponent, TableDetail1Component, ColumnChartLeftPanelComponent],
  templateUrl: './service-add-remove-popup.component.html',
  styleUrls: ['./service-add-remove-popup.component.scss']
})
export class ServiceAddRemovePopupComponent implements OnInit,OnChanges {
  constructor(
    private supabase: SupabaseService,
    private convertService:ConvertServiceComponent,
    private cdr: ChangeDetectorRef,
  ) {}

  @Input() mainType: string = "";
  @Input() regionType: string = "all";
  @Input() subType: string = "728";
  @Input() startDate: string = "";
  @Input() endDate: string = "";
  @Input() typeAddRemove:string = "PORTAL";

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

  let bieuDoTron = await this.supabase.getBieuDoTronUDDVTangGiamPopupMidPanel(this.mainType,this.subType,this.typeAddRemove, this.convertService.getRegionType(this.regionType),this.startDate,this.endDate);

    this.pieData = [
      { x: 'Thêm mới', y:bieuDoTron[0]?.count  || 0},
      { x: 'Gỡ bỏ', y: 0 },
    ];


    let bieuDoCot:any = await this.supabase.getBIeuDoCotUDDVTangGiamPopupMidPanel(this.mainType,this.subType,this.typeAddRemove, this.convertService.getRegionType(this.regionType),this.startDate,this.endDate);

    let priority = ["A40", "A91", "A99"];

    bieuDoCot.sort((a:any, b:any) => {
    return priority.indexOf(a.name) - priority.indexOf(b.name);
    });
    let tempArray:any= [];
    for (let item of bieuDoCot) {
      tempArray.push({
        name: this.convertService.getName(item?.loi),
        add: item?.count || 0,
        remove:0,
      })
    };

    this.columnData = tempArray;


    let tempTable:any  = await this.supabase.getDanhSachUDDVTangGiamPopupMidPanel(this.mainType,this.subType,this.typeAddRemove,this.convertService.getRegionType(this.regionType),'','',this.startDate,this.endDate);

    this.tableData = tempTable;

    this.cdr.detectChanges();
}
getTypeServiceType(){
  let key:any = {
    "PORTAL":"cổng TTĐT",
    "COMMON":"dùng chung",
  }
  return key[this.typeAddRemove];
}
}
