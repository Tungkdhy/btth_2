import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { CommonModule } from '@angular/common';
import { IDevice } from '../../modules/device/models/device.model';
import { IEndPointDto } from '../../modules/endpoint/models/endpoint.model';
import { ColumnHeadingModel } from '../../core/models/form-utilities.model';
import { fromEvent, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { SearchInfoSec } from '../../core/models/search';
import {
  NgbPagination,
  NgbPaginationEllipsis,
  NgbPaginationNext,
  NgbPaginationPrevious,
} from '@ng-bootstrap/ng-bootstrap';
import { DropdownTreeComponent } from '../dropdown-tree/dropdown-tree.component';
import { FormsModule } from '@angular/forms';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { NeunLoadingComponent } from '../neun-loading/neun-loading.component';

@Component({
  selector: 'app-neun-data-table',
  standalone: true,
  imports: [
    CommonModule,
    NgbPagination,
    DropdownTreeComponent,
    FormsModule,
    DropdownMenuComponent,
    NgbPaginationPrevious,
    NgbPaginationNext,
    NgbPaginationEllipsis,
    NeunLoadingComponent,
  ],
  templateUrl: './neun-data-table.component.html',
  styleUrls: ['./neun-data-table.component.scss'],
})
export class NeunDataTableComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  _devices: IDevice[] | IEndPointDto[] | null;
  get devices(): any[] | null {
    return this._devices;
  }

  @Input() set devices(value: any[] | null) {
    this._devices = value;
  }

  @Input() searchModel: SearchInfoSec;
  @Input() columnHeading: ColumnHeadingModel[];
  @Input() treeData: any;
  @Input() readonly: boolean = false;
  @Input() showExportButton: boolean = false;
  @Input() isLoadingExport: boolean = false;

  @Output() add = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() handleChangePageSize = new EventEmitter();
  @Output() handleChangeSize = new EventEmitter();
  @Output() view = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() selectedRow = new EventEmitter();
  @Output() search = new EventEmitter();
  @Output() export = new EventEmitter();

  @ViewChild('searchButton') searchButton: ElementRef;
  @ViewChild('inputElement') inputElement: ElementRef;
  @ViewChild('advancedButton') advancedButton: ElementRef;

  subscription$: Subscription;

  textSearch: string = '';
  typeDevice: 'COMPUTER' | 'NETWORK DEVICE';
  public listSelect: any = [];

  public isSelectAll: boolean = false;

  public isSearchAdvanced: boolean = false;
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  constructor() {}

  ngOnInit(): void {
    if (this.searchModel)
      this.typeDevice =
        this.searchModel.type?.toUpperCase() === 'CLIENT' ||
        this.searchModel.type?.toUpperCase() === 'SERVER'
          ? 'COMPUTER'
          : 'NETWORK DEVICE';
  }

  ngAfterViewInit() {
    const input$ = fromEvent(this.inputElement.nativeElement, 'keyup').pipe(
      map((event) => ((event as Event).target as HTMLInputElement).value),
    );
    this.subscription$ = input$.subscribe(
      (value: string) => (this.searchModel.text = value),
    );
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  // Handle checkbox
  clickCheckbox(data: any): void {
    if (!this.devices) return;
    data.isSelect = !data.isSelect;
    if (data.isSelect) {
      this.listSelect.push(data);
    } else {
      this.listSelect.filter((element: any) => {
        return element !== data;
      });
    }

    if (this.listSelect.length < this.devices.length) {
      this.isSelectAll = false;
    }
  }

  // Click all checkbox
  clickAll(): void {
    if (!this.devices) return;
    this.isSelectAll = !this.isSelectAll;
    this.devices.forEach((element: any) => {
      if (this.isSelectAll) {
        if (!element.isSelect) {
          element.isSelect = true;
          this.listSelect = this.devices;
        }
      } else {
        if (element.isSelect) {
          element.isSelect = false;
          this.listSelect = [];
        }
      }
    });
  }

  onDelete(data: any) {
    this.delete.emit(data);
  }

  onEdit(data: any) {
    if (!this.readonly) this.edit.emit(data);
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

  changeSize(event: Event): void {
    const size = (event.target as HTMLSelectElement).value;
    this.handleChangeSize.emit(parseInt(size));
  }

  // public showSearchAdvanced(): void {
  //   this.isSearchAdvanced = !this.isSearchAdvanced;
  // }

  onSearch() {
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

  onView(data: any) {
    this.view.emit(data);
  }
}
