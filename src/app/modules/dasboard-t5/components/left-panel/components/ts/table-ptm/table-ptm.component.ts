import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { BadgeComponent } from '../../../../../../../../app/modules/dasboard-t5/components/shared/badge/badge.component';

@Component({
  selector: 'app-table-ptm',
  templateUrl: './table-ptm.component.html',
  styleUrls: ['./table-ptm.component.scss'],
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  encapsulation: ViewEncapsulation.None, // 👈 cho phép nhận class global
})
export class TablePtmComponent {
  @Input() headers: string[] = [];
  @Input() height: string = '370px';
  @Input() fields: string[] = [];
  @Input() data: any[] = [];
  @Input() showExpanded: boolean = false;
  @Input() columnClasses: { [key: string]: string } = {}; // 👈 Thêm input này

  @Output() rowClicked = new EventEmitter<any>();

  expandedRowId: number | null = null;

  onRowClick(row: any) {
    this.expandedRowId = this.expandedRowId === row.stt ? null : row.stt;
    this.rowClicked.emit(row);
  }
}
