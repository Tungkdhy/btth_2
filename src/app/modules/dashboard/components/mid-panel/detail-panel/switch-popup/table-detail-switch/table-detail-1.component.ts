import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
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
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';
import { NumberFormatPipe } from '../../../../../../../core/pipes/number-format/number-format.pipe';
import { DetailDeviceModalComponent } from '../../../../shared/detail-device-modal/detail-device-modal.component';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
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
    NumberFormatPipe,
    DropDownListModule
  ],
  templateUrl: './table-detail-1.component.html',
  styleUrls: ['./table-detail-1.component.scss'],
})
export class TableDetail1Component implements OnInit {
  @Input() mainType: string = '';
  @Input() tableData: any;
  @Input() regionType: string = 'all';
  @Input() subType ='728';

  public data: { [key: string]: Object }[] = [
    { Id: 'NACS', Name: 'NACS' },
    { Id: 'NMS', Name: 'NMS' },
  ];

  source: string ="HSM";

  public fields: Object = { text: 'Name', value: 'Id' };
  public placeholder: string = 'Nguồn';
  public selectedValues: any[] = [];
  public dataSource: any[] = [];

  page = 1;
  pageSize = 4;
  total = 0;
  searchText: string = '';
  statusType: string = '';

  constructor(
    private supabase: SupabaseService,
    private convertService: ConvertServiceComponent,
    private modal: NgbModal,
    private cdr: ChangeDetectorRef,
    private excelService: ExcelService,
  ) {}

  ngOnInit() {}

  async onPageChange(page: number) {
    this.page = page;
    let data = await this.supabase.getDanhSachThietBiPopupMidPanel(
      this.mainType,
      this.subType,
      'SWITCH',
      this.convertService.getRegionType(this.regionType),
      this.searchText,
      this.statusType,
      this.source,
      null,
      page,
      this.pageSize,
    );

    this.dataSource = data.items;

    this.cdr.detectChanges();
  }
  async ngOnChanges(changes: SimpleChanges) {
    let data = await this.supabase.getDanhSachThietBiPopupMidPanel(this.mainType,this.subType,'SWITCH',this.convertService.getRegionType(this.regionType),this.searchText,this.statusType,this.source,null,1,this.pageSize);

    this.dataSource = data?.items;
    this.page = data?.page_index;
    this.pageSize =data?.page_size;
    this.total = data?.total;
    this.cdr.detectChanges();
  }
  async onChange(event: any) {

    this.source = event?.itemData?.Id;

    // let data = await this.supabase.getDanhSachThietBiPopupMidPanel(this.mainType,this.subType,'SWITCH',this.convertService.getRegionType(this.regionType),this.searchText,this.statusType,'',1,this.pageSize);

    // this.dataSource = data?.items;
    // this.page = data?.page_index;
    // this.pageSize =data?.page_size;
    // this.total = data.total;

    // this.cdr.detectChanges();
}
  async search(){
    let data = await this.supabase.getDanhSachThietBiPopupMidPanel(this.mainType,this.subType,'SWITCH',this.convertService.getRegionType(this.regionType),this.searchText,this.statusType,this.source,null,1,this.pageSize);
    this.dataSource = data?.items;
    this.page =  data?.page_index;
    this.pageSize = data?.page_size;
    this.total =  data?.total;
    this.cdr.detectChanges();
  }

  async exportExcel() {
    let data = await this.supabase.getDanhSachThietBiPopupMidPanel(this.mainType,this.subType,'SWITCH',this.convertService.getRegionType(this.regionType),this.searchText,this.statusType,this.source,null,1,9999);
    // this.dataSource = data?.items;
    let data_sheet = [];

    for (let item of data.items) {
      data_sheet.push({
        IP: item?.management_ip,
        Name: item?.name,
        Manufacturer:item?.vendor,
        SerialNumber: item?.serial_number,
        Unit: item?.unit_name_full?.split("\n")[0],
        ParentUnit: item?.unit_name_full?.split("\n")[1],
        Source: item?.source,
        TypeNetwork: this.getTypeNetwork(item?.main_type),
        Region: this.getRegionType(item?.loploi),
        LastActive: formatDate(item?.last_active, "dd-MM-yyyy HH:mm:ss", 'en-US') || '',
        Status: item?.status ? "Đang hoạt động" : "Mất kết nối",
      })
    }
    // Tạo một work sheet từ dữ liệu
    this.excelService.exportExcel(data_sheet, 'Chuyển mạch');
  }
  getTypeNetwork(type: string) {
    return this.convertService.getTypeNetwork(type);
  }
  getRegionType(region: string) {
    return this.convertService.getName(region);
  }
  openInfoDeviceModal(serial_number: any,source:string): void {
    let infoModal = this.modal.open(DetailDeviceModalComponent, {
      modalDialogClass: 'dialogClass',
      size: 'xl',
      centered: true,
    });
    // TODO: Pass data to child
    infoModal.componentInstance.serialNumber = serial_number;
    infoModal.componentInstance.type = 'SWITCH';
    infoModal.componentInstance.source = source;

  }
}
