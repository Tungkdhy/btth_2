import { createAction, props } from '@ngrx/store';
import {
  MapDeviceCount,
  MapStatistics,
} from '../../../modules/dashboard/models/btth.interface';
import { StatsApiFilters } from './device-stats.models';

export const loadDeviceStats = createAction(
  '[Device Stats] Load Device Stats',
  props<{
    filters: StatsApiFilters;
  }>(),
);

export const loadDeviceStatsSuccess = createAction(
  '[Device Stats] Load Device Stats Success',
  props<{ data: MapStatistics }>(),
);

export const loadDeviceStatsFailure = createAction(
  '[Device Stats] Load Device Stats Failure',
  props<{ error: any }>(),
);

export const updateDeviceStatsFilters = createAction(
  '[Device Stats] Update Filters',
  props<{ filters: Partial<StatsApiFilters> }>(),
);

export const refreshDeviceStats = createAction(
  '[Device Stats] Refresh Device Stats',
);

export const stopRefreshDeviceStats = createAction(
  '[Device Stats] Stop Refresh Device Stats',
);
