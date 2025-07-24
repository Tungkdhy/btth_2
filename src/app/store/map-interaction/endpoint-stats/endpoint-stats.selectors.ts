import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StatsState } from '../device-stats/device-stats.models';

export const selectEndpointStatsState =
  createFeatureSelector<StatsState>('endpointStats');

// Select dữ liệu tổng thể
export const selectEndpointStatsData = createSelector(
  selectEndpointStatsState,
  (state: StatsState) => state.data,
);

export const selectEndpointStatsRawData = createSelector(
  selectEndpointStatsState,
  (state: StatsState) => state.rawData,
);

// Select bộ lọc api
export const selectEndpointStatsApiFilters = createSelector(
  selectEndpointStatsState,
  (state: StatsState) => state.apiFilters,
);

// Select trạng thái loading
export const selectEndpointStatsLoading = createSelector(
  selectEndpointStatsState,
  (state: StatsState) => state.loading,
);

// Select lỗi
export const selectEndpointStatsError = createSelector(
  selectEndpointStatsState,
  (state: StatsState) => state.error,
);
