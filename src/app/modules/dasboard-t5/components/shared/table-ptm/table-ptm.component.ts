import { CommonModule } from '@angular/common';
import { Component, Input,Output, EventEmitter } from '@angular/core';
import { BadgeComponent } from '../badge/badge.component';
// improt BadgeComponent
// import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-ptm',
  templateUrl: './table-ptm.component.html',
  styleUrls: ['./table-ptm.component.scss'],
  standalone: true,
  imports: [CommonModule,BadgeComponent],
})
export class TablePtmComponent {
  @Input() headers: string[] = ['Cột 1', 'Cột 2'];
  @Input() height: string = '380px';
  @Input() fields: string[] = ['field1', 'field2']; // field key trong object data
  @Input() data: any[] = [];
  @Input() showExpanded: boolean = false;
  @Output() rowClicked = new EventEmitter<any>();
  // @Output() \ = new EventEmitter<any>();
  expandedRowId: number | null = null;
  onRowClick(row: any) {
    this.expandedRowId = this.expandedRowId === row.stt ? null : row.stt;
    this.rowClicked.emit(row);
  }
}
