import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StatsState } from '../device-stats/device-stats.models';

export const selectSecurityStatsState =
  createFeatureSelector<StatsState>('securityStats');

// Select dữ liệu tổng thể
export const selectSecurityStatsData = createSelector(
  selectSecurityStatsState,
  (state: StatsState) => state.data,
);

export const selectSecurityStatsRawData = createSelector(
  selectSecurityStatsState,
  (state: StatsState) => state.rawData,
);

// Select bộ lọc api
export const selectSecurityStatsApiFilters = createSelector(
  selectSecurityStatsState,
  (state: StatsState) => state.apiFilters,
);

// Select trạng thái loading
export const selectSecurityStatsLoading = createSelector(
  selectSecurityStatsState,
  (state: StatsState) => state.loading,
);

// Select lỗi
export const selectSecurityStatsError = createSelector(
  selectSecurityStatsState,
  (state: StatsState) => state.error,
);
