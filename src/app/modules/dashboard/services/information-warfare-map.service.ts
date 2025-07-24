import { inject, Injectable } from '@angular/core';
import { Feature, Map as olMap, Overlay, View } from 'ol';
import { Observable, tap } from 'rxjs';
import { Constant } from '../../../core/config/constant';
import { map } from 'rxjs/operators';
import { Fill, Icon, Style, Text } from 'ol/style';
import { layersConfig } from '../utils/geo-layers';
import { InfoWarfareSupabaseService } from './info-warfare-supabase.service';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import {
  defaultView,
  scaleLineControl,
  splitTextIntoLines,
} from '../utils/map-utils';
import { defaults as defaultControls } from 'ol/control/defaults';
import { MultiPolygon, Point } from 'ol/geom';
import {
  HotSpotInfo,
  HotSpotStatistics,
  IwLayerIds,
  NuanceStats,
} from '../models/btth.interface';
import { fromLonLat } from 'ol/proj';
import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import { Layer } from 'ol/layer';
import { Select } from 'ol/interaction';
import { pointerMove } from 'ol/events/condition';
import { getCenter } from 'ol/extent';

@Injectable({
  providedIn: 'root',
})
export class InformationWarfareMapService {
  private map: olMap;

  private baseLayer: TileLayer<any>;
  private nuanceLayer: VectorLayer<VectorSource>;
  private hotSpotInfoLayer: VectorLayer<VectorSource>;
  private hotSpotStatsLayer: WebGLPointsLayer<VectorSource<Point>>;

  private tooltipOverlay: Overlay;

  private supabaseService = inject(InfoWarfareSupabaseService);

  constructor() {}

  initializeMap() {
    this.setupBaseLayers();
    this.map = new olMap({
      layers: [
        this.baseLayer,
        this.nuanceLayer,
        this.hotSpotInfoLayer,
        this.hotSpotStatsLayer,
      ],
      view: this.getDefaultView(),
      controls: this.getDefaultControls(),
    });
    this.animateFeatures();
  }

  getMapInstance(): olMap {
    return this.map;
  }

  getNuanceLayer(): VectorLayer<VectorSource> {
    return this.nuanceLayer;
  }

  getHotSpotStatsLayer(): WebGLPointsLayer<any> {
    return this.hotSpotStatsLayer;
  }

  getHotSpotInfoLayer(): VectorLayer<VectorSource> {
    return this.hotSpotInfoLayer;
  }

  setupBaseLayers() {
    this.baseLayer = this.createBaseLayer();
    this.nuanceLayer = this.createNuanceLayer();
    this.hotSpotInfoLayer = this.createHotSpotInfoLayer();
    this.hotSpotStatsLayer = this.createHotSpotStatsLayer();
  }

  createBaseLayer(): TileLayer<any> {
    return layersConfig.OSM_MAP;
  }

  createNuanceLayer(): VectorLayer<VectorSource> {
    return new VectorLayer({ source: new VectorSource(), maxZoom: 9 });
  }

  createHotSpotInfoLayer(): VectorLayer<VectorSource> {
    return new VectorLayer({ source: new VectorSource(), minZoom: 12 });
  }

  createHotSpotStatsLayer(): WebGLPointsLayer<VectorSource<Point>> {
    return new WebGLPointsLayer({
      source: new VectorSource<Point>(),
      maxZoom: 12,
      style: {
        symbol: {
          symbolType: 'circle',
          size: ['get', 'radius', 'number'],
          color: '#E85C0D',
          opacity: ['get', 'opacity', 'number'],
        },
      },
    });
  }

  getDefaultView() {
    return defaultView();
  }

  getDefaultControls() {
    return defaultControls().extend([scaleLineControl]);
  }

  getHotSpotLayers(): Layer[] {
    return [this.hotSpotInfoLayer, this.hotSpotStatsLayer];
  }

  getNuanceLayers(): Layer[] {
    return [this.nuanceLayer];
  }

  createHoverInteraction(
    layers: Layer<any>[],
    updateTooltip: (event: any) => void,
  ): Select {
    const hoverInteraction = new Select({
      condition: pointerMove,
      layers,
      style: (feature) => {
        return this.getStyleByType(
          feature.get('type'),
          feature.get('name'),
          '#3187FF',
        );
      },
    });

    hoverInteraction.on('select', updateTooltip);
    return hoverInteraction;
  }

  createHoverInteractionForMultiPolygon(
    layers: Layer<any>[],
    updateTooltip: (event: any) => void,
  ): Select {
    const hoverInteraction = new Select({
      condition: pointerMove,
      layers,
    });

    hoverInteraction.on('select', updateTooltip);
    return hoverInteraction;
  }

  showTooltip(overlay: Overlay, feature: Feature, content: string): void {
    const geometry = feature.getGeometry();
    const coordinate = (geometry as Point).getCoordinates();
    const element = this.tooltipOverlay.getElement();

    if (element) {
      this.tooltipOverlay.setPosition(coordinate);
      element.innerHTML = content;
      element.style.display = 'block';
    }
  }

  showTooltipForMultiPolygon(
    overlay: Overlay,
    feature: Feature,
    content: string,
  ): void {
    const geometry = feature.getGeometry();

    // Ensure the geometry is a MultiPolygon
    if (geometry instanceof MultiPolygon) {
      // Get the center of the polygon by calculating the centroid
      const extent = geometry.getExtent();
      const center = getCenter(extent); // This gives the center of the bounding box of the MultiPolygon

      const element = this.tooltipOverlay.getElement();

      if (element) {
        this.tooltipOverlay.setPosition(center);
        element.innerHTML = content;
        element.style.display = 'block';
      }
    }
  }

  createTooltipOverlay(): HTMLElement {
    const tooltipElement = document.createElement('div');
    tooltipElement.id = `ol-tooltip`;
    tooltipElement.style.display = 'block';

    this.tooltipOverlay = new Overlay({
      element: tooltipElement,
      offset: [10, 0],
      positioning: 'bottom-left',
    });

    this.map.addOverlay(this.tooltipOverlay);
    return tooltipElement;
  }

  getStyleByType(
    type: string | undefined,
    name: string,
    color?: string,
  ): Style {
    let src = '';
    switch (type) {
      case 'IndustrialPark':
        src = 'assets/media/svg/map/industrial.png';
        break;
      case 'BOT':
        src = 'assets/media/svg/map/bot.png';
        break;
      case 'Parish':
        src = 'assets/media/svg/map/parish.png';
        break;
      default:
        src = 'assets/media/svg/map/pinlet.png';
        break;
    }

    const lines = splitTextIntoLines(name, 100, '12px Calibri,sans-serif');
    const offsetY = lines.length > 1 ? -((lines.length - 1) * 10) / 2 : 0;

    return new Style({
      image: new Icon({
        src,
        width: Constant.DEFAULT.MAP.ICON_SIZE.PINLET.WIDTH,
        height: Constant.DEFAULT.MAP.ICON_SIZE.PINLET.HEIGHT,
      }),
      text: new Text({
        font: '12px Calibri,sans-serif',
        text: lines.join('\n'),
        offsetX: 25,
        offsetY,
        fill: new Fill({ color: color || '#000' }),
        textAlign: 'left',
      }),
    });
  }

  renderNuanceStats(): Observable<NuanceStats[]> {
    return this.supabaseService.getNuanceStats().pipe(
      map((features) => {
        return features.filter((item) => item.totalCount > 0);
      }),
      map((stats) => this.createNuanceLayerFeatures(stats)),
    );
  }

  renderHotSpotStats(): Observable<HotSpotStatistics[]> {
    return this.supabaseService
      .getHotSpotStatsData()
      .pipe(map((stats) => this.createHotSpotStatsFeatures(stats)));
  }

  renderHotSpotInfo(): Observable<HotSpotInfo[]> {
    return this.supabaseService
      .getHotSpotInfoData()
      .pipe(map((info) => this.createHotSpotInfoFeatures(info)));
  }

  createNuanceLayerFeatures(stats: NuanceStats[]): NuanceStats[] {
    const features: Feature[] = stats.map((item) => {
      const multiPolygon = new MultiPolygon(
        item.coordinates.coordinates as any,
      );
      multiPolygon.transform('EPSG:4326', 'EPSG:3857');

      const feature = new Feature({
        geometry: multiPolygon,
        name: item.name,
        totalCount: item.totalCount,
        positiveCount: item.positiveCount,
        neutralCount: item.neutralCount,
        negativeCount: item.negativeCount,
        layerId: IwLayerIds.NUANCE,
      });

      feature.setStyle(this.getHeatMapStyle(item.totalCount));
      return feature;
    });

    this.nuanceLayer.getSource()?.clear();
    this.nuanceLayer.getSource()?.addFeatures(features);
    return stats;
  }

  createHotSpotStatsFeatures(stats: HotSpotStatistics[]): HotSpotStatistics[] {
    const features: Feature<Point>[] = stats.map((item) => {
      const coordinate = [item.longitude, item.latitude];
      const radius =
        ((item.totalBots + item.totalIndustrialParks + item.totalParishes) /
          10) *
        2;

      return new Feature({
        geometry: new Point(fromLonLat(coordinate)),
        name: item.unit,
        totalBots: item.totalBots,
        totalIndustrialParks: item.totalIndustrialParks,
        totalParishes: item.totalParishes,
        radius,
        opacity: 1,
        layerId: IwLayerIds.HOTSPOT_STATS,
      });
    });

    this.hotSpotStatsLayer.getSource()?.clear();
    this.hotSpotStatsLayer.getSource()?.addFeatures(features);
    return stats;
  }

  createHotSpotInfoFeatures(info: HotSpotInfo[]): HotSpotInfo[] {
    const features: Feature[] = info.map((item) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([item.longitude, item.latitude])),
        name: item.name,
        type: item.type,
        address: item.address,
        unit: item.unit.join(', '),
        layerId: IwLayerIds.HOTSPOT_INFO,
      });

      feature.setStyle(this.getStyleByType(item.type, item.name));
      return feature;
    });

    this.hotSpotInfoLayer.getSource()?.clear();
    this.hotSpotInfoLayer.getSource()?.addFeatures(features);
    return info;
  }

  getHeatMapStyle(totalCount: number): Style {
    return new Style({
      fill: new Fill({
        color: this.getColorByTotalCount(totalCount),
      }),
    });
  }

  getColorByTotalCount(totalCount: number): string {
    if (totalCount === 0) return `rgba(255, 0, 0, 0)`;
    const baseOpacity = 0.2;
    const maxOpacity = 0.9;
    const step = 10000;
    const increment = 0.1;

    const steps = Math.floor(totalCount / step);
    let opacity = baseOpacity + steps * increment;
    opacity = Math.min(opacity, maxOpacity);

    return `rgba(255, 0, 0, ${opacity})`;
  }

  animateFeatures() {
    let increasing = true;
    let opacity = 0.5;

    const animate = () => {
      this.hotSpotStatsLayer
        .getSource()
        ?.getFeatures()
        .forEach((feature) => {
          if (increasing) {
            opacity += 0.001;
            if (opacity >= 0.8) {
              increasing = false;
            }
          } else {
            opacity -= 0.001;
            if (opacity <= 0.5) {
              increasing = true;
            }
          }

          feature.set('opacity', opacity);
        });

      this.map.render();
      requestAnimationFrame(animate);
    };

    animate();
  }

  destroyMap() {
    this.map.getInteractions().clear();
    this.map.getOverlays().clear();
    this.map.dispose();
  }
}
