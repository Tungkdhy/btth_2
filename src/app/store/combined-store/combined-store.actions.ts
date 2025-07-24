import { createAction, props } from '@ngrx/store';

export const updateFilters = createAction(
  '[Combined Store] Update Filters',
  props<{ coreLayer?: string; boundaryLayer?: string }>(),
);
export const updateDefaultFilters = createAction(
  '[Combined Store] Update Default Filters',
);
