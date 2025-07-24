import { createAction, props } from '@ngrx/store';
import {
  MapDeviceCount,
  MapStatistics,
} from '../../../modules/dashboard/models/btth.interface';
import { StatsApiFilters } from '../device-stats/device-stats.models';

export const loadSecurityStats = createAction(
  '[Security Stats] Load Security Stats',
  props<{
    filters: StatsApiFilters;
  }>(),
);

export const loadCoreSecurityStats = createAction(
  '[Security Stats] Load Core Security Stats',
  // props<{ filters: Partial<SecurityStatsApiFilters> }>(),
);

export const loadBoundarySecurityStats = createAction(
  '[Security Stats] Load Boundary Security Stats',
  props<{ filters: Partial<StatsApiFilters> }>(),
);

export const loadSecurityStatsSuccess = createAction(
  '[Security Stats] Load Security Stats Success',
  props<{ data: MapStatistics }>(),
);

export const loadSecurityStatsFailure = createAction(
  '[Security Stats] Load Security Stats Failure',
  props<{ error: any }>(),
);

export const updateSecurityStatsFilters = createAction(
  '[Security Stats] Update Filters',
  props<{ filters: Partial<StatsApiFilters> }>(),
);

export const refreshSecurityStats = createAction(
  '[Security Stats] Refresh Security Stats',
);

export const stopRefreshSecurityStats = createAction(
  '[Security Stats] Stop Refresh Security Stats',
);
