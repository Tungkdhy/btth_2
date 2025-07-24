import { createAction, props } from '@ngrx/store';
import { MapDeviceCount } from '../../../modules/dashboard/models/btth.interface';
import { MapApiFilters } from './map-store.model';

// Cập nhật mức zoom hiện tại trên bản đồ
export const updateMapLevel = createAction(
  '[Map] Update Map Level',
  props<{ level: number }>(),
);

// Tải dữ liệu cho device
export const loadDeviceData = createAction(
  '[Map] Load Device Data',
  props<{
    filters: MapApiFilters;
  }>(),
);

export const loadDeviceDataSuccess = createAction(
  '[Map] Load Device Data Success',
  props<{ data: MapDeviceCount[] }>(),
);
export const loadDeviceDataFailure = createAction(
  '[Map] Load Device Data Failure',
  props<{ error: string }>(),
);

// Tải dữ liệu cho security
export const loadSecurityData = createAction(
  '[Map] Load Security Data',
  props<{
    filters: MapApiFilters;
  }>(),
);
export const loadSecurityDataSuccess = createAction(
  '[Map] Load Security Data Success',
  props<{ data: MapDeviceCount[] }>(),
);
export const loadSecurityDataFailure = createAction(
  '[Map] Load Security Data Failure',
  props<{ error: string }>(),
);

export const loadCoreData = createAction('[Map Store] Load Core Data');

export const loadBoundaryData = createAction(
  '[Map Store] Load Boundary Data',
  props<{ coreLayerName?: string }>(),
);

export const loadBoundaryDataByCoreName = createAction(
  '[Map Store] Load Boundary Data By Core Name',
  props<{ coreLayerName?: string }>(),
);

export const loadAccessDataByBoundaryIdAndLevel = createAction(
  '[Map Store] Load Access Data',
  props<{ boundaryLayerName?: string; level: number }>(),
);

export const updateMapFilters = createAction(
  '[Map Store] Update Filters',
  props<{ filters: Partial<MapApiFilters> }>(),
);

export const updateMapDefaultFilters = createAction(
  '[Map Store] Update Default Filters',
);

export const refreshMap = createAction('[Map Store] Refresh Map Store');

export const stopRefreshMap = createAction(
  '[Map Store] Stop Refresh Map Store',
);
