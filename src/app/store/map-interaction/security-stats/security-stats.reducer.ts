import { createReducer, on } from '@ngrx/store';
import * as SecurityStatsActions from './security-stats.actions';
import {
  statsInitialState,
  StatsState,
} from '../device-stats/device-stats.models';

export const securityStatsReducer = createReducer(
  statsInitialState,
  on(
    SecurityStatsActions.loadSecurityStats,
    (state, action): StatsState => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),
  on(
    SecurityStatsActions.loadCoreSecurityStats,
    (state, action): StatsState => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),
  on(
    SecurityStatsActions.updateSecurityStatsFilters,
    (state, { filters }): StatsState => ({
      ...state,
      apiFilters: {
        ...state.apiFilters, // giữ lại các giá trị cũ của filters
        ...filters, // chỉ ghi đè những thuộc tính được truyền vào
      },
    }),
  ),
  on(
    SecurityStatsActions.loadSecurityStatsSuccess,
    (state, { data }): StatsState => ({
      ...state,
      rawData: data.rawData,
      data: data.formattedData,
      loading: false,
      error: null,
    }),
  ),
  on(
    SecurityStatsActions.loadSecurityStatsFailure,
    (state, { error }): StatsState => ({
      ...state,
      loading: false,
      error,
    }),
  ),
  on(
    SecurityStatsActions.refreshSecurityStats,
    (state): StatsState => ({
      ...state,
      loading: true,
    }),
  ),
);
