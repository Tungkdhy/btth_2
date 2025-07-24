import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UnitState } from './unit-btth.reducer';
import {
  LayerIds,
  UnitBtth,
} from '../../modules/dashboard/models/btth.interface';

const selectUnitFeatureState = createFeatureSelector<UnitState>('unitBtth');

export const selectUnits = createSelector(
  selectUnitFeatureState,
  (state) => state.units,
);

export const selectUnitsLoading = createSelector(
  selectUnitFeatureState,
  (state) => state.loading,
);

export const selectUnitsError = createSelector(
  selectUnitFeatureState,
  (state) => state.error,
);

export const selectUnitNameByPath = (path: string) =>
  createSelector(selectUnits, (units: UnitBtth[]): string | null => {
    const unit = units.find((u) => u.path === path);
    return unit ? unit.name : null;
  });

export const selectUnitPathToParent = (path: string) =>
  createSelector(selectUnits, (units: UnitBtth[]): string => {
    const unitPath: string[] = [];
    const segments = path.split('.'); // Assuming the ltree format uses '.' as the delimiter

    // Traverse all but the last segment to exclude the unit itself
    segments.slice(0, -1).reduce((parentPath, segment) => {
      const currentPath = parentPath ? `${parentPath}.${segment}` : segment;
      const unit = units.find((u) => u.path === currentPath);

      if (unit) {
        unitPath.push(unit.name);
      }

      return currentPath;
    }, '');

    // Join the unit names with '/'
    return unitPath.join('/');
  });

export const selectPlaceByLayerName = (name: string, layerId: LayerIds) =>
  createSelector(selectUnits, (units: UnitBtth[]): string | null => {
    const unit = units.find((u) => {
      if (layerId === LayerIds.CORE) return u.core === name;
      else if (layerId === LayerIds.BOUNDARY) return u.boundary === name;
    });
    if (unit) {
      return layerId === LayerIds.CORE ? unit.corePlace : unit.boundaryPlace;
    }
    return null;
  });

export const selectUnitsByPathLevel = (level: number) =>
  createSelector(selectUnits, (units: UnitBtth[]): UnitBtth[] => {
    return units.filter((unit) => unit.path.split('.').length === level);
  });

export const selectHasChildrenByPath = (path: string) =>
  createSelector(selectUnits, (units: UnitBtth[]): boolean => {
    // Tìm đơn vị với path tương ứng
    const unit = units.find((u) => u.path === path);
    if (!unit) {
      return false; // Không tìm thấy đơn vị
    }

    // Kiểm tra trực tiếp hasChildren nếu trường này có sẵn
    if (unit.hasChildren) {
      return true;
    }

    // Nếu không có hasChildren, kiểm tra xem có đơn vị nào có path bắt đầu bằng path này
    return units.some((u) => u.path.startsWith(`${path}.`));
  });
