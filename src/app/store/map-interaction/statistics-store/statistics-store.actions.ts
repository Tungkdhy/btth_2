import { createAction, props } from '@ngrx/store';
import { StatsApiFilters } from '../device-stats/device-stats.models';

export const updateFilters = createAction(
  '[Statistics Store] Update Filters',
  props<{
    filters: Partial<StatsApiFilters>;
  }>(),
);
export const updateDefaultFilters = createAction(
  '[Statistics Store] Update Default Filters',
);

export const loadCoreStats = createAction('[Statistics Store] Load Core Stats');
export const loadBoundaryStats = createAction(
  '[Statistics Store] Load Boundary Stats',
  props<{ coreLayerCode?: string }>(),
);

export const loadBoundaryStatsByCoreName = createAction(
  '[Statistics Store] Load Boundary Stats By Core Name',
  props<{ coreName?: string }>(),
);

export const loadAccessStatsByBoundaryCode = createAction(
  '[Statistics Store] Load Access Stats',
  props<{ boundaryCode?: string }>(),
);

export const loadAccessStatsByBoundaryCodeAndLevel = createAction(
  '[Statistics Store] Load Access Stats By Boundary Code And Level',
  props<{ boundaryCode?: string; level: number; unitPath?: string }>(),
);

export const loadAccessStatsByUnitPath = createAction(
  '[Statistics Store] Load Access Stats By Unit Path',
  props<{ unitPath: string; boundaryCode?: string; coreCode?: string }>(),
);

// export const loadAccessStatsByUnitPathAndBoundaryAndCore = createAction(
//   '[Statistics Store] Load Access Stats By Unit Path And Boundary And Core',
//   props<{ unitPath: string }>(),
// );

export const refreshStatistics = createAction(
  '[Statistics Store] Refresh Statistics Store',
);

export const stopRefreshStatistics = createAction(
  '[Statistics Store] Stop Refresh Statistics Store',
);
