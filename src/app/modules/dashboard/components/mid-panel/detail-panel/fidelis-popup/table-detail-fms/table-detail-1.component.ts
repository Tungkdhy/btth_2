import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import {
  NgbPagination,
  NgbPaginationModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { NumberFormatPipe } from '../../../../../../../core/pipes/number-format/number-format.pipe';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
import * as XLSX from 'xlsx'; // Thư viện để tạo file Excel
import { saveAs } from 'file-saver'; // Thư viện để lưu file
const data: any[] = [];

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
    DropDownListModule,
  ],
  templateUrl: './table-detail-1.component.html',
  styleUrls: ['./table-detail-1.component.scss'],
})
export class TableDetail1Component implements OnInit {
  @Input() tableData: any;
  @Input() status: string;
  @Input() mainType: string;
  public dataSource: any[] = [];
  page = 1;
  pageSize = 5;
  total = 0;
  fmc_down: 0;
  searchText: string = '';
  xuLyType: string = '';
  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {}

  async onPageChange(page: number) {
    this.page = page;
    let data: any;
    if (this.status) {
      data = await this.supabase.getDanhSachServerFidelis(
        page,
        this.pageSize,
        this.status,
        'QS',
        this.searchText,
        this.xuLyType,
      );
    } else {
      data = await this.supabase.getDanhSachServerFidelis(
        page,
        this.pageSize,
        undefined,
        'QS',
        this.searchText,
        this.xuLyType,
      );
    }

    this.dataSource = data.items;
    this.cdr.detectChanges();
  }
  async ngOnChanges(changes: SimpleChanges) {
    this.dataSource = this.tableData?.items;
    this.page = this.tableData?.page_index;
    // this.pageSize = this.tableData?.page_size;
    this.total = this.tableData?.total;
    // this.fmc_down = this.tableData?.fmc_down;
    this.cdr.detectChanges();
  }
  getType(type: string) {
    let key: any = {
      B: 'Miền Bắc',
      T: 'Miền Trung',
      N: 'Miền Nam',
    };
    return key[type] || 'Miền Bắc';
  }
  // getType(type: string) {
  //   let key: any = {
  //     QS: 'Quân sự',
  //     INT: 'Internet',
  //     CD: 'Chuyên dùng',
  //   };
  //   return key[type] || '';
  // }
  async search() {
    this.page = 1;
    let data = await this.supabase.getDanhSachServerFidelis(
      this.page,
      this.pageSize,
      undefined,
      'QS',
      this.searchText,
      this.xuLyType,
    );
    // console.log('datass', data);
    this.total = data?.total;
    this.dataSource = data?.items;
    this.cdr.detectChanges();
  }
  async exportExcel() {
    try {
      // Fetch data from Supabase
      let data = await this.supabase.getDanhSachServerFidelis(
        this.page,
        this.pageSize,
        undefined,
        'QS',
        this.searchText,
        this.xuLyType,
      );

      if (!data || !data.items || data.items.length === 0) {
        console.warn('No data available to export.');
        return;
      }

      // Transform data into an array for the sheet
      const data_sheet = data.items.map((item: any) => ({
        'Tên đơn vị': item.unit.name || '',
        'Thời gian kết nối': this.getLastActive(item?.last_up),
        Vùng: this.getType(item?.region),
        'Trạng thái': item?.status === 'up' ? 'Hoạt động' : 'Mất kết nối',
      }));

      // Create worksheet from data
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data_sheet);

      // Create workbook containing the worksheet
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Danh sách thống kê': worksheet },
        SheetNames: ['Danh sách thống kê'],
      };

      // Create Excel file as a buffer
      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });

      // Save the Excel file
      this.saveAsExcelFile(excelBuffer, 'Danh sách thống kê');
    } catch (error) {
      console.error('Error exporting Excel:', error);
    }
  }

  // Function to save the Excel file
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(
      data,
      `${fileName}_${formatDate(
        new Date(),
        'dd-MM-yyyy_HH:mm:ss',
        'en-US',
      )}.xlsx`,
    );
  }
  getLastActive(time: string) {
    if (!time) {
      return '';
    }
    const date = new Date(time);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}-${month}-${year} split ${hours}:${minutes}:${seconds}`;
  }
}
