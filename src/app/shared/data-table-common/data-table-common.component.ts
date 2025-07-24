import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  NgbPagination,
  NgbPaginationEllipsis,
  NgbPaginationNext,
  NgbPaginationPrevious,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DropdownTreeComponent } from '../dropdown-tree/dropdown-tree.component';
import { SearchInfoSec } from '../../core/models/search';
import { Constant } from '../../core/config/constant';
import { NeunLoadingComponent } from '../neun-loading/neun-loading.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-data-table-common',
  templateUrl: './data-table-common.component.html',
  styles: [],
  imports: [
    NgbPagination,
    NgbPaginationPrevious,
    NgbPaginationNext,
    NgbPaginationEllipsis,
    FormsModule,
    NgForOf,
    NgIf,
    InlineSVGModule,
    DropdownTreeComponent,
    NeunLoadingComponent,
  ],
})
export class DataTableCommonComponent implements OnInit, OnDestroy {
  private _searchModel: SearchInfoSec;
  get searchModel(): SearchInfoSec {
    return this._searchModel;
  }
  @Input() set searchModel(value: SearchInfoSec) {
    this._searchModel = value;
  }

  @Input() disableFunctions: boolean = false;
  @Input() title: string;
  @Input() unitId: string;
  @Input() treeData: any;
  @Input() classTable: string = 'card card-xxl-stretch my-10 mb-xxl-8';
  @Input() readonly: boolean = false;
  @Input() allowInsert: boolean = true;
  @Input() allowSearchAdvanced: boolean = false;
  @Input() allowBlockComputer: boolean = false;
  @Input() allowAllowComputer: boolean = false;
  @Input() showExportButton: boolean = false;
  @Input() isLoadingExport: boolean = false;
  @Input() showCloseButton: boolean = false;
  @Output() add = new EventEmitter();
  // @Output() delete = new EventEmitter();
  @Output() handleChangePageSize = new EventEmitter();
  @Output() handleChangeSize = new EventEmitter();
  // @Output() onViewDetail = new EventEmitter();
  // @Output() edit = new EventEmitter();
  @Output() selectRow = new EventEmitter();
  @Output() search = new EventEmitter();
  @Output() blockComputer = new EventEmitter();
  @Output() allowComputer = new EventEmitter();
  @Output() export = new EventEmitter();

  @ViewChild('advancedButton') advancedButton: ElementRef;

  typeDevice: 'COMPUTER' | 'NETWORK DEVICE';
  sizeList = Constant.PAGING.SIZE_LIST;
  public listSelect: any = [];

  public isSelectAll: boolean = false;

  public isSearchAdvanced: boolean = false;

  searchText: string = '';
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.onSearch();
      });
  }

  ngOnInit(): void {
    if (this.searchModel) {
      this.typeDevice =
        this.searchModel.type?.toUpperCase() === 'CLIENT' ||
        this.searchModel.type?.toUpperCase() === 'SERVER'
          ? 'COMPUTER'
          : 'NETWORK DEVICE';
    }
  }

  onSearchInputChange(event: Event): void {
    this.searchText = (event.target as HTMLInputElement).value;
    this.searchSubject.next(this.searchText);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSelect(event: any) {
    this.selectRow.emit(event.itemData.id);
  }

  onChange(event: any) {
    if (event.value[0] === undefined) {
      this.selectRow.emit('');
    }
  }

  changePageSize(page: number): void {
    this.handleChangePageSize.emit(page);
  }

  changeSize(): void {
    this.handleChangeSize.emit(this.searchModel.size);
  }

  onSearch(): void {
    this.searchModel.text = this.searchText;
    this.search.emit(this.searchModel);
  }

  toggleSearchAdvanced(): void {
    let button = this.advancedButton.nativeElement;
    this.isSearchAdvanced = !this.isSearchAdvanced;
    button.innerText = this.isSearchAdvanced ? 'Ẩn nâng cao' : 'Nâng cao';
  }

  handleSelectUnit(unitId: string) {
    if (unitId) {
      this.searchModel.unitId = unitId;
    } else {
      if (this.treeData)
        this.searchModel.unitId = this.treeData.dataSource[0].id;
    }
  }

  goBack() {}
  close() {
    this.router
      .navigate(['../'], {
        relativeTo: this.route,
        queryParams: { id: this.unitId },
      })
      .then();
  }
}
