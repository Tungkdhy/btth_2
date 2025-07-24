import { UnitTreeViewState } from './unit-tree-view.reducer';
import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';
import { UnitDetailIntegrationModel } from '../../modules/unit/models/unit-detail-integration.model';
import { deepCopyUseJSON } from '../../_metronic/layout/core/common/common-utils';
import { FieldsModel } from '@syncfusion/ej2-angular-dropdowns';

export const selectUnitState =
  createFeatureSelector<UnitTreeViewState>('unitTreeView');

export const selectUnitTreeView: MemoizedSelector<
  Object,
  UnitDetailIntegrationModel[]
> = createSelector(selectUnitState, (state: UnitTreeViewState) => state.units);

export const selectSubTreeByUnitId = (
  unitId: string,
): MemoizedSelector<Object, UnitDetailIntegrationModel[]> =>
  createSelector(selectUnitTreeView, (units: UnitDetailIntegrationModel[]) => {
    const unit = units.find((unit) => unit.id === unitId);
    if (!unit) return [];
    return units
      .filter(
        (item) =>
          unit.treeLeft <= item.treeLeft && unit.treeRight >= item.treeRight,
      )
      .sort(
        (
          firstElm: UnitDetailIntegrationModel,
          secondElm: UnitDetailIntegrationModel,
        ) => firstElm.treeLeft - secondElm.treeLeft,
      );
  });

export const selectUnitTreeFieldsForDropDown = (
  unitId: string,
): MemoizedSelector<Object, FieldsModel> =>
  createSelector(
    selectSubTreeByUnitId(unitId),
    (units: UnitDetailIntegrationModel[]) => {
      const modifiedUnits = deepCopyUseJSON(units);
      if (modifiedUnits.length > 0) {
        modifiedUnits[0].parentId = null;
        modifiedUnits[0].selected = true;
      }
      const fields: FieldsModel = {
        dataSource: modifiedUnits as unknown as { [p: string]: Object }[],
        value: 'id',
        text: 'name',
        parentValue: 'parentId',
        hasChildren: 'hasChildren',
      };
      return fields;
    },
  );

export const selectUnitById = (
  unitId: string,
): MemoizedSelector<Object, UnitDetailIntegrationModel | undefined> => {
  return createSelector(
    selectUnitTreeView,
    (units: UnitDetailIntegrationModel[]) =>
      units.find((unit) => unit.id === unitId),
  );
};
export const selectUnitNamePathById = (
  unitId: string,
): MemoizedSelector<Object, string> => {
  return createSelector(
    selectUnitTreeView,
    (units: UnitDetailIntegrationModel[]) => {
      const unit = units.find((unit) => unit.id === unitId);
      if (!unit) return '';
      return unit.namePath;
    },
  );
};

export const selectCurrentUnit: MemoizedSelector<
  Object,
  UnitDetailIntegrationModel | undefined
> = createSelector(selectUnitState, (state: UnitTreeViewState) => {
  const currentUnitId = state.currentUnitId;
  if (currentUnitId) {
    return state.units.find((u) => u.id === currentUnitId);
  }
  return undefined;
});

export const selectCurrentUnitId: MemoizedSelector<Object, string | null> =
  createSelector(selectUnitState, (state: UnitTreeViewState) => {
    return state.currentUnitId;
  });

export const selectRootUnit: MemoizedSelector<
  Object,
  UnitDetailIntegrationModel | undefined
> = createSelector(selectUnitState, (state: UnitTreeViewState) => {
  const rootUnitId = state.rootUnitId;
  if (rootUnitId) {
    return state.units.find((u) => u.id === rootUnitId);
  }
  return undefined;
});

export const selectRootUnitId: MemoizedSelector<Object, string | null> =
  createSelector(selectUnitState, (state: UnitTreeViewState) => {
    return state.rootUnitId;
  });

export const selectPreviousUnit = createSelector(
  selectUnitState,
  (state: UnitTreeViewState) => {
    const previousUnitId = state.previousUnitId;
    if (previousUnitId) {
      return state.units.find((u) => u.id === previousUnitId);
    }
    return undefined;
  },
);

export const selectPreviousUnitId: MemoizedSelector<Object, string | null> =
  createSelector(selectUnitState, (state: UnitTreeViewState) => {
    return state.currentUnitId;
  });

export const selectUnitNamePath = createSelector(
  selectCurrentUnit,
  (state) => state?.namePath,
);

export const selectUnitNamePathForTable = createSelector(
  selectUnitNamePath,
  (namePath) => {
    if (!namePath) return [];
    const nameList = namePath.split('/');
    nameList.shift();
    const firstElm = nameList.shift();
    return [firstElm, nameList.join('/')];
  },
);

export const selectUnitNamePathWithReplacedSlash = createSelector(
  selectUnitNamePath,
  (unitNamePath) => unitNamePath?.replace(/\//g, ' - '),
);

export const selectIsCurrentUnitRoot = createSelector(
  selectRootUnitId,
  selectCurrentUnitId,
  (rootUnitId, currentUnitId) => rootUnitId === currentUnitId,
);

export const selectFullUnitName: MemoizedSelector<Object, string[]> =
  createSelector(selectRootUnit, selectCurrentUnit, (rootUnit, currentUnit) => {
    if (!rootUnit || !currentUnit) {
      return [];
    }

    const currentUnitNamePath = currentUnit.namePath.split('/');
    if (rootUnit.id === currentUnit.id) {
      return [rootUnit.name];
    }

    return [rootUnit.name, ...currentUnitNamePath];
  });

export const selectFullUnitPath: MemoizedSelector<
  Object,
  { id: string | null; level: number; name: string }[]
> = createSelector(selectUnitState, (state: UnitTreeViewState) => {
  const fullUnitPath: { id: string | null; level: number; name: string }[] = [];
  const currentUnitId = state.currentUnitId;
  if (currentUnitId) {
    let currentUnit = state.units.find((u) => u.id === currentUnitId);
    while (currentUnit) {
      fullUnitPath.unshift({
        id: currentUnit.id,
        level: currentUnit.treeLevel,
        name: currentUnit.name,
      });
      currentUnit = state.units.find((u) => u.id === currentUnit?.parentId);
    }
  }
  return fullUnitPath;
});

export const selectReverseFullUnitPath: MemoizedSelector<
  Object,
  { id: string | null; level: number; name: string }[]
> = createSelector(
  selectFullUnitPath,
  (units: { id: string | null; level: number; name: string }[]) => {
    return units.reverse();
  },
);
