import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgbPagination,
  NgbPaginationModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NumberFormatPipe } from '../../../../../../../core/pipes/number-format/number-format.pipe';

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
export class TableDetail1Component {
  page = 1;
  pageSize = 4;
  collectionSize = data.length;
  @Input() tableData: any[];
  constructor() {
    this.refreshData();
  }

  refreshData() {
    this.tableData = this.tableData
      ?.map((item, i) => ({ id: i + 1, ...item }))
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize,
      );
  }
  async ngOnChanges(changes: SimpleChanges) {
    if (this.tableData) {
      this.tableData = this.tableData;
    }
  }
}
