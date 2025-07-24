import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgbPagination,
  NgbPaginationModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from 'src/app/modules/dashboard/services/supabase.service';
import { NumberFormatPipe } from '../../../../../../../core/pipes/number-format/number-format.pipe';
import { CONFIG } from 'src/environments/environment';

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
  ],
  templateUrl: './table-detail-1.component.html',
  styleUrls: ['./table-detail-1.component.scss'],
})
export class TableDetail1Component implements OnInit {
  @Input() tableData: any;
  public dataSource: any[] = [];
  page = 1;
  pageSize = 8;
  total = 0;
  fmc_down: 0;

  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    // let response = await fetch(
    //   `${
    //     CONFIG.API.BACKEND.DIEU_HANH_TRUC_URL
    //   }/api/DSTindht?page=${1}&page_size=${5}`,
    // );
    // let data = await response.json();
    // // this.dataSource = data?.nhiemvus;
    // this.dataSource = data?.nhiemvus;
    // this.page = data?.page_index;
    // this.pageSize = data?.page_size;
    // this.total = data?.total_doccument;
    // this.cdr.detectChanges();
  }

  async onPageChange(page = 1) {
    this.page = page;
    // let data = await this.supabase.getDanhSachServerFmc(page, this.pageSize);
    let response = await fetch(
      `${CONFIG.API.BACKEND.DIEU_HANH_TRUC_URL}/api/DSTindht?page=${this.page}&page_size=${this.pageSize}`,
    );

    let data = await response.json();

    this.dataSource = data.nhiemvus;
    this.cdr.detectChanges();
  }
  // async ngOnChanges(changes: SimpleChanges) {
  //   this.dataSource = this.tableData?.nhiemvus;
  //   this.page = this.tableData?.page_index;
  //   this.pageSize = this.tableData?.page_size;
  //   this.total = this.tableData?.total_doccument;
  //   this.cdr.detectChanges();
  // }
  getType(type: string) {
    let key: any = {
      QS: 'Quân sự',
      INT: 'Internet',
      CD: 'Chuyên dùng',
    };
    return key[type] || '';
  }
  getLastActive(time: string) {
    return time?.replace('T', ' ');
  }
}
