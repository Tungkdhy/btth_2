import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FieldsSettingsModel } from '@syncfusion/ej2-angular-navigations';
import {
  TreeGridComponent,
  TreeGridModule,
} from '@syncfusion/ej2-angular-treegrid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Constant } from '../../../core/config/constant';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UnitTreeGridComponent } from '../../../modules/unit/components/unit-tree-grid/unit-tree-grid.component';
import { ColumnFieldsTreeGridSyncfusion } from '../../../core/models/form-utilities.model';
import { ToastrService } from 'ngx-toastr';
import { MoveNodeModel } from '../../../modules/unit/components/unit-tree-grid/models/move-node.model';
import {
  ResponseAPI,
  ResultListNoPaginationModel,
} from '../../../core/models/api-response.model';
import { UnitService } from '../../../modules/unit/services/unit.service';
import { AsyncPipe, NgForOf } from '@angular/common';
import { ConfirmDeleteModalComponent } from '../../../shared/confirm-delete-modal/confirm-delete-modal.component';
import { MainFormUnitComponent } from './main-form-unit/main-form-unit.component';
import {
  ITypeUnit,
  UnitModel,
  UnitRefTree,
} from '../../../modules/unit/models/unit.model';

@Component({
  standalone: true,
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styles: [],
  imports: [UnitTreeGridComponent, AsyncPipe, NgForOf, TreeGridModule],
})
export class UnitComponent implements OnInit {
  @ViewChild('unitTree')
  public unitTree: TreeGridComponent;

  public units$: Observable<UnitRefTree[]>;

  public unitLoading: boolean = false;
  public unitSelected: UnitModel;
  public fields: FieldsSettingsModel;

  public type: ITypeUnit = 'UNIT';
  public discriminator = Constant.UNIT.DISCRIMINATOR_TSLQS;

  parentIdMapping = 'parentId';
  idMapping = 'id';

  settingColumn: ColumnFieldsTreeGridSyncfusion[] = [
    {
      field: 'type',
      headerText: 'Loại',
      width: '30',
    },
    {
      field: 'name',
      headerText: 'Tên đơn vị',
      width: '120',
    },
  ];

  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private modal: NgbModal = inject(NgbModal);
  private toastr: ToastrService = inject(ToastrService);
  private unitService: UnitService = inject(UnitService);

  constructor() {}

  ngOnInit() {
    // this.units$ = this.getUnits(this.type);
    this.units$ = this.getUnitRefTree();
  }

  getUnitRefTree(): Observable<UnitRefTree[]> {
    return this.unitService
      .getTreeAll()
      .pipe(map((response: ResponseAPI<UnitRefTree[]>) => response.data));
  }

  getUnits(type: string): Observable<UnitModel[]> {
    return this.unitService
      .findAllByType(type)
      .pipe(map((response: ResultListNoPaginationModel) => response.data));
  }

  handleAddItem(): void {
    this.modal
      .open(MainFormUnitComponent, {
        size: 'xl',
        centered: true,
      })
      .result.then(
        () => {}, // TODO: post add
        () => {},
      );
  }

  // refreshTreeGrid(milliseconds: number) {
  //   setTimeout(() => {
  //     this.units$ = this.getUnits(this.type);
  //     this.unitTree.refresh;
  //   }, milliseconds);
  // }

  handleEditItem(): void {
    if (!this.unitSelected) {
      this.toastr.error(Constant.MESSAGE.WARNING_UNSELECT_RECORD);
      return;
    }
    this.router
      .navigate([this.unitSelected.id], {
        relativeTo: this.route,
      })
      .then();
  }

  delete(id: string): void {
    this.unitService.removeSubtree(id).subscribe(
      () => {
        // post delete
        // this.units$ = this.getUnits(this.type);

        this.toastr.success('Xóa thành công');
      },
      (error: ResultListNoPaginationModel) => {
        this.toastr.error(error.message, error.resultCode);
      },
    );
  }

  handleDeleteItem(): void {
    if (this.unitSelected) {
      const modalDelete = this.modal.open(ConfirmDeleteModalComponent, {
        size: 'sm',
        centered: true,
      });
      modalDelete.componentInstance.data = this.unitSelected;
      modalDelete.result.then(
        () => this.delete(this.unitSelected.id),
        () => {},
      );
    } else {
      this.toastr.warning('Vui lòng chọn bản ghi');
    }
  }

  handleRowSelected(unit: UnitModel) {
    if (!unit) return;
    this.unitSelected = unit;
  }

  handleRowDeselected() {
    this.unitSelected = <UnitModel>{};
  }

  handleDragAndDrop(moveNode: MoveNodeModel) {
    this.unitService.moveNode(moveNode).subscribe();
  }
}
