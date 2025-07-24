import { createReducer, on } from '@ngrx/store';
import * as EndpointStatsActions from './endpoint-stats.actions';
import {
  statsInitialState,
  StatsState,
} from '../device-stats/device-stats.models';

export const endpointStatsReducer = createReducer(
  statsInitialState,
  on(
    EndpointStatsActions.loadEndpointStats,
    (state, action): StatsState => ({
      ...state,
      loading: true,
      error: null,
      // apiFilters: {
      //   mainType: action.filters.mainType,
      //   subTypeList: action.filters.subTypeList,
      //   core: action.filters.core,
      //   coreList: action.filters.coreList,
      //   boundary: action.filters.boundary,
      //   boundaryList: action.filters.boundaryList,
      // },
    }),
  ),
  on(
    EndpointStatsActions.loadCoreEndpointStats,
    (state, action): StatsState => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),
  on(
    EndpointStatsActions.updateEndpointStatsFilters,
    (state, { filters }): StatsState => ({
      ...state,
      apiFilters: {
        ...state.apiFilters, // giữ lại các giá trị cũ của filters
        ...filters, // chỉ ghi đè những thuộc tính được truyền vào
      },
    }),
  ),
  on(
    EndpointStatsActions.loadEndpointStatsSuccess,
    (state, { data }): StatsState => ({
      ...state,
      rawData: data.rawData,
      data: data.formattedData,
      loading: false,
      error: null,
    }),
  ),
  on(
    EndpointStatsActions.loadEndpointStatsFailure,
    (state, { error }): StatsState => ({
      ...state,
      loading: false,
      error,
    }),
  ),
  on(
    EndpointStatsActions.refreshEndpointStats,
    (state): StatsState => ({
      ...state,
      loading: true,
    }),
  ),
);
