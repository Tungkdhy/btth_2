import { CONFIG } from '../../../../environments/environment';
import TileWMS from 'ol/source/TileWMS';
import TileLayer from 'ol/layer/Tile';
import { Constant } from '../../../core/config/constant';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { Extent, getTopLeft, getWidth } from 'ol/extent';
import { WMTS } from 'ol/source';
import { get as getProjection, transformExtent } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import { bbox } from 'ol/loadingstrategy';
import { Fill, Stroke, Style } from 'ol/style';
import {
  polygonStyle,
  militaryPointStyle,
  militaryLineStyle,
  internetLineStyle,
  internetPointStyle,
  cableLineStyle, seaCableLineStyle,
} from './styles-in-map';
import {StyleFunction} from "ol/style/Style";

export const geoserverURL = `${CONFIG.API.GEOSERVER.URL}`;
export const geoserverBaseURL = `${CONFIG.API.GEOSERVER.URL}/osm/wms`;
export const geoserverWMTS = `${CONFIG.API.GEOSERVER.URL}/gwc/service/wmts`;

const layerNames = Constant.DEFAULT.MAP.GEOSERVER.LAYERS;
const minZoom = Constant.DEFAULT_VIEW.MIN_ZOOM;
const maxZoom = Constant.DEFAULT_VIEW.MAX_ZOOM;
const zoomLevel = Constant.DEFAULT.MAP.ZOOM_LEVEL;

export function createTileWMSLayer(
  url: string,
  layerName: string,
  isVisible: boolean = true,
) {
  const source = new TileWMS({
    url,
    params: {
      LAYERS: layerName,
      TILED: true,
      FORMAT: 'image/png',
    },
    serverType: 'geoserver',
    transition: 0,
    crossOrigin: 'anonymous',
  });

  return new TileLayer({
    source,
    visible: isVisible,
  });
}

function createWFSLayer(
  typeName: string,
  style: any,
  minZoom: number,
  maxZoom: number,
  isVisible: boolean = true,
) {
  const vectorSource = new VectorSource({
    format: new GeoJSON(),
    url: function (extent) {
      return (
        geoserverURL +
        '/wfs?service=wfs&' +
        'version=1.1.0&request=GetFeature&typename=' +
        typeName +
        '&maxFeatures=20000&' +
        'outputFormat=application/json&srsname=EPSG:3857&' +
        'bbox=' +
        extent.join(',') +
        ',EPSG:3857'
      );
    },
    strategy: bbox, // Use bbox loading strategy
  });

  return new VectorLayer({
    source: vectorSource,
    style: style,
    minZoom: minZoom,
    maxZoom: maxZoom,
    visible: isVisible,
  });
}

const projection = getProjection('EPSG:3857');
const projectionExtent = projection?.getExtent();
const size = getWidth(projectionExtent!) / 256;
const resolutions = new Array(17);
const matrixIds = new Array(17);
for (let z = 0; z < 17; ++z) {
  // generate resolutions and matrixIds arrays for this WMTS
  resolutions[z] = size / Math.pow(2, z);
  matrixIds[z] = z;
}

export function createTileWMTSLayer(
  url: string,
  layerName: string,
  isVisible: boolean = true,
) {
  const source = new WMTS({
    url: url,
    layer: layerName,
    matrixSet: 'WebMercatorQuad',
    format: 'image/png',
    projection: projection!,
    tileGrid: new WMTSTileGrid({
      origin: getTopLeft(projectionExtent!),
      resolutions: resolutions,
      matrixIds: matrixIds,
    }),
    style: '',
    wrapX: true,
  });

  return new TileLayer({
    source,
    visible: isVisible,
  });
}

export const layersConfig = {
  VIETNAM_MOSAIC: createTileWMTSLayer(
    geoserverWMTS,
    Constant.DEFAULT.MAP.GEOSERVER.LAYERS.VIETNAM_MOSAIC,
  ),
  OSM_MAP: createTileWMSLayer(
    geoserverBaseURL,
    Constant.DEFAULT.MAP.GEOSERVER.LAYERS.OSM_MAP,
  ),
  MILITARY_MAP_1M: createTileWMSLayer(
    geoserverBaseURL,
    Constant.DEFAULT.MAP.GEOSERVER.LAYERS.MILITARY_MAP_1M,
  ),
  MILITARY_MAP_250: createTileWMSLayer(
    geoserverBaseURL,
    Constant.DEFAULT.MAP.GEOSERVER.LAYERS.MILITARY_MAP_250,
    false,
  ),
  MILITARY_MAP_100: createTileWMSLayer(
    geoserverBaseURL,
    Constant.DEFAULT.MAP.GEOSERVER.LAYERS.MILITARY_MAP_100,
    false,
  ),
  VIETNAM_ALL: createTileWMSLayer(
    geoserverBaseURL,
    Constant.DEFAULT.MAP.GEOSERVER.LAYERS.VIETNAM_ALL,
  ),
  INFO_LAYER: createTileWMTSLayer(
    geoserverWMTS,
    Constant.DEFAULT.MAP.GEOSERVER.LAYERS.INFO_LAYER,
    false,
  ),

  // Military
  MILITARY_REGION: createWFSLayer(
    layerNames.MILITARY_REGION,
    polygonStyle(),
    zoomLevel.CORE.MIN,
    zoomLevel.CORE.MAX,
    false,
  ),

  BACKBONE_NODES: createWFSLayer(
    layerNames.BACKBONE_NODES,
    militaryPointStyle,
    minZoom + 3,
    maxZoom,
  ),

  CABLE_QA: createWFSLayer(
    layerNames.CABLE_QA,
    militaryLineStyle(3),
    minZoom,
    maxZoom,
  ),

  CABLE_QB: createWFSLayer(
    layerNames.CABLE_QB,
    militaryLineStyle(3),
    minZoom,
    maxZoom,
  ),

  CABLE_QC: createWFSLayer(
    layerNames.CABLE_QC,
    militaryLineStyle(3),
    minZoom,
    maxZoom,
  ),

  MILITARY_BRANCH_LINE: createWFSLayer(
    layerNames.MILITARY_BRANCH_LINE,
    militaryLineStyle(2),
    zoomLevel.BOUNDARY.MIN,
    zoomLevel.ACCESS_LEVEL_5.MAX,
  ),

  // Administration
  COMMUNE: createWFSLayer(
    layerNames.COMMUNE,
    polygonStyle(),
    zoomLevel.ACCESS_LEVEL_5.MIN,
    zoomLevel.ACCESS_LEVEL_5.MAX,
    false,
  ),
  DISTRICT: createWFSLayer(
    layerNames.DISTRICT,
    polygonStyle(),
    zoomLevel.ACCESS_LEVEL_3.MIN,
    zoomLevel.ACCESS_LEVEL_4.MAX,
    false,
  ),
  PROVINCE: createWFSLayer(
    layerNames.PROVINCE,
    polygonStyle(),
    zoomLevel.BOUNDARY.MIN,
    zoomLevel.BOUNDARY.MAX,
    false,
  ),
  NATION: createWFSLayer(
    layerNames.NATION,
    polygonStyle('#892200'),
    minZoom,
    maxZoom,
  ),

  // Internet
  SEA_CABLE: createWFSLayer(
    layerNames.SEA_CABLE,
    seaCableLineStyle,
    0,
    17,
    true,
  ),
  AAE_CABLE: createWFSLayer(
    layerNames.AAE_CABLE,
    cableLineStyle('#a1489b'),
    minZoom,
    maxZoom,
    false,
  ),
  AAG_CABLE: createWFSLayer(
    layerNames.AAG_CABLE,
    cableLineStyle('#69479c'),
    minZoom,
    maxZoom,
    false,
  ),
  ADC_CABLE: createWFSLayer(
    layerNames.ADC_CABLE,
    cableLineStyle('#939597'),
    minZoom,
    maxZoom,
    false,
  ),
  APG_CABLE: createWFSLayer(
    layerNames.APG_CABLE,
    cableLineStyle('#b63894'),
    minZoom,
    maxZoom,
    false,
  ),
  SJC2_CABLE: createWFSLayer(
    layerNames.SJC2_CABLE,
    cableLineStyle('#939597'),
    minZoom,
    maxZoom,
    false,
  ),
  SMW3_CABLE: createWFSLayer(
    layerNames.SMW3_CABLE,
    cableLineStyle('#6fbc44'),
    minZoom,
    maxZoom,
    false,
  ),
  TGN_CABLE: createWFSLayer(
    layerNames.TGN_CABLE,
    cableLineStyle('#3eb65c'),
    minZoom,
    maxZoom,
    false,
  ),

  AGGREGATION_ROUTES: createWFSLayer(
    layerNames.AGGREGATION_ROUTES,
    internetLineStyle(),
    zoomLevel.BOUNDARY.MIN,
    zoomLevel.ACCESS_LEVEL_5.MAX,
    false,
  ),

  // CABLE_LANDING_STATIONS: createWFSLayer(
  //   layerNames.CABLE_LANDING_STATIONS,
  //   internetPointStyle,
  //   minZoom,
  //   maxZoom,
  // ),

  FIBER_CABLE_TO_CHINA: createWFSLayer(
    layerNames.FIBER_CABLE_TO_CHINA,
    internetLineStyle(),
    minZoom,
    maxZoom,
    false,
  ),

  FIBER_CABLE_TO_CAMPUCHIA: createWFSLayer(
    layerNames.FIBER_CABLE_TO_CAMPUCHIA,
    internetLineStyle(),
    minZoom,
    maxZoom,
    false,
  ),

  FIBER_CABLE_TO_LAOS: createWFSLayer(
    layerNames.FIBER_CABLE_TO_LAOS,
    internetLineStyle(),
    minZoom,
    maxZoom,
    false,
  ),
};
