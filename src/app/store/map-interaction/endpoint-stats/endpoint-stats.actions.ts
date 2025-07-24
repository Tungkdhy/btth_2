import { createAction, props } from '@ngrx/store';
import { StatsApiFilters } from '../device-stats/device-stats.models';
import {
  MapDeviceCount,
  MapStatistics,
} from '../../../modules/dashboard/models/btth.interface';

export const loadEndpointStats = createAction(
  '[Endpoint Stats] Load Endpoint Stats',
  props<{
    filters: StatsApiFilters;
  }>(),
);

export const loadAccessEndpointStatsByBoundaryId = createAction(
  '[Endpoint Stats] Load Access Endpoint Stats By Boundary ID',
  props<{ boundaryId: string }>(),
);

export const loadAccessEndpointStatsByBoundaryIdAndLevel = createAction(
  '[Endpoint Stats] Load Access Endpoint Stats By Boundary ID',
  props<{ boundaryId: string; level: number }>(),
);

export const loadCoreEndpointStats = createAction(
  '[Endpoint Stats] Load Core Endpoint Stats',
  // props<{ filters: Partial<EndpointStatsApiFilters> }>(),
);

export const loadBoundaryEndpointStats = createAction(
  '[Endpoint Stats] Load Boundary Endpoint Stats',
  props<{ filters: Partial<StatsApiFilters> }>(),
);

export const loadEndpointStatsSuccess = createAction(
  '[Endpoint Stats] Load Endpoint Stats Success',
  props<{ data: MapStatistics }>(),
);

export const loadEndpointStatsFailure = createAction(
  '[Endpoint Stats] Load Endpoint Stats Failure',
  props<{ error: any }>(),
);

export const updateEndpointStatsFilters = createAction(
  '[Endpoint Stats] Update Filters',
  props<{ filters: Partial<StatsApiFilters> }>(),
);

export const refreshEndpointStats = createAction(
  '[Endpoint Stats] Refresh Endpoint Stats',
);

export const stopRefreshEndpointStats = createAction(
  '[Endpoint Stats] Stop Refresh Endpoint Stats',
);
