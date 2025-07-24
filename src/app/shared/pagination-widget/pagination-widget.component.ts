import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SearchModel} from "../../core/models/search-common.model";
import {NgIf} from "@angular/common";
import {
  NgbPagination,
  NgbPaginationEllipsis,
  NgbPaginationNext,
  NgbPaginationPrevious
} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-pagination-widget',
  standalone: true,
  imports: [
    NgIf,
    NgbPagination,
    NgbPaginationPrevious,
    NgbPaginationNext,
    NgbPaginationEllipsis
  ],
  templateUrl: './pagination-widget.component.html',
  styleUrls: ['./pagination-widget.component.scss']
})
export class PaginationWidgetComponent implements OnInit {
  _length: number;
  get length(): number {
    return this._length;
  }
  @Input() set length(value: number) {
    this._length = value;
    this.searchModel.length = value;
  }

  @Output() handleChangeSize: EventEmitter<number> = new EventEmitter<number>();
  @Output() handleChangePage: EventEmitter<number> = new EventEmitter<number>();

  searchModel: SearchModel = new SearchModel();

  constructor() {
  }

  ngOnInit(): void {
  }

  changeSize(size: string): void {
    this.searchModel.size = parseInt(size);
    this.handleChangeSize.emit(parseInt(size))
  }

  changePage(page: number) {
    this.handleChangePage.emit(page)
  }

}
