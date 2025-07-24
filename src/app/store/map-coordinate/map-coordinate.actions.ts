import { createAction, props } from '@ngrx/store';
import { MapCoordinates } from './map.coordinates';

export const loadMapCoordinates = createAction(
  '[Map Coordinate] Load Map Coordinates',
);

export const loadMapCoordinatesSuccess = createAction(
  '[Map Coordinate] Load Map Coordinates Success',
  props<{ data: MapCoordinates[] }>(),
);

export const loadMapCoordinatesFailure = createAction(
  '[Map Coordinate] Load Map Coordinates Failure',
  props<{ error: any }>(),
);

export const selectMapCoordinateId = createAction(
  '[Map Coordinate] Select Map Coordinate',
  props<{ selectedId: string }>(),
);

export const clearSelectedMapCoordinateId = createAction(
  '[Map Coordinate] Clear Selected Map Coordinate Id',
);
