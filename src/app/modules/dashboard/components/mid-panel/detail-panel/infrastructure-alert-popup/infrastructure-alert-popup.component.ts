import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableDetail1Component } from './table-detai/table-detail-1.component';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { Constant } from 'src/app/core/config/constant';
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';
import { PieChartLeftPanelComponent } from "./pie-chart-left-panel/pie-chart-left-panel.component";
import { ColumnChartLeftPanelComponent } from "./column-chart-left-panel/column-chart-left-panel.component";

@Component({
  selector: 'app-infrastructure-alert-popup',
  standalone: true,
  imports: [CommonModule, TableDetail1Component, TableDetail1Component, PieChartLeftPanelComponent, ColumnChartLeftPanelComponent],
  templateUrl: './infrastructure-alert-popup.component.html',
  styleUrls: ['./infrastructure-alert-popup.component.scss'],
})
export class InfrastructureAlertPopupComponent {
  @Input() mainType: string = '';
  @Input() regionType: string = 'all';
  @Input() subType: string = "728";
  @Input() startDate: string = "";
  @Input() endDate:string = "";
  @Input() alertType: string = "";

  xuLyType: string = "";

  isPopupVisible: boolean = false;
  @Output() togglePopupEvent = new EventEmitter<boolean>();

  pieData:any[];
  columnData: any[] = [];
  tableData: any[]=[];

  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }
  constructor(
    private supabase: SupabaseService,
    private convertService:ConvertServiceComponent,
    private cdr: ChangeDetectorRef,
  ) {}

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

    let suCoMKN = await this.supabase.getSuCoMKNCat(this.mainType,this.subType,this.convertService.getRegionType(this.regionType),null,null,this.startDate,this.endDate);

    let bieudotron = suCoMKN?.bieudotron;

    this.pieData = [
      { x: 'Đã xử lý', y: bieudotron?.find((e:any)=>e?.status_2 == 'Đã xử lý')?.count  || 0 },
      { x: 'Chưa xử lý',y: bieudotron?.find((e:any)=>e?.status_2 == 'Chưa xử lý')?.count  || 0 },
      { x: 'Đang xử lý',y: bieudotron?.find((e:any)=>e?.status_2 == 'Đang xử lý')?.count  || 0 },
    ];
    let bieudocot = suCoMKN?.bieudocot || [];
    let priority = ["A40", "A91", "A99"];

    bieudocot.sort((a:any, b:any) => {
    return priority.indexOf(a.loploi) - priority.indexOf(b.loploi);
    });
    let lop_loi_list:any = [];

    for(let item of bieudocot){
      if(!lop_loi_list[item?.loploi]){
        lop_loi_list.push(item?.loploi)
      }
    };
    let tempArray:any = [];

    for(let loploi of lop_loi_list){
      tempArray.push({
        name: this.convertService.getName(loploi),
        da_xu_ly: bieudocot?.find((e:any)=>e?.status_2 == 'Đã xử lý' && e?.loploi == loploi)?.count || 0,
        chua_xu_ly: bieudocot?.find((e:any)=>e?.status_2 == 'Chưa xử lý' && e?.loploi == loploi)?.count || 0,
        dang_xu_ly: bieudocot?.find((e:any)=>e?.status_2 == 'Đang xử lý' && e?.loploi == loploi)?.count || 0,
      },)
    }

    this.columnData = tempArray;

    let tempTable = await this.supabase.getDanhSachHeThongMatKetNoi(
      this.mainType,
      this.subType,
      this.alertType,
      this.convertService.getRegionType(this.regionType),
      '',
      '',
      this.xuLyType,
      1, 5,
      this.startDate,
      this.endDate
    );

    this.tableData = tempTable;
    this.cdr.detectChanges();
  }
}
