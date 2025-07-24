import { inject, Injectable } from '@angular/core';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Collection, Feature, Map as olMap, View } from 'ol';
import { Constant } from '../../../core/config/constant';
import { SupabaseService } from './supabase.service';
import { DeviceStats } from '../models/geographical-coordinates';
import { Point } from 'ol/geom';
import { fromLonLat, transform } from 'ol/proj';
import { Fill, Icon, Stroke, Style } from 'ol/style';
import { Tooltip } from 'bootstrap';
import { Pixel } from 'ol/pixel';
import { Interaction } from 'ol/interaction';
import CircleStyle from 'ol/style/Circle';
import { UnitTree } from '../models/unit-tree';
import { UnitTreeFilter } from '../models/unit-tree-filter';
import { Coordinate } from 'ol/coordinate';
import { SocketEventType } from '../models/utils-type';
import { DeviceCount } from '../models/device-count';
import {
  BCTTRouter,
  DeviceCountDto,
  SecurityEventCountDto,
} from '../models/btth.dto';
import { SecurityEvent } from '../models/security-event';
import { formatDate } from '../../../_metronic/layout/core/common/common-utils';
import { from, Observable } from 'rxjs';
import { LayerTypes, TCTTTargetType } from '../models/btth.type';
import { Cluster } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import BaseLayer from 'ol/layer/Base';
import LayerGroup from 'ol/layer/Group';
import { defaults as defaultControls, ScaleLine } from 'ol/control';
import { LayerIds } from '../models/btth.interface';
import { layersConfig } from '../utils/geo-layers';
import { SocketService } from './socket.service';

type RouterLayerType = 'core' | 'boundary' | 'access';

@Injectable({
  providedIn: 'root',
})
export class AdministrativeMapService {
  get map(): olMap {
    return this._map;
  }
  private readonly _map: olMap;
  tileLayer: TileLayer<TileWMS>;
  tileLayer250: TileLayer<TileWMS>;
  tileLayer100: TileLayer<TileWMS>;

  vectorSource: VectorSource;
  vectorLayer: VectorLayer<VectorSource>;
  currentFeature?: Feature;
  highlightFeature: Feature | null = null;

  clearStyleCache: Style[] = [];
  blurStyleCache: Style[] = [];

  payloadChannel$: Observable<any>;

  currentStyle: Style;
  highlightStyle: Style;
  alertStyle: Style;
  pointStyle: Style;

  // Handle router layer on map
  coreSource: VectorSource;
  boundarySource: VectorSource;
  accessSource: VectorSource;
  unitSource: VectorSource;
  tcttSource: VectorSource;

  clusterSource: Cluster;

  coreLayer: VectorLayer<VectorSource>;
  boundaryLayer: VectorLayer<VectorSource>;
  accessLayer: VectorLayer<VectorSource>;
  unitLayer: VectorLayer<VectorSource>;
  tcttLayer: VectorLayer<VectorSource>;

  alertSource: VectorSource;
  alertLayer: VectorLayer<VectorSource>;

  historyStack: {
    layer: RouterLayerType;
    id: string;
    layerData: DeviceStats[];
  }[] = [];

  scaleLineControl = new ScaleLine({
    units: 'metric', // 'degrees', 'imperial', 'nautical', 'metric', 'us'
    bar: true, // true to show the scale bar
    steps: 4, // Number of steps (subdivisions) in the scale bar
    text: true, // true to render the text label
    minWidth: 200, // Minimum width of the scale line in pixels
  });

  private networkSystemLayers: Map<number, VectorLayer<VectorSource>> = new Map<
    number,
    VectorLayer<VectorSource>
  >();

  private baseLayers: Map<number, TileLayer<any>> = new Map<
    number,
    TileLayer<any>
  >();

  private alertLayers: Map<number, VectorLayer<VectorSource>> = new Map<
    number,
    VectorLayer<VectorSource>
  >();

  private cableLayers: Map<number, TileLayer<TileWMS>> = new Map<
    number,
    TileLayer<TileWMS>
  >();

  private sourceList: Map<number, VectorSource> = new Map<
    number,
    VectorSource
  >();

  protected readonly supabase = inject(SupabaseService);
  protected readonly socket = inject(SocketService);

  constructor() {
    //this.supabase.signIn().then();
    this.initDefault();
    this.vectorSource = new VectorSource();
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
    });

    this.importBaseLayers();
    // this.importCableLayers();
    this.importNetworkSystemLayers();

    this._map = new olMap({
      layers: [
        ...this.baseLayers.values(),
        // ...this.cableLayers.values(),
        ...this.networkSystemLayers.values(),
        ...this.alertLayers.values(),
        this.vectorLayer,
      ],
      view: this.defaultView(),
      controls: defaultControls().extend([this.scaleLineControl]),
    });

    this.joinChannel();
    this.payloadChannel$ = this.socket.payload$;
  }

  joinChannel() {
    //return this.supabase.listenToChannel('MAP');
  }

  setupMap() {
    this.map;
  }

  initializeMap(
    layers: BaseLayer[] | Collection<BaseLayer> | LayerGroup,
  ): olMap {
    return new olMap({
      layers,
      view: this.defaultView(),
    });
  }

  initDefault() {
    this.highlightStyle = new Style({
      image: new CircleStyle({
        radius: 30,
        stroke: new Stroke({
          color: 'red',
          width: 2,
        }),
        fill: new Fill({
          color: 'rgba(255, 0, 0, 0)',
        }),
      }),
    });

    this.pointStyle = new Style({
      image: new CircleStyle({
        radius: 10,
        fill: new Fill({
          color: '#045E2B',
        }),
        stroke: new Stroke({
          color: '#F1FAFF',
          width: 1,
        }),
      }),
    });

    this.alertStyle = new Style({
      image: new Icon({
        anchor: [0.5, 0],
        src: `assets/images/bigdot-red.svg`,
        width: Constant.DEFAULT.MAP.ICON_SIZE.DOT.WIDTH,
        height: Constant.DEFAULT.MAP.ICON_SIZE.DOT.HEIGHT,
      }),
    });
  }

  // getRadius(articleCount: number): number {
  //   const baseRadius = 10; // Base radius
  //   const step = 10000; // Step size for each range
  //   const factor = Math.ceil(articleCount / step); // Calculate the factor
  //   return baseRadius + 5 * factor;
  // }
  //
  // clearStyle(totalCount: number): Style {
  //   const radius = this.getRadius(totalCount);
  //   let style: Style = this.clearStyleCache[radius];
  //   if (!style) {
  //     style = new Style({
  //       image: new CircleStyle({
  //         radius: radius,
  //         fill: new Fill({
  //           color: 'rgba(255, 153, 0, 0.4)',
  //         }),
  //         stroke: new Stroke({
  //           color: 'rgba(255, 204, 0, 0.2)',
  //           width: 1,
  //         }),
  //       }),
  //     });
  //     this.clearStyleCache[radius] = style;
  //   }
  //   return style;
  // }
  //
  // blurStyle(totalCount: number): Style {
  //   const radius = this.getRadius(totalCount);
  //   let style: Style = this.blurStyleCache[radius];
  //   if (!style) {
  //     style = new Style({
  //       image: new CircleStyle({
  //         radius: radius,
  //         fill: new Fill({
  //           color: 'rgba(255, 153, 0, 0.35)',
  //         }),
  //         stroke: new Stroke({
  //           color: 'rgba(255, 204, 0, 0.1)',
  //           width: 1,
  //         }),
  //       }),
  //     });
  //     this.blurStyleCache[radius] = style;
  //   }
  //   return style;
  // }
  //
  // blinkFeature(feature: Feature, interval: number) {
  //   let isClear = true;
  //   const self = this;
  //   setInterval(function () {
  //     isClear = !isClear;
  //     feature.setStyle(
  //       isClear
  //         ? self.clearStyle(feature.get('totalCount'))
  //         : self.blurStyle(feature.get('totalCount')),
  //     );
  //   }, interval);
  // }

  clearSources() {
    this.sourceList.forEach((source) => source.clear());
  }

  importBaseLayers() {
    this.baseLayers.set(LayerIds.VIETNAM_MOSAIC, layersConfig.VIETNAM_MOSAIC);
    // this.baseLayers.set(LayerIds.MILITARY_1, layersConfig.MILITARY_MAP_1M);
    // this.baseLayers.set(LayerIds.MILITARY_2, layersConfig.MILITARY_MAP_250);
    // this.baseLayers.set(LayerIds.MILITARY_3, layersConfig.MILITARY_MAP_100);
  }

  importNetworkSystemLayers() {
    const coreSource = new VectorSource();
    const boundarySource = new VectorSource();
    const accessSource = new VectorSource();

    this.sourceList.set(LayerIds.CORE, coreSource);
    this.sourceList.set(LayerIds.BOUNDARY, boundarySource);
    this.sourceList.set(LayerIds.ACCESS, accessSource);

    const coreLayer = new VectorLayer({
      source: coreSource,
      visible: true,
    });
    const boundaryLayer = new VectorLayer({
      source: boundarySource,
      visible: false,
    });
    const accessLayer = new VectorLayer({
      source: accessSource,
      visible: false,
    });

    this.networkSystemLayers.set(LayerIds.CORE, coreLayer);
    this.networkSystemLayers.set(LayerIds.BOUNDARY, boundaryLayer);
    this.networkSystemLayers.set(LayerIds.ACCESS, accessLayer);
  }

  generateRouterLayers() {
    this.unitSource = new VectorSource();
    this.tcttSource = new VectorSource();
    this.clusterSource = new Cluster({
      distance: 40,
      minDistance: 20,
      source: this.tcttSource,
    });

    this.unitLayer = new VectorLayer({
      source: this.unitSource,
      visible: true,
    });
    this.tcttLayer = new VectorLayer({
      source: this.tcttSource,
      visible: true,
    });

    this._map.addLayer(this.unitLayer);
    this._map.addLayer(this.tcttLayer);
  }

  generateAlertLayers() {
    this.alertSource = new VectorSource();

    const alertLayer = new VectorLayer({
      source: this.alertSource,
      visible: true,
    });

    this._map.addLayer(alertLayer);
  }

  loadFeatureByLayerType(layerType: RouterLayerType, id: string = '') {
    switch (layerType) {
      case 'boundary':
        return this.supabase.getBoundaryLayerByCore(id);
      case 'access':
        return this.supabase.getAccessLayerByBoundary(id);
      default:
        return this.supabase.getCoreLayer();
    }
  }

  loadUnits(unitTreeFilter: UnitTreeFilter): Promise<UnitTree> {
    return this.supabase.getUnitTree(unitTreeFilter);
  }

  saveState(
    layer: RouterLayerType,
    id: string,
    layerData: DeviceStats[],
  ): void {
    this.historyStack.push({ layer, id, layerData });
  }

  loadPreviousState(): {
    layer: RouterLayerType;
    layerData: DeviceStats[];
  } | null {
    if (this.historyStack.length > 0) {
      const previousState = this.historyStack.pop();
      return previousState || null;
    }
    return null;
  }

  displayUnitFeatures(
    layerData: UnitTree[],
    source: VectorSource,
    style?: Style,
  ): void {
    source.clear();
    layerData.forEach((item) => {
      const feature = this.generateFeature([item.long, item.lat]);
      feature.set('id', item.path);
      feature.set('name', item.name);
      feature.setStyle(this.currentStyle);
      source.addFeature(feature);
    });
  }

  displayAlertFeatures(layerData: UnitTree[], style?: Style): void {
    this.alertSource.clear();
    layerData.forEach((item) => {
      const feature = this.generateFeature([item.long, item.lat]);
      feature.setStyle(style ?? this.alertStyle);
      this.alertSource.addFeature(feature);
    });
  }

  displayRouterFeatures(
    layerData: DeviceStats[],
    source: VectorSource,
    layer: VectorLayer<VectorSource>,
  ): void {
    source.clear();
    layerData.forEach((item) => {
      const feature = this.generateFeature([item.long, item.lat]);
      feature.set('id', item.id);
      feature.set('name', item.name);
      feature.set('count', item.count);
      feature.setStyle(this.currentStyle);
      source.addFeature(feature);
    });

    this.coreLayer.setVisible(layer === this.coreLayer);
    this.boundaryLayer.setVisible(layer === this.boundaryLayer);
    this.accessLayer.setVisible(layer === this.accessLayer);
  }

  generateFeatureStyle(type?: SocketEventType) {
    let urlIcon;
    switch (type) {
      case 'ROUTER':
        urlIcon = Constant.DEFAULT.ICON.ROUTER;
        break;
      case 'SWITCH':
        urlIcon = Constant.DEFAULT.ICON.SWITCH;
        break;
      case 'FIREWALL':
        urlIcon = Constant.DEFAULT.ICON.FIREWALL;
        break;
      default:
        urlIcon = Constant.DEFAULT.ICON.ROUTER;
        break;
    }
    this.currentStyle = this.generateIconStyle(
      this.generateIcon(urlIcon, 0.5, 0.5, 30, 30),
    );
  }

  defaultView(): View {
    return new View({
      center: Constant.DEFAULT_VIEW.CENTER,
      zoom: Constant.DEFAULT_VIEW.ZOOM,
      minZoom: Constant.DEFAULT_VIEW.MIN_ZOOM,
      maxZoom: Constant.DEFAULT_VIEW.MAX_ZOOM,
    });
  }

  setView(center: Coordinate, zoom: number): void {
    this._map.getView().setCenter(fromLonLat(center));
    this._map.getView().setZoom(zoom);
  }

  switchLayerVisibility(type: LayerTypes, id: number): void {
    switch (type) {
      case 'network':
        this.networkSystemLayers.forEach((value, key) => {
          value.setVisible(key === id);
        });
        break;
      case 'cable':
        this.cableLayers.forEach((value, key) => {
          value.setVisible(key === id);
        });
        break;
      default:
        this.baseLayers.forEach((value, key) => {
          value.setVisible(key === id);
        });
        break;
    }
  }

  updateLayerVisibility(): void {
    const view = this._map.getView();
    const resolution = view.getResolution();
    const zoom = view.getZoom();

    if (!zoom || !resolution) return;
    if (zoom >= 7 && zoom < 9) {
      this.switchLayerVisibility('base', LayerIds.MILITARY_1);
      this.switchLayerVisibility('network', LayerIds.CORE);
    } else if (zoom >= 9 && zoom < 11) {
      this.switchLayerVisibility('base', LayerIds.MILITARY_2);
      this.switchLayerVisibility('network', LayerIds.BOUNDARY);
    } else if (zoom >= 11) {
      this.switchLayerVisibility('base', LayerIds.MILITARY_3);
      this.switchLayerVisibility('network', LayerIds.ACCESS);
    }
  }

  generateIconStyle(icon: Icon) {
    return new Style({
      image: icon,
    });
  }

  generateIcon(
    src: string,
    rotationX: number = 0,
    rotationY: number = 0,
    width: number = Constant.DEFAULT.MAP.ICON_SIZE.FLAG.WIDTH,
    height: number = Constant.DEFAULT.MAP.ICON_SIZE.FLAG.HEIGHT,
  ): Icon {
    return new Icon({
      anchor: [rotationX, rotationY],
      anchorYUnits: 'fraction',
      anchorXUnits: 'fraction',
      width: width,
      height: height,
      src: src,
    });
  }

  generateFeature(coordinate: Coordinate) {
    const sourceProjection = Constant.MAP_MATERIAL.COORDINATE_SYSTEM.WGS84;
    const destProjection = Constant.MAP_MATERIAL.COORDINATE_SYSTEM.WEB_MERCATOR;
    return new Feature({
      geometry: new Point(
        transform(coordinate, sourceProjection, destProjection),
      ),
    });
  }

  displayFeatures(device: DeviceStats[], layerIdName: string): void {
    if (device && device.length > 0) {
      this.vectorSource.clear();
    } else return;
    device.forEach((device) => {
      const feature = this.generateFeature([device.long, device.lat]);
      feature.set('id', device.id);
      feature.set('name', device.name);
      feature.set('count', device.count);
      feature.set(layerIdName, device.id);
      feature.setStyle(this.currentStyle);
      this.vectorSource.addFeature(feature);
    });
  }

  showTooltipWhenHover(infoTagId: string = 'info'): void {
    const self = this;
    const info = document.getElementById(infoTagId);
    if (!info) return;
    info.style.pointerEvents = 'none';
    const tooltip = new Tooltip(info, {
      animation: false,
      customClass: 'pe-none',
      offset: [0, 5],
      title: '-',
      trigger: 'manual',
      html: true,
    });

    tooltip.setContent({
      '.tooltip-inner': 'another title',
    });
    this._map.on('pointermove', function (evt) {
      if (evt.dragging) {
        tooltip.hide();
        self.currentFeature = undefined;
        return;
      }
      const pixel = evt.map.getEventPixel(evt.originalEvent);
      self.displayFeatureInfo(info, tooltip, pixel, evt.originalEvent.target);
    });

    // const overlay = new Overlay({
    //   element: info,
    //   offset: [10, 0],
    //   positioning: 'bottom-left',
    // });
    // this.map.addOverlay(overlay);
    // this.map.on('pointermove', function (evt) {
    //   const feature = self.map.forEachFeatureAtPixel(
    //     evt.pixel,
    //     function (feature) {
    //       return feature;
    //     },
    //   );
    //
    //   if (feature) {
    //     const coordinates = evt.coordinate;
    //     overlay.setPosition(coordinates);
    //     let content = `<strong>${feature.get('Name')}</strong><br/>`;
    //     content += `Attribute 1: ${feature.get('Attribute1')}<br/>`;
    //     content += `Attribute 2: ${feature.get('Attribute2')}<br/>`;
    //     content += `Attribute 3: ${feature.get('Attribute3')}`;
    //     info.innerHTML = content;
    //     info.style.visibility = 'visible';
    //   } else {
    //     info.style.visibility = 'hidden';
    //   }
    // });
  }

  displayFeatureInfo(
    element: HTMLElement,
    tooltip: Tooltip,
    pixel: Pixel,
    target: any,
  ) {
    const feature = target.closest('.ol-control')
      ? undefined
      : this._map.forEachFeatureAtPixel(pixel, function (feature) {
          return feature;
        });
    if (feature) {
      element.style.left = pixel[0] + 'px';
      element.style.top = pixel[1] + 'px';

      let content = `<strong>${feature.get('name')}</strong><br/>`;
      // content += `Thuộc tính 1<br/>`;
      // content += `Thuộc tính 2<br/>`;
      // content += `Thuộc tính 3`;
      // const content = count ? `${name}: ${count}` : `${name}`;
      if (feature !== this.currentFeature) {
        tooltip.setContent({
          '.tooltip-inner': content,
        });
      }
      if (this.currentFeature) {
        tooltip.update();
      } else {
        tooltip.show();
      }
    } else {
      tooltip.hide();
    }
    this.currentFeature = feature as Feature;
  }

  addInteraction(interaction: Interaction) {
    this._map.addInteraction(interaction);
  }

  applyHighlight(feature: Feature): void {
    if (this.highlightFeature) {
      this.removeHighlight(this.highlightFeature);
    }
    this.highlightFeature = feature;

    const originalStyle = this.currentStyle;
    const highlightStyle = this.highlightStyle;

    feature.setStyle([originalStyle, highlightStyle]);
  }

  removeHighlight(feature: Feature): void {
    feature.setStyle(feature.getStyle());
    this.highlightFeature = null;
  }

  getUnitTree(unitTreeFilter: UnitTreeFilter): Promise<any> {
    return this.supabase.getUnitTree(unitTreeFilter);
  }

  countDeviceByUnitFrom(path: string): Promise<any> {
    return this.supabase
      .countDeviceByUnitFrom(path)
      .then((data: DeviceCountDto[]) => {
        return data.map((item: DeviceCountDto) => new DeviceCount(item));
      });
  }

  countSecurityEventByUnitFrom(
    path: string = '',
    dateFrom?: Date,
    dateTo?: Date,
  ): Promise<SecurityEvent[]> {
    dateFrom = dateFrom || new Date();
    dateTo = dateTo || new Date();
    return this.supabase
      .countSecurityEventByUnitFrom(
        path,
        formatDate(dateFrom),
        formatDate(dateTo),
      )
      .then((data: SecurityEventCountDto[]) => {
        return data.map((item: SecurityEventCountDto): SecurityEvent => {
          return {
            unitPath: item.unit_path,
            type: item.type,
            count: item.count,
          };
        });
      });
  }

  getTCTTTargetsByType(type: TCTTTargetType) {
    return this.supabase.getTCTTTargetsByType(type);
  }

  getBCTTRouter(): Promise<BCTTRouter[] | undefined> {
    return this.supabase.getAllBCTTRouter().then((data) => {
      return data?.map((item) => {
        const uparentpath = item.upath
          ? item.upath.split('.').slice(0, 3).join('.')
          : null;
        return { ...item, uparentpath };
      });
    });
  }

  ///////////////////////
  // TEST
  ///////////////////////

  displayNetworkSystemFeatures(
    layerData: DeviceStats[],
    source: VectorSource,
    layerType: string,
  ): void {
    source.clear();
    layerData.forEach((item) => {
      const feature = this.generateFeature([item.long, item.lat]);
      feature.set('id', item.id);
      feature.set('name', item.name);
      feature.set('unitPath', item.unitPath);
      feature.set('layer', layerType);
      feature.setStyle(this.currentStyle);
      source.addFeature(feature);
    });
  }
}
