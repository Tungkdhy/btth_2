import { createReducer, on } from '@ngrx/store';
import * as MapActions from './map-store.actions';
import { MapState } from './map-store.model';
import { defaultFilters } from '../map-interaction-utils';

const initialState: MapState = {
  currentLevel: 1,
  deviceData: [],
  securityData: [],
  isLoading: false,
  error: null,
  apiFilters: defaultFilters,
};

export const mapStoreReducer = createReducer(
  initialState,
  // Cập nhật mức zoom hiện tại
  on(
    MapActions.updateMapLevel,
    (state, { level }): MapState => ({
      ...state,
      currentLevel: level,
      isLoading: true, // Bắt đầu tải dữ liệu mới
      error: null,
    }),
  ),
  // Tải dữ liệu cho device thành công
  on(
    MapActions.loadDeviceDataSuccess,
    (state, { data }): MapState => ({
      ...state,
      deviceData: data,
      isLoading: false,
    }),
  ),
  // Tải dữ liệu cho device thất bại
  on(
    MapActions.loadDeviceDataFailure,
    (state, { error }): MapState => ({
      ...state,
      isLoading: false,
      error,
    }),
  ),
  // Tải dữ liệu cho security thành công
  on(
    MapActions.loadSecurityDataSuccess,
    (state, { data }): MapState => ({
      ...state,
      securityData: data,
      isLoading: false,
    }),
  ),
  // Tải dữ liệu cho security thất bại
  on(
    MapActions.loadSecurityDataFailure,
    (state, { error }): MapState => ({
      ...state,
      isLoading: false,
      error,
    }),
  ),
  on(
    MapActions.updateMapFilters,
    (state, { filters }): MapState => ({
      ...state,
      apiFilters: {
        ...state.apiFilters, // giữ lại các giá trị cũ của filters
        ...filters, // chỉ ghi đè những thuộc tính được truyền vào
      },
    }),
  ),
  on(
    MapActions.updateMapDefaultFilters,
    (state): MapState => ({
      ...state,
      apiFilters: defaultFilters,
    }),
  ),
  on(
    MapActions.refreshMap,
    (state): MapState => ({
      ...state,
      isLoading: true,
    }),
  ),
);
