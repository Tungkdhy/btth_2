import { UnitCoordinateState } from './unit-coordinate.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectUnitCoordinateState =
  createFeatureSelector<UnitCoordinateState>('unitCoordinate');

export const selectAllUnits = createSelector(
  selectUnitCoordinateState,
  (state) => state.units,
);
export const selectSelectedUnitId = createSelector(
  selectUnitCoordinateState,
  (state) => state.selectedUnitId,
);
