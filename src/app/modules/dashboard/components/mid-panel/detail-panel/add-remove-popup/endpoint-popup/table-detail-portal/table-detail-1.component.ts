import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import {
  NgbModal,
  NgbPagination,
  NgbPaginationModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';
import { NumberFormatPipe } from 'src/app/core/pipes/number-format/number-format.pipe';
import { DetailDeviceModalComponent } from 'src/app/modules/dashboard/components/shared/detail-device-modal/detail-device-modal.component';
import { ExcelService } from 'src/app/modules/dashboard/services/excel.service';

@Component({
  selector: 'app-table-detail-1',
  standalone: true,
  imports: [
    CommonModule,
    NgbPagination,
    FormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NumberFormatPipe
],
  templateUrl: './table-detail-1.component.html',
  styleUrls: ['./table-detail-1.component.scss'],
})
export class TableDetail1Component {

  // }
  @Input() mainType: string = "";
  @Input() tableData: any;
  @Input() regionType: string = "all";
  @Input() subType: string = "728";
  @Input() startDate: string = "";
  @Input() endDate: string = "";
  @Input() typeAddRemove:string = "SERVER";

  searchText: string = '';
  source: string = '';

  public dataSource: any[]=[];

  page = 1;
  pageSize = 4;
  total =0;

  constructor(
    private supabase: SupabaseService,
    private convertService:ConvertServiceComponent,
    private cdr: ChangeDetectorRef,
    private modal: NgbModal,
    private excelService: ExcelService,
  ) {}

  ngOnInit() {
  }

  async onPageChange(page: number) {
    this.page = page;
    let data = await  await this.supabase.getDanhSachTangGiamEndPointMidPanel(this.mainType,this.subType,this.typeAddRemove, this.convertService.getRegionType(this.regionType),this.source,this.searchText,this.startDate,this.endDate,page,this.pageSize);

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

    let data = await this.supabase.getDanhSachTangGiamEndPointMidPanel(this.mainType,this.subType,this.typeAddRemove, this.convertService.getRegionType(this.regionType),this.source,this.searchText,this.startDate,this.endDate,1,this.pageSize);
    this.dataSource = data?.items;
    this.page =  data?.page_index;
    this.pageSize = data?.page_size;
    this.total =  data?.total;
    this.cdr.detectChanges();
  }
  async exportExcel() {
    let data = await this.supabase.getDanhSachTangGiamEndPointMidPanel(this.mainType,this.subType,this.typeAddRemove, this.convertService.getRegionType(this.regionType),this.source,this.searchText,this.startDate,this.endDate,1,99999);
    // this.dataSource = data?.items;
    let data_sheet = [];

    for (let item of data.items) {
      data_sheet.push({
        IP: item.fms?.ip || item.ta21?.ip || item.fidelis?.ip || item.soci?.ip,
        Mac:  item.fms?.mac || item.ta21?.mac || item.soci?.mac,
        EmployeeName:item.fms?.employee_name || item.ta21?.employee_name || item.soci?.employee_name ,
        EmployeePosition: item?.fms?.employee_position || item?.ta21?.employee_position || item.soci?.employee_position,
        Unit: item?.unit_name_full?.split("\n")[0],
        ParentUnit: item?.unit_name_full?.split("\n")[1],
        Source:item?.sources.toString(),
        TypeNetwork: this.getTypeNetwork(item?.main_type),
        Region: this.getNameRegion(item?.loploi),
        CreateAt: formatDate(item?.create_at, "dd-MM-yyyy HH:mm:ss", 'en-US') || '',
        Status: item?.not_online ? "Không hoạt động" : "Đang hoạt động",
      })
    }
    // Tạo một work sheet từ dữ liệu
    this.excelService.exportExcel(data_sheet, this.typeAddRemove);
  }
  getTypeNetwork(type:string){
    return this.convertService.getTypeNetwork(type);
  }
  getNameRegion(type:string){
    return this.convertService.getName(type);
  }
  getSources(sources: []) {
    return sources?.map((item: string) => item.toUpperCase());
  }
  openInfoDeviceModal(serial_number: any): void {
    let infoModal = this.modal.open(DetailDeviceModalComponent, {
      modalDialogClass: 'dialogClass',
      centered: true,
    });
    // TODO: Pass data to child
    infoModal.componentInstance.serialNumber = serial_number;
    infoModal.componentInstance.type = 'SERVER';
  }
}
