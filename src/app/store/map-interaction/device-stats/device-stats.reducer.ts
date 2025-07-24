import { createReducer, on } from '@ngrx/store';
import * as DeviceStatsActions from './device-stats.actions';
import { statsInitialState, StatsState } from './device-stats.models';
import { updateDeviceStatsFilters } from './device-stats.actions';

export const deviceStatsReducer = createReducer(
  statsInitialState,
  on(
    DeviceStatsActions.loadDeviceStats,
    (state, action): StatsState => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),
  // on(
  //   DeviceStatsActions.updateDeviceStatsFilters,
  //   (state, { filters }): StatsState => ({
  //     ...state,
  //     apiFilters: {
  //       ...state.apiFilters, // giữ lại các giá trị cũ của filters
  //       ...filters, // chỉ ghi đè những thuộc tính được truyền vào
  //     },
  //   }),
  // ),
  on(
    DeviceStatsActions.updateDeviceStatsFilters,
    (state, { filters }): StatsState => {
      return {
        ...state,
        apiFilters: {
          ...state.apiFilters, // giữ lại các giá trị cũ của filters
          ...filters, // chỉ ghi đè những thuộc tính được truyền vào
        },
      };
    },
  ),
  on(
    DeviceStatsActions.loadDeviceStatsSuccess,
    (state, { data }): StatsState => ({
      ...state,
      rawData: data.rawData,
      data: data.formattedData, // Update newData with the latest data
      loading: false,
      error: null,
    }),
  ),
  on(
    DeviceStatsActions.loadDeviceStatsFailure,
    (state, { error }): StatsState => ({
      ...state,
      loading: false,
      error,
    }),
  ),
  on(
    DeviceStatsActions.refreshDeviceStats,
    (state): StatsState => ({
      ...state,
      loading: true,
    }),
  ),
);
