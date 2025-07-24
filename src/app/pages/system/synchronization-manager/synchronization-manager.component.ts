import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  CODES,
  STATUSES,
  SynchronizationResult,
  SYSTEM_TABLES,
} from '../../../modules/synchronization-manager/models/synchronization.model';
import { SearchModel } from '../../../core/models/search-common.model';
import { SynchronizationService } from '../../../modules/synchronization-manager/services/synchronization.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnitService } from '../../../modules/unit/services/unit.service';
import {
  ResultListNoPaginationModel,
  ResultListPaginationModel,
} from '../../../core/models/api-response.model';
import { Constant } from '../../../core/config/constant';
import { ConfirmDeleteModalComponent } from '../../../shared/confirm-delete-modal/confirm-delete-modal.component';
import { deepCopyUseJSON } from '../../../_metronic/layout/core/common/common-utils';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs';
import { AcceptSynchronizationModalComponent } from '../../../modules/synchronization-manager/components/accept-synchronization-modal/accept-synchronization-modal.component';
import { NeunSearchWidgetComponent } from '../../../shared/neun-search-widget/neun-search-widget.component';
import { ButtonWidgetAddComponent } from '../../../shared/button-widget-add/button-widget-add.component';
import { NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { DropdownTreeComponent } from '../../../shared/dropdown-tree/dropdown-tree.component';
import { DateRangePickerComponent } from '../../../shared/date-range-picker/date-range-picker.component';
import { DropdownMenuComponent } from '../../../shared/dropdown-menu/dropdown-menu.component';
import { PaginationWidgetComponent } from '../../../shared/pagination-widget/pagination-widget.component';
import { UnitModel } from '../../../modules/unit/models/unit.model';

@Component({
  selector: 'app-synchronization-manager',
  standalone: true,
  imports: [
    NeunSearchWidgetComponent,
    ButtonWidgetAddComponent,
    NgIf,
    DropdownTreeComponent,
    DateRangePickerComponent,
    NgForOf,
    NgSwitch,
    NgSwitchCase,
    DropdownMenuComponent,
    PaginationWidgetComponent,
  ],
  templateUrl: './synchronization-manager.component.html',
  styleUrls: ['./synchronization-manager.component.scss'],
})
export class SynchronizationManagerComponent implements OnInit, OnDestroy {
  @ViewChild('advancedButton') advancedButton: ElementRef;
  @ViewChild('clickAllButton') clickAllButton: ElementRef;
  results: SynchronizationResult[];

  searchModel: SearchModel = new SearchModel();
  loading: boolean = false;
  isAcceptAllLoading: boolean = false;
  isSearchAdvanced: boolean = false;
  hasAcceptAll: boolean = false;

  codeList = CODES;
  systemTableList = SYSTEM_TABLES;
  statusList = STATUSES;

  unitList: UnitModel[];
  public fieldUnitList: any;
  public unitLoading: boolean = false;

  public selectList: SynchronizationResult[] = [];
  public isSelectAll: boolean = false;
  public isAccept: boolean = true;

  private synchronization: SynchronizationService = inject(
    SynchronizationService,
  );
  private toast: ToastrService = inject(ToastrService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private modal: NgbModal = inject(NgbModal);
  private unitService: UnitService = inject(UnitService);

  constructor() {}

  ngOnInit(): void {
    this.search();
    this.getUnitRootTree();
    this.hasInitialRecord();
  }

  ngOnDestroy() {}

  submit(query: string): void {
    this.searchModel.query = query;
    this.searchModel.page = 1;
    this.searchModel.size = 10;
    this.search();
  }

  search(): void {
    this.loading = true;
    this.synchronization.search(this.searchModel).subscribe(
      (results: ResultListPaginationModel<any>) => {
        this.results = results.data.content;
        this.searchModel.length = results.data.totalElements;
        this.loading = false;
      },
      (error: ResultListNoPaginationModel) => {
        this.toast.error(error.message);
        this.loading = false;
      },
      () => {
        this.loading = false;
      },
    );
  }

  private getUnitRootTree(): void {
    this.unitLoading = true;
    this.unitService.getRootTree(Constant.UNIT.TYPE_UNIT).subscribe(
      (res: ResultListNoPaginationModel) => {
        this.unitList = res.data;
        this.fieldUnitList = {
          dataSource: this.unitList,
          value: 'id',
          text: 'name',
          parentValue: 'parentId',
          hasChildren: 'hasChildren',
        };
        this.unitLoading = false;
      },
      () => {
        this.unitLoading = false;
      },
    );
  }

  toggleSearchAdvanced(): void {
    let button = this.advancedButton.nativeElement;
    this.isSearchAdvanced = !this.isSearchAdvanced;
    button.innerText = this.isSearchAdvanced ? 'Ẩn nâng cao' : 'Nâng cao';
  }

  selectDate(event: any): void {
    if (!event) {
      this.searchModel.orderDateStart = undefined;
      this.searchModel.orderDateEnd = undefined;
      return;
    }
    this.searchModel.orderDateStart = event[0].toISOString().slice(0, 10);
    this.searchModel.orderDateEnd = event[1].toISOString().slice(0, 10);
  }

  handleAdd(): void {
    this.router.navigate(['them-moi'], { relativeTo: this.route }).then();
  }

  handleEdit(dataSelected: SynchronizationResult): void {
    this.router
      .navigate(['chinh-sua'], { relativeTo: this.route, state: dataSelected })
      .then();
  }

  handleDelete(data: SynchronizationResult): void {
    const modalDelete = this.modal.open(ConfirmDeleteModalComponent, {
      size: 'sm',
      centered: true,
    });
    modalDelete.componentInstance.data = data;
    modalDelete.result.then(
      () => this.deleteRecord(data.id),
      () => {},
    );
  }

  deleteRecord(id: string): void {
    this.synchronization.delete(id).subscribe(() => {
      this.toast.success('Xóa thành công');
    });
  }

  handleSelectUnit(unitId: string): void {
    this.searchModel.unitId = unitId;
  }

  // Handle checkbox
  clickCheckbox(data: SynchronizationResult): void {
    data.isSelect = !data.isSelect;

    if (data.isSelect) {
      this.selectList.push(data);
    } else {
      const index = this.selectList.indexOf(data);
      if (index > -1) {
        // only splice array when item is found
        this.selectList.splice(index, 1); // 2nd parameter means remove one item only
      }
    }

    this.isAccept = this.selectList.length <= 0;

    if (this.selectList.length < this.results.length) {
      this.isSelectAll = false;
    }
  }

  // Click all checkbox
  clickAll(): void {
    this.isSelectAll = !this.isSelectAll;
    this.results.forEach((element: SynchronizationResult) => {
      if (this.isSelectAll) {
        if (!element.isSelect) {
          element.isSelect = true;
        }
      } else {
        if (element.isSelect) {
          element.isSelect = false;
        }
      }
    });
    this.selectList = this.isSelectAll ? this.results : [];
    this.isAccept = this.selectList.length <= 0;
  }

  handleChangeSize(size: number) {
    this.searchModel.size = size;
    this.clickAllButton.nativeElement.checked = false;
    this.search();
  }

  handleChangePage(page: number) {
    this.searchModel.page = page;
    this.clickAllButton.nativeElement.checked = false;
    this.search();
  }

  acceptRecord(): void {
    if (this.selectList.length === 1) {
      this.synchronization.acceptRecord(this.selectList[0]).subscribe(
        () => {
          this.toast.success('Duyệt thành công');
        },
        () => {
          this.selectList = [];
          this.search();
        },
        () => {
          this.selectList = [];
          this.search();
        },
      );
    } else if (this.selectList.length > 1) {
      this.synchronization.acceptRecordList(this.selectList).subscribe(
        () => {
          this.toast.success('Duyệt thành công');
        },
        () => {
          this.selectList = [];
          this.search();
        },
        () => {
          this.selectList = [];
          this.search();
        },
      );
    }
    this.isSelectAll = false;
  }

  hasInitialRecord(): void {
    this.synchronization
      .hasInitialRecord()
      .pipe(
        map((response: any) => response.data),
        tap((data: any) => (this.hasAcceptAll = data)),
      )
      .subscribe();
  }

  acceptAllRecord(): void {
    const acceptModal = this.modal.open(AcceptSynchronizationModalComponent, {
      centered: true,
      size: 'xl',
    });

    acceptModal.componentInstance.unitList = deepCopyUseJSON(this.unitList);
  }
}
