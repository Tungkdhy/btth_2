import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UnitDetailIntegrationModel } from '../../../../../modules/unit/models/unit-detail-integration.model';
import { UnitService } from '../../../../../modules/unit/services/unit.service';
import { distinctUntilChanged, Observable, Subscription, tap } from 'rxjs';
import {
  setCurrentUnitId,
  setUnitTreeView,
} from '../../../../../store/unit-tree-view/unit-tree-view.actions';
import { filter, first, map } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';
import { UtilsService } from '../../../../../core/services/utils.service';
import { selectUnitTreeView } from '../../../../../store/unit-tree-view/unit-tree-view.selectors';
import {
  ChangeEventArgs,
  FieldSettingsModel,
} from '@syncfusion/ej2-angular-dropdowns';
import { Predicate, Query } from '@syncfusion/ej2-data';
import { deepCopyUseJSON } from '../../../core/common/common-utils';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent implements OnInit, OnDestroy {
  unitList: UnitDetailIntegrationModel[] = [];
  currentUnit!: UnitDetailIntegrationModel;
  rootUnit: UnitDetailIntegrationModel;
  unitTreeNoRoot: UnitDetailIntegrationModel[];
  autocompleteFields: FieldSettingsModel;
  atcValue: string;

  unitDataSource$: Observable<any>;
  unitDataSource: { [key: string]: Object }[];

  private unitService: UnitService = inject(UnitService);
  private utils: UtilsService = inject(UtilsService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  constructor(private store: Store) {}

  private _subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.store
      .select(selectUnitTreeView)
      .pipe(
        filter((units) => units.length > 0),
        first(),
        tap((units) => {
          this.unitList = deepCopyUseJSON(units);
          this.unitDataSource = deepCopyUseJSON(units) as {
            [key: string]: Object;
          }[];
          this.initialUnitTreeView(this.unitList);
        }),
      )
      .subscribe(() => this.handleChangeUnitIdOnQueryParam());

    this.unitDataSource$ = this.store.select(selectUnitTreeView);

    this.autocompleteFields = {
      value: 'name',
    };
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  initialUnitTreeView(units: UnitDetailIntegrationModel[]): void {
    this.rootUnit = units[0];
    this.unitTreeNoRoot = units.slice(1);
    this.handleSelectUnit(this.rootUnit);
  }

  storeUnitTreeView(units: UnitDetailIntegrationModel[]): void {
    this.store.dispatch(setUnitTreeView({ units }));
  }

  handleChangeUnitIdOnQueryParam(): void {
    this._subscription = this.route.queryParams
      .pipe(
        map((params: Params) => params.id),
        filter((id: string) => !!id),
        distinctUntilChanged(),
        tap((id) => {
          const selectedUnited = this.unitList.find((unit) => unit.id === id);
          if (!selectedUnited) return;
          this.store.dispatch(
            setCurrentUnitId({ currentUnitId: selectedUnited.id! }),
          );
          this.atcValue = selectedUnited.name;
        }),
      )
      .subscribe();
  }

  isSelectedUnitId(unitId: string | null): boolean {
    return this.unitService.isSelectedUnitId(unitId);
  }

  handleSelectUnit(unit: UnitDetailIntegrationModel): void {
    if (!unit || !unit.id) return;
    this.utils.updateQueryParams(unit.id).then();
  }

  getChildrenFromUnitsById(
    unitTree: UnitDetailIntegrationModel[],
    unitId: string | null,
  ): UnitDetailIntegrationModel[] {
    if (!unitId) return [];
    return this.unitService.getChildrenFromUnitsById(unitTree, unitId);
  }

  handleSelectAutocomplete(event: ChangeEventArgs) {
    if (!event.itemData) return;
    const unit = deepCopyUseJSON(event.itemData) as UnitDetailIntegrationModel;
    this.handleSelectUnit(unit);
  }

  public onFiltering(e: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate('name', 'contains', e.text);
    let query = new Query();
    query = e.text != '' ? query.where(predicate) : query;
    e.updateData(this.unitList, query);
  }
}
