import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NumberFormatPipe } from '../../../../../core/pipes/number-format/number-format.pipe';

interface TableColumn {
  key: string; // Property name in the data object
  label: string; // Display name
  isSortable?: boolean; // Optional: Enable sorting
  isVisible?: boolean; // Optional: Column visibility
  cellRenderer?: (data: any) => string; // Optional: Custom cell renderer
}

interface TableConfig {
  columns: TableColumn[];
  pageSize: number;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NumberFormatPipe],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() config: TableConfig = { columns: [], pageSize: 10 };
  @Input() allowSearch: boolean = false;
  @Input() totalItems: number | null = null;
  @Output() pageChange = new EventEmitter<number>();
  @Output() searchQuery = new EventEmitter<string>();

  @Input() isRowClick: boolean = false;
  @Output() rowClick = new EventEmitter<any>();

  currentPage = 1;
  searchControl = new FormControl();

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) => {
        this.searchQuery.emit(value);
        this.currentPage = 1; // Reset to the first page on search
      });
  }

  changePage(newPage: number): void {
    this.currentPage = newPage;
    this.pageChange.emit(this.currentPage);
  }

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.config.pageSize;
    const end = start + this.config.pageSize;
    return this.data.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.data.length / this.config.pageSize);
  }

  safeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getPointer() {
    return {
      cursor: this.isRowClick ? 'pointer' : 'none',
    };
  }
}
