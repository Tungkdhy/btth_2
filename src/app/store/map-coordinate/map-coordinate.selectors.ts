import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MapCoordinateState } from './map-coordinate.reducer';
import {
  findIdInMapCoordinate,
  flattenMultipolygon,
  flattenPolygon,
} from '../../modules/digital-map/services/utils';
import { CoordinateData, MapCoordinates } from './map.coordinates';
import { Coordinate } from 'ol/coordinate';

export const selectMapCoordinateState =
  createFeatureSelector<MapCoordinateState>('mapCoordinates');

export const selectAllMapCoordinates = createSelector(
  selectMapCoordinateState,
  (state): MapCoordinates[] => state.coordinates,
);
export const selectSelectedMapCoordinate = createSelector(
  selectMapCoordinateState,
  (state): MapCoordinates | undefined =>
    state.coordinates.find(
      (coordinate) => coordinate.id === state.selectedCoordinateId,
    ),
);

export const selectMapCoordinateById = (id: string) =>
  createSelector(
    selectMapCoordinateState,
    (state): MapCoordinates | undefined =>
      state.coordinates.find((coordinate) => coordinate.id === id),
  );

export const selectCoordinatesById = (id: string) =>
  createSelector(selectMapCoordinateState, (state): CoordinateData[] => {
    const mapCoordinate = findIdInMapCoordinate(id, state.coordinates);
    let coordinates: CoordinateData[] = [];
    if (mapCoordinate?.type === 'Polygon') {
      coordinates = flattenPolygon(
        mapCoordinate.coordinates as Array<Array<Coordinate>>,
      );
    } else if (mapCoordinate?.type === 'MultiPolygon') {
      coordinates = flattenMultipolygon(
        mapCoordinate.coordinates as Array<Array<Array<Coordinate>>>,
      );
    }

    return coordinates && coordinates.length > 0
      ? coordinates.map((coordinate, index) => ({
          ...coordinate,
          index: index + 1,
        }))
      : [];
  });
