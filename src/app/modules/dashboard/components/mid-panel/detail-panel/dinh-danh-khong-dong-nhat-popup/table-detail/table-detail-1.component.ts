import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
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
import { ChangeEventArgs, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
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
    MultiSelectModule

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

  @Input() isClickTrongNgay:boolean = false;
  sources: any = [];
  searchText: string = '';
  statusType: string = '';

  public data: { [key: string]: Object }[] = [
    { Id: 'FMS', Name: 'FMS' },
    { Id: 'FIDELIS', Name: 'FIDELIS' },
    { Id: 'TA21', Name: 'TA21' },
    { Id: 'MMS', Name: 'MMS' },
    { Id: 'NextAV', Name: 'NextAV' },
];

public fields: Object = { text: 'Name', value: 'Id' };
public placeholder: string = 'Nguồn';
public selectedValues: any[] = [];
  public dataSource: any[]=[];

  page = 1;
  pageSize = 4;
  total =0;

  constructor(
    private supabase: SupabaseService,
    private convertService:ConvertServiceComponent,
    private cdr: ChangeDetectorRef,
    private excelService: ExcelService,
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
    let data:any = await this.supabase.trienKhaiGiaiPhapATTTTrenThietBiDauCuoi(this.mainType,this.subType,null,null,this.sources,3,this.isClickTrongNgay,this.searchText,this.statusType,this.startDate,this.endDate,page,this.pageSize);

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

  async onChange(event: ChangeEventArgs) {

    this.sources = event.value;

    let data:any = await this.supabase.trienKhaiGiaiPhapATTTTrenThietBiDauCuoi(this.mainType,this.subType,null,null,this.sources,3,this.isClickTrongNgay,this.searchText,this.statusType,this.startDate,this.endDate);

    this.dataSource = data?.items;
    this.page = data?.page_index;
    this.pageSize =data?.page_size;
    this.total = data.total;

    this.cdr.detectChanges();
}
async search(){
  let data: any = await this.supabase.trienKhaiGiaiPhapATTTTrenThietBiDauCuoi(this.mainType,this.subType,this.convertService.getRegionType(this.regionType),null,this.sources,3,this.isClickTrongNgay,this.searchText,this.statusType,this.startDate,this.endDate,);

  this.dataSource = data?.items;
  this.page =  data?.page_index;
  this.pageSize = data?.page_size;
  this.total =  data?.total;
  this.cdr.detectChanges();
}
async exportExcel() {
  let data: any = await this.supabase.trienKhaiGiaiPhapATTTTrenThietBiDauCuoi(this.mainType,this.subType,this.convertService.getRegionType(this.regionType),null,this.sources,3,this.isClickTrongNgay,this.searchText,this.statusType,this.startDate,this.endDate,1,999999);
  // this.dataSource = data?.items;
  let data_sheet = [];

  for (let item of data.items) {
    data_sheet.push({
      IP: item.fms?.ip || item.ta21?.ip || item.fidelis?.ip || item.soci?.ip,
      Mac:  item.fms?.mac || item.ta21?.mac || item.soci?.mac,
      Unit: item?.unit_name_full?.split("\n")[0],
      ParentUnit: item?.unit_name_full?.split("\n")[1],
      TypeNetwork: this.getTypeNetwork(item?.main_type),
      Region: this.getRegionType(item?.loploi),
      LastActive: formatDate(item?.last_active, "dd-MM-yyyy HH:mm:ss", 'en-US') || '',
      Status: item?.not_online ? "Không hoạt động" : "Đang hoạt động",
    });
  }
  // Tạo một work sheet từ dữ liệu
  this.excelService.exportExcel(data_sheet, 'Định danh không đồng nhất');
}
  getTypeNetwork(type:string){
    return this.convertService.getTypeNetwork(type);
  }
  getRegionType(region:string){
    return this.convertService.getName(region);
  }
  getUnitName(unit_id:any){
    let unitStr:any = localStorage.getItem('getUnits')?.toString();

    let unitJSON = JSON.parse(unitStr);

    let unit = unitJSON?.find((e:any)=>e?.id == unit_id);
    let unit_parent = unitJSON?.find((e:any)=>e?.id == unit?.parent_id);

    return `${unit?.name_short} (${unit_parent?.name_short})`;
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
