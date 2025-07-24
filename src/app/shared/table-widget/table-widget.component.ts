import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DropdownMenuComponent} from "../dropdown-menu/dropdown-menu.component";
import {DropDownTreeModule} from "@syncfusion/ej2-angular-dropdowns";
import {SearchCommonModel} from "../../core/models/search-common.model";
import {ColumnHeadingModel} from "../../core/models/form-utilities.model";
import {FormsModule} from "@angular/forms";
import {
  NgbPagination,
  NgbPaginationEllipsis,
  NgbPaginationNext,
  NgbPaginationPrevious
} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-table-widget',
  standalone: true,
  imports: [CommonModule, DropdownMenuComponent, DropDownTreeModule, FormsModule, NgbPagination, NgbPaginationPrevious, NgbPaginationNext, NgbPaginationEllipsis],
  templateUrl: './table-widget.component.html',
  styleUrls: ['./table-widget.component.scss']
})
export class TableWidgetComponent implements OnInit {
  @Input() dataList: any[] | null;
  @Input() searchModel: SearchCommonModel;
  @Input() columnHeading: ColumnHeadingModel[];
  @Input() treeData: any;

  @Output() add = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() handleChangePageSize = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() selectedRow = new EventEmitter();
  @Output() search = new EventEmitter();

  public isSearchAdvanced: boolean = false;
  public textSearch: string = '';

  constructor() {
  }

  ngOnInit(): void {
  }


  onDelete(id: string) {
    this.delete.emit(id);
  }

  onEdit(id: string) {
    this.edit.emit(id);
  }

  onSelect(event: any) {
    this.selectedRow.emit(event.itemData.id);
  }

  onChange(event: any) {
    if (event.value[0] === undefined) {
      this.selectedRow.emit('');
    }
  }

  changePageSize(page: number): void {
    this.handleChangePageSize.emit(page);
  }

  public showSearchAdvanced(): void {
    this.isSearchAdvanced = !this.isSearchAdvanced;
  }

  onSearch() {
    this.search.emit(this.textSearch);
  }
}
