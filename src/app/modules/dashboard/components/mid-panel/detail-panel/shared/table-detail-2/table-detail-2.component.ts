import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgbPagination,
  NgbPaginationModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

const data: any[] = [];

@Component({
  selector: 'app-table-detail-2',
  standalone: true,
  imports: [
    CommonModule,
    NgbPagination,
    FormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
  ],
  templateUrl: './table-detail-2.component.html',
  styleUrls: ['./table-detail-2.component.scss'],
})
export class TableDetail2Component {
  page = 1;
  pageSize = 4;
  collectionSize = data.length;
  data: any[];

  constructor() {
    this.refreshData();
  }

  refreshData() {
    this.data = data
      .map((item, i) => ({ id: i + 1, ...item }))
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize,
      );
  }
}
