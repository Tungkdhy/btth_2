import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MapState } from './map-store.model';

export const selectMapState = createFeatureSelector<MapState>('map');

export const selectCurrentLevel = createSelector(
  selectMapState,
  (state: MapState) => state.currentLevel,
);

export const selectDeviceData = createSelector(
  selectMapState,
  (state: MapState) => state.deviceData,
);

export const selectSecurityData = createSelector(
  selectMapState,
  (state: MapState) => state.securityData,
);

export const selectIsLoading = createSelector(
  selectMapState,
  (state: MapState) => state.isLoading,
);

export const selectError = createSelector(
  selectMapState,
  (state: MapState) => state.error,
);

export const selectMapApiFilters = createSelector(
  selectMapState,
  (state: MapState) => state.apiFilters,
);
