import { createReducer, on } from '@ngrx/store';
import { MapCoordinates } from './map.coordinates';
import {
  clearSelectedMapCoordinateId,
  loadMapCoordinatesFailure,
  loadMapCoordinatesSuccess,
  selectMapCoordinateId,
} from './map-coordinate.actions';

export interface MapCoordinateState {
  coordinates: MapCoordinates[];
  selectedCoordinateId?: string;
  error: any;
}

export const initialMapCoordinateState: MapCoordinateState = {
  coordinates: [],
  selectedCoordinateId: undefined,
  error: null,
};
export const mapCoordinateReducer = createReducer<MapCoordinateState>(
  initialMapCoordinateState,
  on(
    loadMapCoordinatesSuccess,
    (state, { data }): MapCoordinateState => ({
      ...state,
      coordinates: data,
    }),
  ),
  on(
    loadMapCoordinatesFailure,
    (state, { error }): MapCoordinateState => ({
      ...state,
      error,
    }),
  ),
  on(
    selectMapCoordinateId,
    (state, { selectedId }): MapCoordinateState => ({
      ...state,
      selectedCoordinateId: selectedId,
    }),
  ),
  on(
    clearSelectedMapCoordinateId,
    (state): MapCoordinateState => ({
      ...state,
      selectedCoordinateId: undefined,
    }),
  ),
);
