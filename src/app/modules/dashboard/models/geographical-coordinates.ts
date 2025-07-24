import { Geometry, Polygon } from 'ol/geom';
import { Type } from 'ol/geom/Geometry';

export interface GeographicalCoordinates {}

export interface District {
  id: string;
  districtId: string | null;
  name: string;
  type: string;
  bbox: any;
  coordinates: any;
  provinceId: string;
}

export interface BriefProvince {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  coordinatesGeoJson: GeoJson;
}

export interface DeviceStats {
  id: string;
  name: string;
  code?: string;
  unitId?: string;
  foreignId?: string | number;
  foreignCode?: string;
  unitPath?: string;
  unitIcon?: string | null;
  long: number;
  lat: number;
  count?: number;
  device?: string;
  wan?: string;
  wanTn?: string;
}

export interface GeoJson {
  type: Type;
  coordinates: number[][] | number[][][] | number[][][][] | number[] | number;
}
