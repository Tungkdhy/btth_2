import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { TableDetail1Component } from './table-detail-common/table-detail-1.component';
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';
import { ColumnChartLeftPanelComponent } from './column-chart-left-panel/column-chart-left-panel.component';
import { Constant } from 'src/app/core/config/constant';
import { StatisticPieChartPopupComponent } from '../../../shared/statistic-chart-popup/statistic-pie-chart-popup.component';

@Component({
  selector: 'app-common-popup',
  standalone: true,
  imports: [
    CommonModule,
    ColumnChartLeftPanelComponent,
    TableDetail1Component,
    StatisticPieChartPopupComponent
  ],
  templateUrl: './common-popup.component.html',
  styleUrls: ['./common-popup.component.scss'],
})
export class CommonPopupComponent implements OnInit {
  constructor(
    private supabase: SupabaseService,
    private convertService: ConvertServiceComponent,
    private cdr: ChangeDetectorRef,
  ) {}

  @Input() mainType: string = '';
  @Input() regionType: string = 'all';
  @Input() subType: string = "728";

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

  async getData() {

    // if(this.subType == Constant.SUB_TYPE_DEVICE.ALL){
    //   if(this.mainType == Constant.MAIN_TYPE.QS){
    //     this.subType = Constant.SUB_TYPE_DEVICE.QS_QP;
    //   }else if(this.mainType == Constant.MAIN_TYPE.CD){
    //     this.subType = Constant.SUB_TYPE_DEVICE.TRONG_YEU_QUOC_GIA;
    //   }
    // }

    let thongKeEndPoint = await this.supabase.getBieuDoTronUDDVPopupMidPanel(
      this.mainType,
      this.subType,
      'COMMON',
      this.convertService.getRegionType(this.regionType),
    );

    this.pieData = [
      {
        name: 'Đang hoạt động',
        value: thongKeEndPoint?.find((e: any) => e?.status == true)?.count || 0,
        itemStyle: { color: 'rgba(4, 94, 43, 1)' }
      },
      {
        name: 'Không hoạt động',
        value: thongKeEndPoint?.find((e: any) => e?.status == false)?.count || 0,
        itemStyle: { color: 'rgba(242, 159, 6, 1)' } 
      },
    ];

    let danhSachThongKeMatKetNoiThietBi: any =
      await this.supabase.getBIeuDoCotUDDVPopupMidPanel(
        this.mainType,
        this.subType,
        'COMMON',
        this.convertService.getRegionType(this.regionType),
      );
      let priority = ["A40", "A91", "A99"];

      danhSachThongKeMatKetNoiThietBi.sort((a:any, b:any) => {
      return priority.indexOf(a.name) - priority.indexOf(b.name);
      });
    let tempArray: any = [];
    for (let item of danhSachThongKeMatKetNoiThietBi) {
      tempArray.push({
        name: this.convertService.getName(item.name),
        connect: item?.connect || 0,
        disconnect: item?.disconnect || 0,
      });
    }

    this.columnData = tempArray;

    let tempTable: any = await this.supabase.getTableUDDVPopupMidPanel(
      this.mainType,
      this.subType,
      'COMMON',
      this.convertService.getRegionType(this.regionType),
    );
    this.tableData = tempTable;

    this.cdr.detectChanges();
  }
}
