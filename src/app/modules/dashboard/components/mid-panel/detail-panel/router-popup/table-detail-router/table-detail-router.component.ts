import {
  ChangeDetectorRef,
  Component,
  Input,
  NgModule,
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
import { ExcelService } from 'src/app/modules/dashboard/services/excel.service';

@Component({
  selector: 'app-table-detail-router',
  standalone: true,
  imports: [
    CommonModule,
    NgbPagination,
    FormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NumberFormatPipe,
  ],
  templateUrl: './table-detail-router.component.html',
  styleUrls: ['./table-detail-router.component.scss'],
})
export class TableDetailRouterComponent implements OnInit {
  @Input() tableData: any;
  @Input() mainType: string = '';
  @Input() subType: string = "728";
  @Input() regionType: string = 'all';

  public dataSource: any[] = [];

  page = 1;
  pageSize = 8;
  total = 0;
  searchText: string = '';
  statusType: string = '';
  categoryType: string = '';
  source: string = "HSM";

  constructor(
    private supabase: SupabaseService,
    private convertService: ConvertServiceComponent,
    private modal: NgbModal,
    private excelService: ExcelService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() { }

  async onPageChange(page: number) {
    this.page = page;
    let data = await this.supabase.getDanhSachThietBiPopupMidPanel(
      this.mainType,
      this.subType,
      'ROUTER',
      this.convertService.getRegionType(this.regionType),
      this.searchText,
      this.statusType,
      this.source,
      this.categoryType,
      page,
      this.pageSize,
    );

    this.dataSource = data.items;
    this.cdr.detectChanges();
  }
  async ngOnChanges(changes: SimpleChanges) {
    let data = await this.supabase.getDanhSachThietBiPopupMidPanel(this.mainType, this.subType, 'ROUTER', this.convertService.getRegionType(this.regionType), this.searchText, this.statusType, this.source, this.categoryType, 1, this.pageSize);

    this.dataSource = data?.items;
    this.page = data?.page_index;
    this.pageSize =data?.page_size;
    this.total = data?.total;
    this.cdr.detectChanges();
  }
  async search() {

    let data = await this.supabase.getDanhSachThietBiPopupMidPanel(this.mainType, this.subType, 'ROUTER', this.convertService.getRegionType(this.regionType), this.searchText, this.statusType, this.source, this.categoryType, 1, this.pageSize);
    this.dataSource = data?.items;
    this.page = data?.page_index;
    this.pageSize = data?.page_size;
    this.total = data?.total;
    this.cdr.detectChanges();
  }

  async exportExcel() {
    let data = await this.supabase.getDanhSachThietBiPopupMidPanel(this.mainType, this.subType, 'ROUTER', this.convertService.getRegionType(this.regionType), this.searchText, this.statusType, this.source, this.categoryType, 1, 99999);
    // this.dataSource = data?.items;
    let data_sheet = [];

    for (let item of data.items) {
      data_sheet.push({
        IP: item?.management_ip,
        Type: this.getNameRouter(item?.category),
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
    this.excelService.exportExcel(data_sheet, 'Định tuyến, cơ yếu');
  }

  getTypeNetwork(type: string) {
    return this.convertService.getTypeNetwork(type);
  }
  getRegionType(region: string) {
    return this.convertService.getName(region);
  }
  getNameRouter(category: string) {

    if (category === 'ROUTER_CY') {
      return 'Cơ yếu';
    }
    return "Định tuyến";
  }
}
