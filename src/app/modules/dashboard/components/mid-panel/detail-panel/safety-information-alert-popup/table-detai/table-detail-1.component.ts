import {
  ChangeDetectorRef,
  Component,
  Input,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import {
  NgbModal,
  NgbPagination,
  NgbPaginationModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { NumberFormatPipe } from "../../../../../../../core/pipes/number-format/number-format.pipe";
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { ProcessDetailModalComponent } from '../../../../shared/process-detail-modal/process-detail-modal.component';
import { DetailDeviceModalComponent } from '../../../../shared/detail-device-modal/detail-device-modal.component';
import { ExcelService } from 'src/app/modules/dashboard/services/excel.service';

@Component({
  selector: 'app-table-detail',
  standalone: true,
  imports: [
    CommonModule,
    NgbPagination,
    FormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NumberFormatPipe,
    DropDownListModule
],
  templateUrl: './table-detail-1.component.html',
  styleUrls: ['./table-detail-1.component.scss'],
})
export class TableDetail1Component {

  @Input() mainType: string = "";
  @Input() subType: string = "728";
  @Input() tableData: any;
  @Input() regionType: string = "all";
  @Input() startDate: string = "";
  @Input() endDate:string = "";
  @Input() columnType: string = '';

  public dataSource: any[]=[];

  searchText: string = '';
  statusType: string = '';
  alertSource: string = '';
  xuLyType: string = '';

  page = 1;
  pageSize = 5;
  total = 0;

  constructor(
    private supabase: SupabaseService,
    private convertService: ConvertServiceComponent,
    private cdr: ChangeDetectorRef,
    private excelService:ExcelService,
    private modal: NgbModal,
  ) {}

  async ngOnInit() {
    let checkUnits:any =  localStorage.getItem('getUnits');
    if(!checkUnits || checkUnits.toString() == '[]'){
      let getUnits = await this.supabase.getUnit();
      localStorage.setItem('getUnits', JSON.stringify(getUnits));
    };
  }

  async onPageChange(page: number) {
    this.page = page;
    let data = await this.supabase.getDanhSachCanhBao('',this.mainType,this.subType,this.columnType,this.convertService.getRegionType(this.regionType),null,this.searchText,this.alertSource,this.xuLyType,page,this.pageSize,this.startDate,this.endDate);

    this.dataSource = data.items;
    this.cdr.detectChanges();

  }
  async ngOnChanges(changes: SimpleChanges) {
    this.dataSource = this.tableData?.items;
    this.page = this.tableData?.page_index;
    this.pageSize = this.tableData?.page_size;
    this.total = this.tableData?.total;
    this.cdr.detectChanges();
  }
  async search(){
    let data = await this.supabase.getDanhSachCanhBao('',this.mainType,this.subType,this.columnType,this.convertService.getRegionType(this.regionType),null,this.searchText,this.alertSource,this.xuLyType,1,this.pageSize,this.startDate,this.endDate);
    this.dataSource = data?.items;
    this.page =  data?.page_index;
    this.pageSize = data?.page_size;
    this.total =  data?.total;
    this.cdr.detectChanges();
  }

  async exportExcel(){
      let data = await this.supabase.getDanhSachCanhBao('',this.mainType,this.subType,this.columnType,this.convertService.getRegionType(this.regionType),null,this.searchText,this.alertSource,this.xuLyType,1,9999,this.startDate,this.endDate);
      let data_sheet = [];
      for(let item of data?.items || []){
        data_sheet.push({
          IP:item?.source_ip || " ",
          MAC:item?.source_mac|| " ",
          AlertType:this.getValueAlertType(item?.alert_type),
          Manage:  item?.employee_name,
          Position: item?.employee_position,
          Unit:this.getUnitName(item?.unit_path),
          ParentUnit:this.getUnitNameParent(item?.unit_path) || "",
          Type: this.getTypeNetwork(item?.main_type),
          Region: this.getRegionType(item?.loploi),
          LastActive:formatDate(item?.last_active,"dd-MM-yyyy HH:mm:ss",'en-US')||'',
          Detail:  item?.message,
          Source: item?.alert_source,
          Status: item?.khacfuc?.status || "Chưa xử lý",
          Result: item?.khacfuc?.note || " ",
        })
      }

      this.excelService.exportExcel(data_sheet,'Sự cố mất ATTT');
    }

  openProcessDetailModal(id: number,alert_type:string): void {
    let infoModal = this.modal.open(ProcessDetailModalComponent, {
      modalDialogClass: 'dialogClass',
      centered: true,
    });
    // TODO: Pass data to child
    infoModal.componentInstance.id = id;
    infoModal.componentInstance.sys = alert_type;

    infoModal.componentInstance.startDate = this.startDate;
    infoModal.componentInstance.endDate = this.endDate;

  }
  getValueAlertType(name: any) {
    let key: any = {
      MALWARE: 'Mã độc',
      BLACK_DOMAIN: 'Tên miền',
      INTERNET: 'Kết nối Internet',
      HUNTING: 'Bất thường',
    };
    return key[name] || '';
  }
  getTypeNetwork(type: string) {
    return this.convertService.getTypeNetwork(type);
  }
  getRegionType(region: string) {
    return this.convertService.getName(region);
  }
  getUnitName(unit_id:any){

    let unitStr:any = localStorage.getItem('getUnits')?.toString();

    let unitJSON = JSON?.parse(unitStr) || null;

    let unit = unitJSON?.find((e:any)=>e?.path == unit_id);
    return unit?.name_short;
  }

  getUnitNameParent(unit_id:any){

    let unitStr:any = localStorage.getItem('getUnits')?.toString();

    let unitJSON = JSON?.parse(unitStr) || null;

    // let unit = unitJSON?.find((e:any)=>e?.path == unit_id);

    // Tìm vị trí của dấu chấm cuối cùng
    let lastDotIndex = unit_id?.lastIndexOf('.') != -1 ? unit_id?.lastIndexOf('.') : unit_id.length;

// Lấy phần chuỗi từ đầu đến trước dấu chấm cuối cùng
    let trimmedUnitPath = unit_id?.substring(0, lastDotIndex);

    let unit_parent = unitJSON?.find((e:any)=>e?.path == trimmedUnitPath);
    return unit_parent?.name_short;
  }
  openInfoDeviceModal(mac: any): void {
    let infoModal = this.modal.open(DetailDeviceModalComponent, {
      modalDialogClass: 'dialogClass',
      centered: true,
    });
    // TODO: Pass data to child
    infoModal.componentInstance.serialNumber = mac;
    infoModal.componentInstance.type = 'SERVER';
  }
}
