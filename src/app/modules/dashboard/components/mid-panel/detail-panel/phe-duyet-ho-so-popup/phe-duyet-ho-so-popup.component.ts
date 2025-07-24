import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { TableDetail1Component } from "./table-detail-phe-duyet-ho-so/table-detail-1.component";
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';
import { ColumnChartLeftPanelComponent } from "./column-chart-left-panel/column-chart-left-panel.component";
import { Constant } from 'src/app/core/config/constant';
import { StatisticPieChartPopupComponent } from '../../../shared/statistic-chart-popup/statistic-pie-chart-popup.component';

@Component({
  selector: 'app-phe-duyet-ho-so-popup',
  standalone: true,
  imports: [CommonModule, TableDetail1Component, ColumnChartLeftPanelComponent, StatisticPieChartPopupComponent],
  templateUrl: './phe-duyet-ho-so-popup.component.html',
  styleUrls: ['./phe-duyet-ho-so-popup.component.scss']
})
export class PheDuyetHoSoPopupComponent implements OnInit, OnChanges {
  constructor(
    private supabase: SupabaseService,
    private convertService: ConvertServiceComponent,
    private cdr: ChangeDetectorRef,
  ) { }

  @Input() mainType: string = "";
  @Input() subType: string = "728";
  @Input() regionType: string = "all";
  @Input() startDate: string = "";
  @Input() endDate: string = "";
  @Input() isClickTrongNgay: boolean = false;
  @Input() is_fe_duyet_3: boolean = false;
  @Input() is_fe_duyet_4: boolean = false;
  @Input() is_fe_duyet_5: boolean = false;

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

    let atHtttCat = await this.supabase.fetchAtHtttCat(this.mainType, this.subType, this.convertService.getRegionType(this.regionType), '', this.isClickTrongNgay, this.startDate, this.endDate);

    const totalCapdo1 = atHtttCat
      .filter((item: any) => item.data.capdo === "1")
      .reduce((sum: number, item: any) => sum + item.data.count, 0);
    const totalCapdo2 = atHtttCat
      .filter((item: any) => item.data.capdo === "2")
      .reduce((sum: number, item: any) => sum + item.data.count, 0);
    const totalCapdo3 = atHtttCat
      .filter((item: any) => item.data.capdo === "3")
      .reduce((sum: number, item: any) => sum + item.data.count, 0);

    // Calculate total count for capdo 4
    const totalCapdo4 = atHtttCat
      .filter((item: any) => item?.data?.capdo === "4")
      .reduce((sum: number, item: any) => sum + item.data.count, 0);
    this.pieData = [
      {
        name: 'Cấp độ 1',
        value: totalCapdo1 || 0,
        itemStyle: { color: '#045E2B' }
      },
      {
        name: 'Cấp độ 2',
        value: totalCapdo2 || 0,
        itemStyle: { color: '#0050C7' }
      },
      {
        name: 'Cấp độ 3',
        value: totalCapdo3 || 0,
        itemStyle: { color: '#F29F06' }
      },
      {
        name: 'Cấp độ 4',
        value: totalCapdo4 || 0,
        itemStyle: { color: '#D2001A' }
      },
    ];


    let tempArray = [
      {
        name: "Cấp độ 1",
        connect: atHtttCat.find((item: any) => item?.data?.capdo === '1' && item?.data?.fe_duyet === "Đã phê duyệt")?.data?.count || 0,
        disconnect: atHtttCat.find((item: any) => item?.data?.capdo === '1' && item?.data?.fe_duyet === "Chưa phê duyệt")?.data?.count || 0,
      },
      {
        name: "Cấp độ 2",
        connect: atHtttCat.find((item: any) => item?.data?.capdo === '2' && item?.data?.fe_duyet === "Đã phê duyệt")?.data?.count || 0,
        disconnect: atHtttCat.find((item: any) => item?.data?.capdo === '2' && item?.data?.fe_duyet === "Chưa phê duyệt")?.data?.count || 0,
      },
      {
        name: "Cấp độ 3",
        connect: atHtttCat.find((item: any) => item?.data?.capdo === '3' && item?.data?.fe_duyet === "Đã phê duyệt")?.data?.count || 0,
        disconnect: atHtttCat.find((item: any) => item?.data?.capdo === '3' && item?.data?.fe_duyet === "Chưa phê duyệt")?.data?.count || 0,
      },
      {
        name: "Cấp độ 4",
        connect: atHtttCat.find((item: any) => item?.data?.capdo === '4' && item?.data?.fe_duyet === "Đã phê duyệt")?.data?.count || 0,
        disconnect: atHtttCat.find((item: any) => item?.data?.capdo === '4' && item?.data?.fe_duyet === "Chưa phê duyệt")?.data?.count || 0,
      }
    ];

    this.columnData = tempArray;


    let tempTable: any = await this.supabase.fetchHtttList(this.mainType, this.subType, this.convertService.getRegionType(this.regionType), '', null, this.isClickTrongNgay, '', '', this.startDate, this.endDate, 1, 5);

    this.tableData = tempTable;

    this.cdr.detectChanges();
  }
}
