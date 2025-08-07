import { CommonModule } from '@angular/common';
import { Component, Input,Output, EventEmitter } from '@angular/core';
import { BadgeComponent } from '../badge/badge.component';
// improt BadgeComponent
// import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-kgm',
  templateUrl: './table-kgm.component.html',
  styleUrls: ['./table-kgm.component.scss'],
  standalone: true,
  imports: [CommonModule,BadgeComponent],
})
export class TableKGMComponent {
  @Input() headers?: string[] = ['Cột 1', 'Cột 2'];
  @Input() height: string = '380px';
  @Input() columns: { label: string; field: string }[] = [];
  @Input() fields?: string[] = ['field1', 'field2']; // field key trong object data
  @Input() data:any;
  @Input() detail: string = '';
  @Output() rowClicked = new EventEmitter<any>();
  // @Output() \ = new EventEmitter<any>();
  expandedRowId: number | null = null;
  onRowClick(row: any) {
    this.expandedRowId = this.expandedRowId === row.stt ? null : row.stt;
    console.log(row);
    this.detail = row.noi_dung_day_du
    this.rowClicked.emit(row);
  }
}
