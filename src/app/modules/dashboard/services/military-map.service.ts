import { inject, Injectable } from '@angular/core';
import { Feature, Map as MapOl, Map as olMap, Overlay } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import {
  AlertType,
  LayerIds,
  MapDeviceCount,
  MapSubType,
  REGION,
} from '../models/btth.interface';
import { Coordinate } from 'ol/coordinate';
import { Style } from 'ol/style';
import { DeviceStats } from '../models/geographical-coordinates';
import {
  checkZoomAndAdjust,
  defaultView,
  generateFeature,
  generateFeatureStyle,
  generateIcon,
  generateIconStyle,
  getLayerName,
  isValidCoordinate,
  scaleLineControl,
  transparentStyle,
} from '../utils/map-utils';
import { layersConfig } from '../utils/geo-layers';
import { defaults as defaultControls } from 'ol/control/defaults';
import { Constant } from '../../../core/config/constant';
import { BehaviorSubject, combineLatest, Observable, tap } from 'rxjs';
import { MultiPolygon, Point, SimpleGeometry } from 'ol/geom';
import { WebGLPoints } from 'ol/layer';
import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import { boundingExtent, getCenter } from 'ol/extent';
import { Select } from 'ol/interaction';
import { pointerMove } from 'ol/events/condition';
import { transformExtent } from 'ol/proj';
import { Store } from '@ngrx/store';
import {
  selectAccessLayers,
  selectAccessLayersMap,
  selectBoundaryLayers,
  selectBoundaryLayersMap,
  selectCoreLayers,
  selectCoreLayersMap,
} from '../../../store/map-interaction/network-system/network-system.selectors';
import { map } from 'rxjs/operators';
import { getPathParentFromLTree } from '../../../_metronic/layout/core/common/common-utils';
import * as MapStoreSelectos from '../../../store/map-interaction/map-store/map-store.selectors';

export interface EventStream {
  id?: string;
  alertType?: AlertType;
  isFilter?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MilitaryMapService {
  map: olMap;
  defaultStyle: Style;
  currentFeature: Feature | null = null;
  highlightFeature: Feature | null = null;
  styleCaches: Map<string | number, Style> = new Map<string | number, Style>();
  networkSystemNodes: Map<string, Feature> = new Map();
  alertISNodes: Map<string, Feature> = new Map();
  alertNINodes: Map<string, Feature> = new Map();
  zoomLevel = Constant.DEFAULT.MAP.ZOOM_LEVEL;
  colors = Constant.DEFAULT.COLORS;
  defaultEventStream: EventStream = {
    alertType: AlertType.ALL,
    isFilter: false,
  };

  private tooltipOverlay: Overlay;

  private eventStream = new BehaviorSubject<EventStream>(
    this.defaultEventStream,
  );
  currentEvent$ = this.eventStream.asObservable();

  updateEvent(data: EventStream) {
    const eventStream = {
      ...this.eventStream.value,
      ...data,
    };
    this.eventStream.next(eventStream);
  }

  clearEventStream(): void {
    this.eventStream.next(this.defaultEventStream);
  }

  networkSystemLayers: Map<number, VectorLayer<VectorSource>> = new Map<
    number,
    VectorLayer<VectorSource>
  >();

  private baseLayers: Map<number, TileLayer<TileWMS>> = new Map<
    number,
    TileLayer<TileWMS>
  >();

  alertISLayers: Map<number, WebGLPointsLayer<VectorSource<Point>>> = new Map<
    number,
    WebGLPointsLayer<VectorSource<Point>>
  >();

  alertNILayers: Map<number, WebGLPointsLayer<VectorSource<Point>>> = new Map<
    number,
    WebGLPointsLayer<VectorSource<Point>>
  >();

  militaryLayers: Map<number, TileLayer<any>> = new Map<
    number,
    TileLayer<any>
  >();
  administrationLayers: Map<number, TileLayer<any>> = new Map<
    number,
    TileLayer<any>
  >();
  internetLayers: Map<number, TileLayer<any>> = new Map<
    number,
    TileLayer<any>
  >();

  sourceList: Map<number, VectorSource> = new Map<number, VectorSource>();

  infoLayer: TileLayer<any>;

  highlightSource = new VectorSource();
  highlightLayer = new VectorLayer({
    source: this.highlightSource,
    style: {
      'stroke-color': 'rgba(203,100,255,0.5)',
      'stroke-width': 10,
      'fill-color': 'rgba(203,100,255, 0.25)',
      'circle-radius': 6,
      'circle-fill-color': 'rgba(203,100,255, 0.5)',
    },
  });

  private store = inject(Store);

  constructor() {}

  initialMap() {
    this.setupBaseLayers();
    this.setupMilitaryLayers();
    this.setupAdministrationLayers();
    this.setupInternetLayers();

    this.setupNetworkLayers();
    this.setupAlertISLayers();
    this.setupAlertNILayers();

    this.infoLayer = layersConfig.INFO_LAYER;
    this.defaultStyle = generateFeatureStyle('ROUTER');
    this.map = new olMap({
      layers: [
        ...this.baseLayers.values(),
        ...this.militaryLayers.values(),
        ...this.administrationLayers.values(),
        ...this.internetLayers.values(),
        ...this.alertNILayers.values(),
        ...this.alertISLayers.values(),
        ...this.networkSystemLayers.values(),
        // this.infoLayer,
        this.highlightLayer,
      ],
      view: defaultView(),
      controls: defaultControls().extend([scaleLineControl]),
    });

    this.animateLayers();
  }

  createAlertStyle(type: AlertType) {
    return type === AlertType.NETWORK
      ? ['color', ...this.colors.ALERTS.NETWORK] // Màu vàng
      : ['color', ...this.colors.ALERTS.INFO_SEC]; // Màu đỏ
    // return type === AlertType.NETWORK
    //   ? ['color', 255, 0, 0, 1]
    //   : ['color', 255, 255, 0, 1];
  }

  createWebGLLayer(
    alertType: AlertType,
    minZoom: number,
    maxZoom: number,
  ): WebGLPoints<any> {
    return new WebGLPoints({
      source: new VectorSource<Point>(),
      style: {
        variables: {
          time: 0,
        },
        symbol: {
          symbolType: 'circle',
          size: ['+', 40, ['*', ['var', 'time'], 120]],
          color: this.createAlertStyle(alertType),
          offset: [0, 0],
          opacity: ['-', 1, ['var', 'time']],
          rotateWithView: false,
        },
      },
      minZoom,
      maxZoom,
    });
  }

  animateLayers(): void {
    const animate = () => {
      const time = (Date.now() % 2000) / 2000;
      if (!isFinite(time)) {
        console.error('Non-finite time value:', time);
        return;
      }
      this.alertISLayers.forEach((layer) => {
        layer.updateStyleVariables({ time });
      });
      this.alertNILayers.forEach((layer) => {
        layer.updateStyleVariables({ time });
      });
      this.map.render();
      requestAnimationFrame(animate);
    };
    animate();
  }

  initializeSource(layerId: LayerIds) {
    const source = new VectorSource();
    this.sourceList.set(layerId, source);
    return source;
  }

  createLayer(
    source: VectorSource,
    isVisible: boolean = false,
    minZoom: number,
    maxZoom: number,
  ) {
    return new VectorLayer({
      source: source,
      visible: isVisible,
      minZoom,
      maxZoom,
    });
  }

  registerLayer(
    layerMap: Map<any, any>,
    layerId: LayerIds,
    layer: VectorLayer<any> | TileLayer<any> | WebGLPointsLayer<any>,
  ) {
    layerMap.set(layerId, layer);
    layer.set('id', layerId);
    layer.set('name', getLayerName(layerId));
  }

  setupBaseLayers() {
    this.registerLayer(
      this.baseLayers,
      LayerIds.VIETNAM_MOSAIC,
      layersConfig.VIETNAM_MOSAIC,
    );
  }

  // Setup Military Layers
  setupMilitaryLayers() {
    this.registerLayer(
      this.militaryLayers,
      LayerIds.MILITARY_REGION,
      layersConfig.MILITARY_REGION,
    );
    this.registerLayer(
      this.militaryLayers,
      LayerIds.BACKBONE_NODES,
      layersConfig.BACKBONE_NODES,
    );
    this.registerLayer(
      this.militaryLayers,
      LayerIds.QA_ROUTE,
      layersConfig.CABLE_QA,
    );
    this.registerLayer(
      this.militaryLayers,
      LayerIds.QB_ROUTE,
      layersConfig.CABLE_QB,
    );
    this.registerLayer(
      this.militaryLayers,
      LayerIds.QC_ROUTE,
      layersConfig.CABLE_QC,
    );
    this.registerLayer(
      this.militaryLayers,
      LayerIds.MILITARY_BRANCH_LINE,
      layersConfig.MILITARY_BRANCH_LINE,
    );
  }

  // Setup Administration Layers
  setupAdministrationLayers() {
    this.registerLayer(
      this.administrationLayers,
      LayerIds.COMMUNE,
      layersConfig.COMMUNE,
    );
    this.registerLayer(
      this.administrationLayers,
      LayerIds.DISTRICT,
      layersConfig.DISTRICT,
    );
    this.registerLayer(
      this.administrationLayers,
      LayerIds.PROVINCE,
      layersConfig.PROVINCE,
    );
    this.registerLayer(
      this.administrationLayers,
      LayerIds.NATION,
      layersConfig.NATION,
    );
  }

  // Setup Internet Layers
  setupInternetLayers() {
    this.registerLayer(
      this.internetLayers,
      LayerIds.SEA_CABLE,
      layersConfig.SEA_CABLE,
    );
    // this.registerLayer(
    //   this.internetLayers,
    //   LayerIds.AAE_CABLE,
    //   layersConfig.AAE_CABLE,
    // );
    // this.registerLayer(
    //   this.internetLayers,
    //   LayerIds.AAG_CABLE,
    //   layersConfig.AAG_CABLE,
    // );
    // this.registerLayer(
    //   this.internetLayers,
    //   LayerIds.ADC_CABLE,
    //   layersConfig.ADC_CABLE,
    // );
    // this.registerLayer(
    //   this.internetLayers,
    //   LayerIds.APG_CABLE,
    //   layersConfig.APG_CABLE,
    // );
    // this.registerLayer(
    //   this.internetLayers,
    //   LayerIds.SJC2_CABLE,
    //   layersConfig.SJC2_CABLE,
    // );
    // this.registerLayer(
    //   this.internetLayers,
    //   LayerIds.SMW3_CABLE,
    //   layersConfig.SMW3_CABLE,
    // );
    // this.registerLayer(
    //   this.internetLayers,
    //   LayerIds.TGN_CABLE,
    //   layersConfig.TGN_CABLE,
    // );
    this.registerLayer(
      this.internetLayers,
      LayerIds.AGGREGATION_ROUTES,
      layersConfig.AGGREGATION_ROUTES,
    );
    // this.registerLayer(
    //   this.internetLayers,
    //   LayerIds.CABLE_LANDING_STATIONS,
    //   layersConfig.CABLE_LANDING_STATIONS,
    // );
    this.registerLayer(
      this.internetLayers,
      LayerIds.FIBER_CABLE_TO_CHINA,
      layersConfig.FIBER_CABLE_TO_CHINA,
    );
    this.registerLayer(
      this.internetLayers,
      LayerIds.FIBER_CABLE_TO_CAMPUCHIA,
      layersConfig.FIBER_CABLE_TO_CAMPUCHIA,
    );
    this.registerLayer(
      this.internetLayers,
      LayerIds.FIBER_CABLE_TO_LAOS,
      layersConfig.FIBER_CABLE_TO_LAOS,
    );
  }

  setupNetworkLayers() {
    const coreSource = this.initializeSource(LayerIds.CORE);
    const boundarySource = this.initializeSource(LayerIds.BOUNDARY);
    // const accessSource = this.initializeSource(LayerIds.ACCESS);
    const accessLevel3Source = this.initializeSource(LayerIds.ACCESS_LEVEL_3);
    const accessLevel4Source = this.initializeSource(LayerIds.ACCESS_LEVEL_4);
    const accessLevel5Source = this.initializeSource(LayerIds.ACCESS_LEVEL_5);

    const coreLayer = this.createLayer(
      coreSource,
      true,
      this.zoomLevel.CORE.MIN,
      this.zoomLevel.CORE.MAX,
    );
    const boundaryLayer = this.createLayer(
      boundarySource,
      true,
      this.zoomLevel.BOUNDARY.MIN,
      this.zoomLevel.BOUNDARY.MAX,
    );
    // const accessLayer = this.createLayer(accessSource, false);
    const accessLevel3Layer = this.createLayer(
      accessLevel3Source,
      true,
      this.zoomLevel.ACCESS_LEVEL_3.MIN,
      this.zoomLevel.ACCESS_LEVEL_3.MAX,
    );
    const accessLevel4Layer = this.createLayer(
      accessLevel4Source,
      true,
      this.zoomLevel.ACCESS_LEVEL_4.MIN,
      this.zoomLevel.ACCESS_LEVEL_4.MAX,
    );
    const accessLevel5Layer = this.createLayer(
      accessLevel5Source,
      true,
      this.zoomLevel.ACCESS_LEVEL_5.MIN,
      this.zoomLevel.ACCESS_LEVEL_5.MAX,
    );

    this.registerLayer(this.networkSystemLayers, LayerIds.CORE, coreLayer);
    this.registerLayer(
      this.networkSystemLayers,
      LayerIds.BOUNDARY,
      boundaryLayer,
    );
    // this.registerLayer(this.networkSystemLayers, LayerIds.ACCESS, accessLayer);
    this.registerLayer(
      this.networkSystemLayers,
      LayerIds.ACCESS_LEVEL_3,
      accessLevel3Layer,
    );
    this.registerLayer(
      this.networkSystemLayers,
      LayerIds.ACCESS_LEVEL_4,
      accessLevel4Layer,
    );
    this.registerLayer(
      this.networkSystemLayers,
      LayerIds.ACCESS_LEVEL_5,
      accessLevel5Layer,
    );
  }

  setupAlertISLayers() {
    const coreLayer = this.createWebGLLayer(
      AlertType.INFO_SEC,
      this.zoomLevel.CORE.MIN,
      this.zoomLevel.CORE.MAX,
    );
    const boundaryLayer = this.createWebGLLayer(
      AlertType.INFO_SEC,
      this.zoomLevel.BOUNDARY.MIN,
      this.zoomLevel.BOUNDARY.MAX,
    );
    const accessLevel3Layer = this.createWebGLLayer(
      AlertType.INFO_SEC,
      this.zoomLevel.ACCESS_LEVEL_3.MIN,
      this.zoomLevel.ACCESS_LEVEL_3.MAX,
    );
    const accessLevel4Layer = this.createWebGLLayer(
      AlertType.INFO_SEC,
      this.zoomLevel.ACCESS_LEVEL_4.MIN,
      this.zoomLevel.ACCESS_LEVEL_4.MAX,
    );
    const accessLevel5Layer = this.createWebGLLayer(
      AlertType.INFO_SEC,
      this.zoomLevel.ACCESS_LEVEL_5.MIN,
      this.zoomLevel.ACCESS_LEVEL_5.MAX,
    );

    this.registerLayer(this.alertISLayers, LayerIds.IS_ALERT_CORE, coreLayer);
    this.registerLayer(
      this.alertISLayers,
      LayerIds.IS_ALERT_BOUNDARY,
      boundaryLayer,
    );
    this.registerLayer(
      this.alertISLayers,
      LayerIds.IS_ALERT_ACCESS_LEVEL_3,
      accessLevel3Layer,
    );
    this.registerLayer(
      this.alertISLayers,
      LayerIds.IS_ALERT_ACCESS_LEVEL_4,
      accessLevel4Layer,
    );
    this.registerLayer(
      this.alertISLayers,
      LayerIds.IS_ALERT_ACCESS_LEVEL_5,
      accessLevel5Layer,
    );
  }

  setupAlertNILayers() {
    const coreLayer = this.createWebGLLayer(
      AlertType.NETWORK,
      this.zoomLevel.CORE.MIN,
      this.zoomLevel.CORE.MAX,
    );
    const boundaryLayer = this.createWebGLLayer(
      AlertType.NETWORK,
      this.zoomLevel.BOUNDARY.MIN,
      this.zoomLevel.BOUNDARY.MAX,
    );
    const accessLevel3Layer = this.createWebGLLayer(
      AlertType.NETWORK,
      this.zoomLevel.ACCESS_LEVEL_3.MIN,
      this.zoomLevel.ACCESS_LEVEL_3.MAX,
    );
    const accessLevel4Layer = this.createWebGLLayer(
      AlertType.NETWORK,
      this.zoomLevel.ACCESS_LEVEL_4.MIN,
      this.zoomLevel.ACCESS_LEVEL_4.MAX,
    );
    const accessLevel5Layer = this.createWebGLLayer(
      AlertType.NETWORK,
      this.zoomLevel.ACCESS_LEVEL_5.MIN,
      this.zoomLevel.ACCESS_LEVEL_5.MAX,
    );

    this.registerLayer(this.alertNILayers, LayerIds.NI_ALERT_CORE, coreLayer);
    this.registerLayer(
      this.alertNILayers,
      LayerIds.NI_ALERT_BOUNDARY,
      boundaryLayer,
    );
    this.registerLayer(
      this.alertNILayers,
      LayerIds.NI_ALERT_ACCESS_LEVEL_3,
      accessLevel3Layer,
    );
    this.registerLayer(
      this.alertNILayers,
      LayerIds.NI_ALERT_ACCESS_LEVEL_4,
      accessLevel4Layer,
    );
    this.registerLayer(
      this.alertNILayers,
      LayerIds.NI_ALERT_ACCESS_LEVEL_5,
      accessLevel5Layer,
    );
  }

  destroyMap() {
    this.sourceList.forEach((source) => {
      source.clear();
    });
    this.map.setTarget(undefined);
    this.map.dispose();
  }

  extractUniqueCoordinates(
    alerts: any[],
    map: Map<string, any>,
    layerId: LayerIds,
    getKey: (alert: any) => string | undefined,
  ): { id: string; coordinate: Coordinate }[] {
    const featureInfos = alerts
      .map((alert) => {
        const key = getKey(alert);
        if (key) {
          const item = map.get(key);
          const coordinate = item
            ? ([item.longitude!, item.latitude!] as Coordinate)
            : null;
          // let featureId;
          // switch (layerId) {
          //   case LayerIds.CORE:
          //     featureId = setupIdForNetworkNodes(key);
          //     break;
          //   case LayerIds.BOUNDARY:
          //     featureId = setupIdForNetworkNodes(key, false);
          //     break;
          //   default:
          //     featureId = key;
          //     break;
          // }
          const featureId = key;
          return {
            coordinate,
            id: featureId,
          };
        }
        return null;
      })
      .filter(
        (featureInfo) =>
          featureInfo !== null && featureInfo.coordinate !== null,
      );

    return Array.from(
      new Set(featureInfos.map((info) => JSON.stringify(info))),
    ).map((info) => JSON.parse(info));
  }

  renderAlertFeaturesOnMap(
    alertType: AlertType,
    infos: { id: string; coordinate: Coordinate }[],
    layerId: LayerIds,
  ): void {
    const source =
      alertType === AlertType.INFO_SEC
        ? this.alertISLayers.get(layerId)?.getSource()
        : this.alertNILayers.get(layerId)?.getSource();

    source?.clear(); // Clear existing features before adding new ones
    if (infos.length === 0) return;

    const featureMap =
      alertType === AlertType.INFO_SEC ? this.alertISNodes : this.alertNINodes;

    infos.forEach((info, index) => {
      const feature = generateFeature(info.coordinate);
      feature.set('id', `feature-${index}`);
      feature.set('alertType', alertType);
      feature.setId(info.id);
      source?.addFeature(feature);
      feature.setStyle(transparentStyle);
      featureMap.set(info.id, feature);
      // featureMap.set(`feature-${index}`, feature);
    });
  }

  setFlagAlertToNetworkSystemNodes(
    alertIds: string[],
    alertType: AlertType,
  ): void {
    const alertKey =
      alertType === AlertType.NETWORK
        ? Constant.DEFAULT.MAP.PROPERTIES.NETWORK
        : Constant.DEFAULT.MAP.PROPERTIES.INFO_SEC;

    this.networkSystemNodes.forEach((node) => {
      const featureId = node.getId() as string;
      if (featureId) {
        node.set(alertKey, alertIds.includes(featureId));
      }
    });
  }

  displayNetworkSystemFeatures(
    layerData: DeviceStats[],
    layerId: LayerIds,
  ): void {
    const source = this.networkSystemLayers.get(layerId)?.getSource();
    source?.clear();

    const hasIcon =
      layerId === LayerIds.ACCESS_LEVEL_3 ||
      layerId === LayerIds.ACCESS_LEVEL_4 ||
      layerId === LayerIds.ACCESS_LEVEL_5;

    // Initialize features and cache them for updates
    const featureMap = new Map<string, Feature>();

    layerData.forEach((item) => {
      const feature = generateFeature([item.long, item.lat]);
      feature.set('id', item.id);
      feature.set('name', item.name);
      feature.set('code', item.code);
      feature.set('foreignId', item.foreignId);
      feature.set('foreignCode', item.foreignCode);
      if (layerId === LayerIds.BOUNDARY) {
        feature.set('device', item.device);
        feature.set('wan', item.wan);
        feature.set('wanTn', item.wanTn);
      }
      feature.set('unitPath', item.unitPath);
      feature.set('layerId', layerId);
      feature.set('icon', item.unitIcon);
      feature.set(Constant.DEFAULT.MAP.PROPERTIES.NETWORK, false);
      feature.set(Constant.DEFAULT.MAP.PROPERTIES.INFO_SEC, false);
      feature.setId(item.id);
      source?.addFeature(feature);
      featureMap.set(item.id, feature);
      this.networkSystemNodes.set(item.id, feature);
    });
    // Function to update the style of existing features
    const updateFeatureStyles = (zoom: number) => {
      featureMap.forEach((feature, id) => {
        const item = layerData.find((data) => data.id === id);
        if (!item) return;

        let style = generateFeatureStyle('ROUTER', zoom, item.name);
        if (hasIcon && item.unitIcon) {
          // Use fractional anchor and scaling
          style = generateIconStyle(
            generateIcon(
              item.unitIcon,
              0.5, // Center horizontally
              1, // Bottom align
              Constant.DEFAULT.MAP.ICON_SIZE.FLAG.WIDTH,
              Constant.DEFAULT.MAP.ICON_SIZE.FLAG.HEIGHT,
              zoom, // Pass current zoom level
            ),
          );
        }
        this.styleCaches.set(item.id, style);
        feature.setStyle(style);
      });
    };

    // Initial style setup
    const initialZoom = this.map.getView().getZoom() || 1;
    updateFeatureStyles(initialZoom);
  }

  zoomToFeatureById(map: MapOl, featureId: string) {
    const feature = this.networkSystemNodes.get(featureId);
    if (feature) {
      const layerId = feature.get('layerId');

      const geometry = feature.getGeometry();
      const view = map.getView();
      const zoom =
        layerId === LayerIds.CORE
          ? Constant.DEFAULT_VIEW.ZOOM
          : map.getView().getZoom();

      // Zoom vào coordinate của feature
      if (
        !isValidCoordinate((geometry as SimpleGeometry).getFlatCoordinates()) ||
        !view ||
        !zoom
      )
        return; //FIXME: Nếu feature chưa có toạ độ
      map.getView().animate({
        center: (geometry as SimpleGeometry).getFlatCoordinates(),
        zoom: checkZoomAndAdjust(zoom, layerId),
        duration: 1800,
      });
    }
  }

  zoomToFeatureByExtent(
    map: MapOl,
    coordinates: Coordinate[],
    zoomLevel: number,
  ) {
    const extent = boundingExtent(coordinates);
    map.getView().fit(transformExtent(extent, 'EPSG:4326', 'EPSG:3857'), {
      duration: 1500, // Animation duration in milliseconds
      padding: [50, 50, 50, 50], // Padding around the features
      maxZoom: zoomLevel,
    });
  }

  getZoomLevelByLayerId(layerId: LayerIds): number {
    switch (layerId) {
      case LayerIds.CORE:
        return this.zoomLevel.CORE.MIN;
      case LayerIds.BOUNDARY:
        return this.zoomLevel.BOUNDARY.MIN;
      case LayerIds.ACCESS_LEVEL_3:
        return this.zoomLevel.ACCESS_LEVEL_3.MIN;
      case LayerIds.ACCESS_LEVEL_4:
        return this.zoomLevel.ACCESS_LEVEL_4.MIN;
      case LayerIds.ACCESS_LEVEL_5:
        return this.zoomLevel.ACCESS_LEVEL_5.MIN;
      default:
        return this.zoomLevel.CORE.MIN;
    }
  }

  clearSourceAlertLayers() {
    // Clear sources in alertISLayers
    this.alertISLayers.forEach((layer) => {
      const source = layer.getSource() as VectorSource;
      source.clear();
    });

    // Clear sources in alertNILayers
    this.alertNILayers.forEach((layer) => {
      const source = layer.getSource() as VectorSource;
      source.clear();
    });
  }

  clearHighlight() {
    this.highlightSource.clear();
  }

  highlightArea(
    // geocode: string,
    multiPolygonCoords: any,
    // center: Coordinate,
  ): void {
    // Transform polygon coordinates from EPSG:4326 to EPSG:3857
    const multiPolygon = new MultiPolygon(multiPolygonCoords);
    multiPolygon.transform('EPSG:4326', 'EPSG:3857');

    // Create and add a new polygon feature to the highlight source
    const polygonFeature = new Feature({
      geometry: multiPolygon,
    });

    this.clearHighlight();
    this.highlightSource.addFeature(polygonFeature);

    // Transform the center coordinate from EPSG:4326 to EPSG:3857
    // const transformedCenter = transform(center, 'EPSG:4326', 'EPSG:3857');

    // const isDistrict = geocode.includes('.');
    // Animate the view to the center coordinate
    this.map.getView().animate({
      center: getCenter(multiPolygon.getExtent()),
      duration: 2000,
      // zoom: isDistrict
      //   ? this.zoomLevel.ACCESS_LEVEL_4.MIN
      //   : this.zoomLevel.ACCESS_LEVEL_3.MIN,
      zoom: this.zoomLevel.CORE.MAX,
    });
  }

  setAlertVisibility(alertType: AlertType): void {
    if (alertType !== AlertType.NETWORK && alertType !== AlertType.INFO_SEC)
      return;
    // Ẩn tất cả các layers cảnh báo khác không phải alertType
    this.alertISLayers.forEach((layer) => {
      layer.setVisible(alertType === AlertType.INFO_SEC);
    });

    this.alertNILayers.forEach((layer) => {
      layer.setVisible(alertType === AlertType.NETWORK);
    });
  }

  resetNetworkSystemVisibility(): void {
    this.networkSystemLayers.forEach((layer) => layer.setVisible(true));
  }

  resetAlertVisibility(): void {
    // Hiển thị lại tất cả các layers cảnh báo
    this.alertISLayers.forEach((layer) => {
      layer.setVisible(true);
    });

    this.alertNILayers.forEach((layer) => {
      layer.setVisible(true);
    });
  }

  resetNetworkSystemNodesVisibility(): void {
    this.networkSystemNodes.forEach((feature) => {
      const style = feature.getStyle() as Style;
      if (style && style.getImage()) {
        style.getImage().setOpacity(1);
      }
    });
  }

  isolateAndHighlightFeature(featureId: string, alertType: MapSubType): void {
    const feature = this.networkSystemNodes.get(featureId);
    if (!feature) return; // If feature is not found, exit the function

    const layerId = feature.get('layerId');

    // Hide all unrelated layers
    this.networkSystemLayers.forEach((layer, key) => {
      const visible = key === layerId; // Only the layer with the same id as the feature's layer is visible
      layer.setVisible(visible);
      if (visible) {
        // Set opacity of other features in the same layer
        layer
          .getSource()
          ?.getFeatures()
          .forEach((f) => {
            const style = f.getStyle() as Style;
            if (style && style.getImage()) {
              style.getImage().setOpacity(f.getId() !== featureId ? 0 : 1);
            }
          });
      }
    });

    // Handle alert layers based on the alert type and hide other types
    const targetAlertLayers =
      alertType === MapSubType.CYBER_SECURITY_ALERT
        ? this.alertISLayers
        : this.alertNILayers;
    const otherAlertLayers =
      alertType === MapSubType.CYBER_SECURITY_ALERT
        ? this.alertNILayers
        : this.alertISLayers;

    // Hide layers not associated with the current alert type
    otherAlertLayers.forEach((layer) => {
      layer.setVisible(false);
    });

    // Set visibility and opacity for the relevant alert layers
    targetAlertLayers.forEach((layer, key) => {
      const visible = key === layerId;
      layer.setVisible(visible);
      if (visible) {
        // Set opacity of other alert features in the same layer
        layer
          .getSource()
          ?.getFeatures()
          .forEach((f) => {
            const style = f.getStyle() as Style;
            if (style && style.getImage()) {
              style.getImage().setOpacity(f.getId() !== featureId ? 0 : 1);
            }
          });
      }
    });
  }

  createHoverInteraction(
    layers: VectorLayer<any>[],
    updateTooltip: (event: any) => void,
  ): Select {
    const hoverInteraction = new Select({
      condition: pointerMove,
      layers,
      style: null,
      // style: (feature) => {
      //   return this.getDeviceStyle(feature.get('name'));
      // },
    });

    hoverInteraction.on('select', updateTooltip);
    return hoverInteraction;
  }

  getDeviceStyle(name: string) {
    const zoom = this.map.getView().getZoom();
    return generateFeatureStyle('ROUTER', zoom, name);
  }

  showTooltip(overlay: Overlay, feature: Feature, content: string): void {
    const geometry = feature.getGeometry();
    const coordinate = (geometry as Point).getCoordinates();
    const element = overlay.getElement();

    // if (element) {
    //   overlay.setPosition(coordinate);
    //   element.innerHTML = content;
    //   element.style.display = 'block';
    // }
    if (element) {
      overlay.setPosition(coordinate);
    }
  }

  resetAllVisibility(): void {
    this.resetNetworkSystemVisibility();
    this.resetAlertVisibility();
    this.resetNetworkSystemNodesVisibility();
  }

  getCoreLayer(abbr?: REGION): Observable<any> {
    return this.store.select(selectCoreLayers(abbr)).pipe(
      tap((data) => {
        const cores: DeviceStats[] = data.map((item) => ({
          id: item.id,
          name: item.abbr,
          code: item.abbr,
          long: item.longitude,
          lat: item.latitude,
        }));

        this.displayNetworkSystemFeatures(cores, LayerIds.CORE);
      }),
    );
  }

  getBoundaryLayer(coreName?: REGION): Observable<any> {
    return this.store.select(selectBoundaryLayers(coreName)).pipe(
      tap((data) => {
        const boundaries: DeviceStats[] = data.map((item) => ({
          id: item.id,
          name: item.name,
          code: item.abbr,
          foreignId: item.coreId,
          foreignCode: item.coreName,
          device: item.device,
          wan: item.wan,
          wanTn: item.wanTn,
          unitPath: item.path,
          long: item.longitude,
          lat: item.latitude,
        }));

        this.displayNetworkSystemFeatures(boundaries, LayerIds.BOUNDARY);
      }),
    );
  }

  getAccessLayer(coreName?: REGION): Observable<any> {
    return this.store.select(selectAccessLayers(coreName)).pipe(
      map((items) => {
        return items.filter(
          (item) => item.longitude && item.latitude && item.icon,
        );
      }),
      tap((data) => {
        // Group access layers by their path level
        const accessLayersByLevel: { [key: number]: DeviceStats[] } = {};

        data.forEach((item) => {
          if (item.longitude && item.latitude) {
            // Determine the path level (assuming path levels are separated by '.')
            const level = item.path.split('.').length;

            if (!accessLayersByLevel[level]) {
              accessLayersByLevel[level] = [];
            }

            const accessFeature: DeviceStats = {
              id: item.path,
              name: item.name,
              foreignId:
                level === 3
                  ? item.boundaryId
                  : getPathParentFromLTree(item.path),
              unitPath: item.path,
              unitIcon: item.icon,
              code: item.boundaryName,
              foreignCode: item.coreName,
              // code: item.coreName,
              // foreignCode: item.boundaryName,
              long: item.longitude!,
              lat: item.latitude!,
            };

            accessLayersByLevel[level].push(accessFeature);
          }
        });

        // Create and display features for each access level
        Object.keys(accessLayersByLevel).forEach((levelStr) => {
          const level = parseInt(levelStr, 10);
          const accesses = accessLayersByLevel[level];

          // Determine the appropriate layer ID for this level
          const layerId = `ACCESS_LEVEL_${level}` as keyof typeof LayerIds;

          // Display features on the map for this access level
          this.displayNetworkSystemFeatures(accesses, LayerIds[layerId]);
        });
      }),
    );
  }

  fetchAndRenderInfoSecAlerts(core?: REGION): Observable<MapDeviceCount[]> {
    return this.processAndRenderInfoSecAlerts(
      this.store.select(MapStoreSelectos.selectSecurityData),
      core,
    );
  }

  processAndRenderInfoSecAlerts(
    alertData$: Observable<MapDeviceCount[]>,
    core?: REGION,
  ): Observable<MapDeviceCount[]> {
    const coreMap$ = this.store.select(selectCoreLayersMap(core));
    const boundaryMap$ = this.store.select(selectBoundaryLayersMap(core));
    const accessMap$ = this.store.select(selectAccessLayersMap(core));

    return combineLatest([coreMap$, boundaryMap$, accessMap$, alertData$]).pipe(
      map(([coreMap, boundaryMap, accessMap, alerts]) => {
        const filteredAlerts = alerts.filter((item) => item.total > 0);

        const coreInfos = this.extractUniqueCoordinates(
          filteredAlerts,
          coreMap,
          LayerIds.CORE,
          (alert) => alert.id,
        );
        const boundaryInfos = this.extractUniqueCoordinates(
          filteredAlerts,
          boundaryMap,
          LayerIds.BOUNDARY,
          (alert) => alert.id,
        );
        const accessInfosLevel3 = this.extractUniqueCoordinates(
          filteredAlerts,
          accessMap,
          LayerIds.ACCESS_LEVEL_3,
          (alert) => alert.id,
        );

        const accessInfosLevel4 = this.extractUniqueCoordinates(
          filteredAlerts,
          accessMap,
          LayerIds.ACCESS_LEVEL_4,
          (alert) => alert.id,
        );

        const accessInfosLevel5 = this.extractUniqueCoordinates(
          filteredAlerts,
          accessMap,
          LayerIds.ACCESS_LEVEL_5,
          (alert) => alert.id,
        );

        // Render các alert features trên map
        this.renderAlertFeaturesOnMap(
          AlertType.INFO_SEC,
          coreInfos,
          LayerIds.IS_ALERT_CORE,
        );
        this.renderAlertFeaturesOnMap(
          AlertType.INFO_SEC,
          boundaryInfos,
          LayerIds.IS_ALERT_BOUNDARY,
        );
        this.renderAlertFeaturesOnMap(
          AlertType.INFO_SEC,
          accessInfosLevel3,
          LayerIds.IS_ALERT_ACCESS_LEVEL_3,
        );
        this.renderAlertFeaturesOnMap(
          AlertType.INFO_SEC,
          accessInfosLevel4,
          LayerIds.IS_ALERT_ACCESS_LEVEL_4,
        );
        this.renderAlertFeaturesOnMap(
          AlertType.INFO_SEC,
          accessInfosLevel5,
          LayerIds.IS_ALERT_ACCESS_LEVEL_5,
        );

        const allIds = [
          ...coreInfos.map((item) => item.id),
          ...boundaryInfos.map((item) => item.id),
          ...accessInfosLevel3.map((item) => item.id),
          ...accessInfosLevel4.map((item) => item.id),
          ...accessInfosLevel5.map((item) => item.id),
        ];

        // Cập nhật trạng thái flag cho các node
        this.setFlagAlertToNetworkSystemNodes(allIds, AlertType.INFO_SEC);

        return alerts;
      }),
    );
  }

  fetchAndRenderNetworkAlerts(core?: REGION): Observable<MapDeviceCount[]> {
    return this.processAndRenderInfraAlerts(
      this.store.select(MapStoreSelectos.selectDeviceData),
      core,
    );
  }

  processAndRenderInfraAlerts(
    alertData$: Observable<MapDeviceCount[]>,
    core?: REGION,
  ): Observable<MapDeviceCount[]> {
    // Lấy các map từ store
    const coreMap$ = this.store.select(selectCoreLayersMap(core));
    const boundaryMap$ = this.store.select(selectBoundaryLayersMap(core));
    const accessMap$ = this.store.select(selectAccessLayersMap(core));

    // Kết hợp dữ liệu map và alerts
    return combineLatest([coreMap$, boundaryMap$, accessMap$, alertData$]).pipe(
      map(([coreMap, boundaryMap, accessMap, alerts]) => {
        const filteredAlerts = alerts.filter(
          (item) => item.disconnected && item.disconnected > 0,
        );
        const coreInfos = this.extractUniqueCoordinates(
          filteredAlerts,
          coreMap,
          LayerIds.CORE,
          (alert) => alert.id,
        );
        const boundaryInfos = this.extractUniqueCoordinates(
          filteredAlerts,
          boundaryMap,
          LayerIds.BOUNDARY,
          (alert) => alert.id,
        );

        const accessInfosLevel3 = this.extractUniqueCoordinates(
          filteredAlerts,
          accessMap,
          LayerIds.ACCESS_LEVEL_3,
          (alert) => alert.id,
        );

        const accessInfosLevel4 = this.extractUniqueCoordinates(
          filteredAlerts,
          accessMap,
          LayerIds.ACCESS_LEVEL_4,
          (alert) => alert.id,
        );

        const accessInfosLevel5 = this.extractUniqueCoordinates(
          filteredAlerts,
          accessMap,
          LayerIds.ACCESS_LEVEL_5,
          (alert) => alert.id,
        );

        // Render các alert features trên map
        this.renderAlertFeaturesOnMap(
          AlertType.NETWORK,
          coreInfos,
          LayerIds.NI_ALERT_CORE,
        );
        this.renderAlertFeaturesOnMap(
          AlertType.NETWORK,
          boundaryInfos,
          LayerIds.NI_ALERT_BOUNDARY,
        );
        this.renderAlertFeaturesOnMap(
          AlertType.NETWORK,
          accessInfosLevel3,
          LayerIds.NI_ALERT_ACCESS_LEVEL_3,
        );
        this.renderAlertFeaturesOnMap(
          AlertType.NETWORK,
          accessInfosLevel4,
          LayerIds.NI_ALERT_ACCESS_LEVEL_4,
        );
        this.renderAlertFeaturesOnMap(
          AlertType.NETWORK,
          accessInfosLevel5,
          LayerIds.NI_ALERT_ACCESS_LEVEL_5,
        );

        const allIds = [
          ...coreInfos.map((item) => item.id),
          ...boundaryInfos.map((item) => item.id),
          ...accessInfosLevel3.map((item) => item.id),
          ...accessInfosLevel4.map((item) => item.id),
          ...accessInfosLevel5.map((item) => item.id),
        ];

        // Cập nhật trạng thái flag cho các node
        this.setFlagAlertToNetworkSystemNodes(allIds, AlertType.NETWORK);

        return filteredAlerts;
      }),
    );
  }

  animateToDefaultZoom() {
    const view = this.map.getView();
    view.animate({
      center: Constant.DEFAULT_VIEW.CENTER,
      zoom: Constant.DEFAULT_VIEW.ZOOM,
      duration: 1000,
    });
  }
}
