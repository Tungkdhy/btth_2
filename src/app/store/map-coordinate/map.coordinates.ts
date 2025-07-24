import { GeometryType } from 'ol/render/webgl/MixedGeometryBatch';
import { Coordinate } from 'ol/coordinate';

export interface MapCoordinates {
  id: string;
  name: string;
  children?: MapCoordinates[];
  coordinates: Array<Array<Array<Coordinate>>> | Array<Array<Coordinate>>;
  bbox: number[];
  type: GeometryType;
}

export interface CoordinateData {
  index?: number;
  x: number;
  y: number;
}
