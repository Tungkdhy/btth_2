import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  header: string;
  format?: (value: any) => string;
}

@Component({
  selector: 'app-data-table-expand',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table-expand.component.html',
  styleUrls: ['./data-table-expand.component.scss'],
})
export class DataTableExpandComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() detailTemplate!: TemplateRef<any>;
  @Input() pageSize: number = 10; // Default page size
  @Input() total: number = 0; // Total number of records
  @Output() pageChanged = new EventEmitter<number>(); // EventEmitter for page change

  expandedRows: boolean[] = [];
  currentPage: number = 1;

  ngOnInit(): void {
    this.expandedRows = this.data.map(() => false);
  }

  // Paginate the data
  get paginatedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.data.slice(startIndex, endIndex);
  }

  toggleExpand(rowIndex: number): void {
    this.expandedRows[rowIndex] = !this.expandedRows[rowIndex];
  }

  // Format cell values based on the column's format function
  formatCell(
    column: { key: string; format?: (value: any) => string },
    rowData: any,
  ): string {
    const cellValue = rowData[column.key];
    return column.format ? column.format(cellValue) : cellValue;
  }

  // Change the current page and emit an event
  changePage(page: number): void {
    this.currentPage = page;
    this.expandedRows = this.paginatedData.map(() => false); // Reset expanded rows
    this.pageChanged.emit(this.currentPage); // Emit the event to the parent component
  }

  // Check if pagination is needed based on total records and page size
  isPaginationNeeded(): boolean {
    return this.total > this.pageSize;
  }

  // Get total number of pages
  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }

  // Get an array of page numbers with a maximum of 3 visible pages
  get paginationPages(): number[] {
    let pages: number[] = [];

    // Determine the range of pages to show, ensuring we always display 3 pages or fewer
    if (this.totalPages <= 3) {
      // If total pages are 3 or less, show all
      pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    } else if (this.currentPage === 1) {
      // If we're on the first page, show pages 1, 2, 3
      pages = [1, 2, 3];
    } else if (this.currentPage === this.totalPages) {
      // If we're on the last page, show the last 3 pages
      pages = [this.totalPages - 2, this.totalPages - 1, this.totalPages];
    } else {
      // If we're in the middle, show the current page and the previous and next page
      pages = [this.currentPage - 1, this.currentPage, this.currentPage + 1];
    }

    return pages;
  }

  // Handle 'Previous' button click
  prevPage(): void {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }

  // Handle 'Next' button click
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }
}
