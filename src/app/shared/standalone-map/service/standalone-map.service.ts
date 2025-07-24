import { inject, Injectable } from '@angular/core';
import TileWMS from 'ol/source/TileWMS';
import { Source } from 'ol/source';
import { Map, View } from 'ol';
import TileSource from 'ol/source/Tile';
import { defaults as defaultControls } from 'ol/control/defaults';
import { defaults as defaultInteractions } from 'ol/interaction/defaults';
import { FullScreen } from 'ol/control';
import { useGeographic } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import { Coordinate } from 'ol/coordinate';
import { BehaviorSubject, Observable } from 'rxjs';
import { Constant } from '../../../core/config/constant';
import { ConfigService } from '../../../core/services/config.service';

@Injectable({
  providedIn: 'root',
})
export class StandaloneMapService {
  tileSources: Array<{ name: string; source: Source | null }>;
  map: Map;
  view: View;
  tileLayer: TileLayer<TileSource>;

  private zoomLevel$ = new BehaviorSubject<number>(0);
  private zoomCenter$ = new BehaviorSubject<Coordinate>([0, 0]);

  private config = inject(ConfigService);
  constructor() {
    // private coordinateFormatter: CoordinateFormatterService
    useGeographic();
    const geoserver = this.config.getGeoserverUrl();
    this.tileSources = [
      {
        name: 'Bản đồ đường phố',
        source: new TileWMS({
          url: geoserver + '/osm/wms',
          params: { LAYERS: 'osm:osm', TILED: true },
          serverType: 'geoserver',
          transition: 0,
        }),
      },
    ];

    this.tileLayer = new TileLayer();
  }

  initialMap(
    mapId: string,
    latitude: number = Constant.DEFAULT.MAP.VIEW.LATITUDE,
    longitude: number = Constant.DEFAULT.MAP.VIEW.LONGITUDE,
    zoomLevel: number = Constant.DEFAULT.MAP.VIEW.ZOOM_LEVEL,
  ) {
    this.view = new View({
      center: [latitude, longitude],
      zoom: zoomLevel,
      constrainResolution: true,
    });

    this.tileLayer.setSource(this.tileSources[0].source as TileSource);
    if (
      !this.map ||
      this.map.getTarget() === null ||
      this.map.getTarget() === undefined
    ) {
      this.map = new Map({
        target: mapId,
        view: this.view,
        controls: defaultControls().extend([
          new FullScreen({
            source: 'fullscreen',
          }),
        ]),
        layers: [this.tileLayer],
        interactions: defaultInteractions({
          doubleClickZoom: false,
        }),
      });

      // this.map.addControl(this.coordinateFormatter.control);
      this.catchMoveEnd(this.map);
    }
  }

  catchMoveEnd(map: Map): void {
    map.on('moveend', (event) => {
      const mapView = event.map.getView();
      const zoomLevel = mapView.getZoom();
      const zoomCenter = mapView.getCenter();

      if (zoomLevel && zoomCenter) {
        this.zoomCenter$.next(zoomCenter);
        this.zoomLevel$.next(zoomLevel);
      }
    });
  }

  getCenter(): Observable<Coordinate> {
    return this.zoomCenter$.asObservable();
  }

  getZoomLevel(): Observable<number> {
    return this.zoomLevel$.asObservable();
  }

  // numberCoordinates(
  //   coordinates: Coordinate | undefined,
  //   fractionDigits: number = 0
  // ): Coordinate | undefined {
  //   if (!coordinates) return undefined;
  //   coordinates = toLonLat(coordinates);
  //   const x = coordinates[0];
  //   const y = coordinates[1];
  //   const digitsInfo = `1.${fractionDigits}-${fractionDigits}`;
  //   const sX = this.decimalPipe.transform(x, digitsInfo);
  //   const sY = this.decimalPipe.transform(y, digitsInfo);
  //   if (sX && sY) {
  //     return [Number(sX), Number(sY)];
  //   }
  // }

  destroyMap(): void {
    this.map.setTarget(undefined);
    this.map.dispose();
  }
}
