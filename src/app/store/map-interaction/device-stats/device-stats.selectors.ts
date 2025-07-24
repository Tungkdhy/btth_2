import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StatsState } from './device-stats.models';

export const selectDeviceStatsState =
  createFeatureSelector<StatsState>('deviceStats');

// Select dữ liệu tổng thể
export const selectDeviceStatsData = createSelector(
  selectDeviceStatsState,
  (state: StatsState) => state.data,
);

export const selectDeviceStatsRawData = createSelector(
  selectDeviceStatsState,
  (state: StatsState) => state.rawData,
);

// Select bộ lọc api
export const selectDeviceStatsApiFilters = createSelector(
  selectDeviceStatsState,
  (state: StatsState) => state.apiFilters,
);

// Select trạng thái loading
export const selectDeviceStatsLoading = createSelector(
  selectDeviceStatsState,
  (state: StatsState) => state.loading,
);

// Select lỗi
export const selectDeviceStatsError = createSelector(
  selectDeviceStatsState,
  (state: StatsState) => state.error,
);
