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
import { ColumnChartLeftPanelComponent } from '../shared/column-chart-left-panel/column-chart-left-panel.component';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { TableDetail1Component } from './table-detail-server/table-detail-1.component';
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';
import { UploadPostBarComponent } from "./info-bar/info-bar.component";
import { Constant } from 'src/app/core/config/constant';
import { StatisticPieChartPopupComponent } from '../../../shared/statistic-chart-popup/statistic-pie-chart-popup.component';

@Component({
  selector: 'app-server-popup',
  standalone: true,
  imports: [
    CommonModule,
    ColumnChartLeftPanelComponent,
    StatisticPieChartPopupComponent,
    TableDetail1Component,
    UploadPostBarComponent
],
  templateUrl: './server-popup.component.html',
  styleUrls: ['./server-popup.component.scss'],
})
export class ServerPopupComponent implements OnInit {
  constructor(
    private supabase: SupabaseService,
    private convertService: ConvertServiceComponent,
    private cdr: ChangeDetectorRef,
  ) {}

  @Input() mainType: string = '';
  @Input() subType: string = '728';
  @Input() regionType: string = 'all';

  pieData: any[] = [];
  columnData: any[] = [];
  tableData: any;

  columnDataOS: any[] = [];
  columnDataRAM: any[] = [];
  columnDataStorage: any[] = [];

  uploadPostTitleRAM="Thống kê theo RAM";
  uploadPostTitleStorage="Thống kê theo ổ cứng";
  uploadPostTitleOS="Thống kê theo hệ điều hành";

  isPopupVisible: boolean = true;
  @Output() togglePopupEvent = new EventEmitter<boolean>();

  togglePopup(isPopupVisible: boolean) {
    this.togglePopupEvent.emit(isPopupVisible);
  }

  async ngOnInit() {
    // await this.getData();
    // this.cdr.detectChanges();
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

    let thongKeEndPoint = await this.supabase.getThongKeBieuDoTronEndPointMidPanel(this.mainType,this.subType,'SERVER',this.convertService.getRegionType(this.regionType));

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
    
    let columnData = await this.supabase.getBieuDoBarEndPointDevice(this.mainType,this.subType,this.convertService.getRegionType(this.regionType),'SERVER');    
    let osData:any = columnData?.find((e:any)=>e.name =="os")?.groupx || [];

    let osOrder:any = {
      "Windows Server 2019":1,
      "Windows Server 2016":2,
      "Windows Server 2012":3,
      "Windows Server 2008":4,
      "Windows 10":5,
      "Windows 8":6,
      "Windows 7":7,
      "Linux":8,
      "Không xác định":9,
    };
    osData.sort((a:any, b:any) => osOrder[b?.group_by] - osOrder[a?.group_by])
    this.columnDataOS = osData;    
    let ramData = columnData?.find((e:any)=>e?.name =="ram")?.groupx || [];
    let ramOrder:any = {
      "<4GB": 1,
      "4-8GB": 2,
      "8-16GB": 3,
      ">16GB": 4
    };
    ramData.sort((a:any, b:any) => ramOrder[b?.group_by] - ramOrder[a?.group_by]);

    this.columnDataRAM = ramData;

    let sizeOrder:any = {
      "<250GB": 1,
      "250-500GB": 2,
      "500GB -1TB": 3,
      ">1TB": 4
    };

    let storageData  =  columnData?.find((e:any)=>e?.name =="storage")?.groupx || [];
    storageData.sort((a:any, b:any) => sizeOrder[b?.group_by] - sizeOrder[a?.group_by]);

    this.columnDataStorage =storageData;

    let tempTable = await this.supabase.getTableEndPoindMidPanel(this.mainType,this.subType,'SERVER',this.convertService.getRegionType(this.regionType));

    this.tableData = tempTable;

    this.cdr.detectChanges();
  }


}
