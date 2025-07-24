import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import {
  NgbPagination,
  NgbPaginationModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { ConvertServiceComponent } from 'src/app/modules/dashboard/services/convert-service.component';
import { NumberFormatPipe } from "../../../../../../../core/pipes/number-format/number-format.pipe";
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

  @Input() mainType: string = "";
  @Input() subType: string = "728";
  @Input() tableData: any;
  @Input() regionType: string = "all";
  @Input() startDate: string = "";
  @Input() endDate:string = "";
  public dataSource: any[]=[];

  searchText: string = '';
  capdoType: string = '';
  pheDuyetType: string = '';

  page = 1;
  pageSize = 4;
  total =0;

  constructor(
    private supabase: SupabaseService,
    private convertService:ConvertServiceComponent,
    private cdr: ChangeDetectorRef,
    private excelService: ExcelService,
  ) {}

  ngOnInit() {
  }

  async onPageChange(page: number) {
    this.page = page;

    let data:any  = await this.supabase.fetchHtttList(this.mainType,this.subType,this.convertService.getRegionType(this.regionType),'',this.capdoType,false,this.searchText,this.pheDuyetType,this.startDate,this.endDate,page,this.pageSize);

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

    let data:any  = await this.supabase.fetchHtttList(this.mainType,this.subType,this.convertService.getRegionType(this.regionType),'',this.capdoType,false,this.searchText,this.pheDuyetType,this.startDate,this.endDate,1,this.pageSize);
    this.dataSource = data?.items;
    this.page =  data?.page_index;
    this.pageSize = data?.page_size;
    this.total =  data?.total;
    this.cdr.detectChanges();
  }
  async exportExcel() {
    let data:any  = await this.supabase.fetchHtttList(this.mainType,this.subType,this.convertService.getRegionType(this.regionType),'',this.capdoType,false,this.searchText,this.pheDuyetType,this.startDate,this.endDate,1,9999);
    // this.dataSource = data?.items;
    let data_sheet = [];

    for (let item of data.items) {
      data_sheet.push({
        Name:item?.data?.ten,
        Unit:item?.data?.uname?.split("\n")[0],
        UnitParent: item?.data?.uname?.split("\n")[1],
        Level: `Cấp độ ${ item?.data?.capdo }`,
        Time: formatDate(item?.data?.created_at, "dd-MM-yyyy HH:mm:ss", 'en-US') || '',
        Approved:item?.data?.fe_duyet,
        TypeNetwork: this.getTypeNetwork(item?.data?.main_type),
        Region: this.getNameRegion(item?.data?.loi),
      })
    }
    // Tạo một work sheet từ dữ liệu
    this.excelService.exportExcel(data_sheet, 'Phê duyệt hồ sơ');
  }
  getTypeNetwork(type:string){
    return this.convertService.getTypeNetwork(type);
  }
  getNameRegion(type:string){
    return this.convertService.getName(type);
  }
}
