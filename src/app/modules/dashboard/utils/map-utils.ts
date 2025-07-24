import { SocketEventType } from '../models/utils-type';
import { Constant } from '../../../core/config/constant';
import { Fill, Icon, Stroke, Style, Text } from 'ol/style';
import { Feature, View } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { Point } from 'ol/geom';
import { transform } from 'ol/proj';
import CircleStyle from 'ol/style/Circle';
import {
  AlertType,
  LayerIds,
  NetworkInfrastructureTreeCount,
  OverviewStatistics,
  SecurityEventTreeCount,
} from '../models/btth.interface';
import { ScaleLine } from 'ol/control';
import { FeatureLike } from 'ol/Feature';
import { Extent } from 'ol/extent';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventStream } from '../services/military-map.service';

export const scaleLineControl = new ScaleLine({
  units: 'metric', // 'degrees', 'imperial', 'nautical', 'metric', 'us'
  bar: true, // true to show the scale bar
  steps: 4, // Number of steps (subdivisions) in the scale bar
  text: true, // true to render the text label
  minWidth: 200, // Minimum width of the scale line in pixels
});

export const alertStyle = (
  alertType: AlertType,
  iconSizeFactor: number = 1,
) => {
  let src = '';
  const color = Constant.DEFAULT.ICON.ALERT;
  switch (alertType) {
    case AlertType.NETWORK:
      src = color.YELLOW;
      break;
    default:
      src = color.RED;
  }
  return new Style({
    image: new Icon({
      anchor: [0.5, 0],
      src: src,
      width: Constant.DEFAULT.MAP.ICON_SIZE.DOT.WIDTH * iconSizeFactor,
      height: Constant.DEFAULT.MAP.ICON_SIZE.DOT.HEIGHT * iconSizeFactor, // Use dynamic sizing
    }),
  });
};

export const pointStyle = new Style({
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

export const highlightSelectStyle = new Style({
  image: new CircleStyle({
    radius: 45,
    stroke: new Stroke({
      color: 'red',
      width: 2,
    }),
    fill: new Fill({
      color: 'rgba(255, 0, 0, 0)',
    }),
  }),
});

export const getHighlightStyle = (zoomLevel: number): Style => {
  // Calculate radius based on zoom level
  const baseRadius = 40; // Base radius for calculation
  const radius = baseRadius + zoomLevel * 2; // Scale radius with zoom

  return new Style({
    image: new CircleStyle({
      radius: radius,
      stroke: new Stroke({
        color: 'red',
        width: 4,
      }),
      fill: new Fill({
        color: 'rgba(255, 0, 0, 0)', // Transparent fill
      }),
    }),
  });
};

export function defaultView(): View {
  return new View({
    center: Constant.DEFAULT_VIEW.CENTER,
    zoom: Constant.DEFAULT_VIEW.ZOOM,
    minZoom: Constant.DEFAULT_VIEW.MIN_ZOOM,
    maxZoom: Constant.DEFAULT_VIEW.MAX_ZOOM,
  });
}

export function generateIconStyle(icon: Icon, text?: Text) {
  return new Style({
    image: icon,
    text: text,
  });
}

export function generateIcon(
  src: string,
  rotationX: number = 0.5, // Centered horizontally
  rotationY: number = 1, // Bottom of the icon
  baseWidth: number = Constant.DEFAULT.MAP.ICON_SIZE.FLAG.WIDTH,
  baseHeight: number = Constant.DEFAULT.MAP.ICON_SIZE.FLAG.HEIGHT,
  zoomLevel: number = 1, // Current zoom level
): Icon {
  // Adjust icon size based on the zoom level
  const iconSizeFactor = Math.max(1, Math.min(zoomLevel / 10, 2)); // Restrict size factor between 1 and 2
  return new Icon({
    anchor: [rotationX, rotationY],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    scale: iconSizeFactor, // Use scale to resize based on zoom level
    src: src,
  });
}

export function generateFeature(coordinate: Coordinate) {
  const sourceProjection = Constant.MAP_MATERIAL.COORDINATE_SYSTEM.WGS84;
  const destProjection = Constant.MAP_MATERIAL.COORDINATE_SYSTEM.WEB_MERCATOR;
  return new Feature({
    geometry: new Point(
      transform(coordinate, sourceProjection, destProjection),
    ),
  });
}

export const transparentStyle = new Style({
  image: new CircleStyle({
    radius: 0,
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0)', // Fill color with opacity 0
    }),
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0)', // Stroke color with opacity 0
      width: 0,
    }),
  }),
});

export function generateFeatureStyle(
  type: SocketEventType,
  zoomLevel: number = 1,
  name?: string,
) {
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

  // Adjust icon size based on zoom level
  const iconSizeFactor = Math.max(1.5, Math.min(zoomLevel / 8, 3)); // Adjust based on zoom
  const width =
    Constant.DEFAULT.MAP.ICON_SIZE.FLAG_SMALL.WIDTH * iconSizeFactor;
  const height =
    Constant.DEFAULT.MAP.ICON_SIZE.FLAG_SMALL.HEIGHT * iconSizeFactor;

  let text: Text | undefined = undefined;
  if (name) {
    const lines = splitTextIntoLines(name, 200, '24px Calibri,sans-serif');
    const offsetY = lines.length > 1 ? -((lines.length - 1) * 10) / 2 : 0;
    text = new Text({
      font: 'bold 24px Calibri, sans-serif', // Add 'bold' before the size
      text: lines.join('\n'),
      offsetX: 30,
      offsetY: offsetY,
      fill: new Fill({ color: '#000' }),
      textAlign: 'left',
    });
  }

  return generateIconStyle(
    generateIcon(urlIcon, 0.5, 0.5, width, height),
    text,
  );
}

const layerHierarchy: { [key in LayerIds]?: LayerIds[] } = {
  [LayerIds.CORE]: [LayerIds.BOUNDARY],
  [LayerIds.BOUNDARY]: [LayerIds.ACCESS_LEVEL_3],
  [LayerIds.ACCESS_LEVEL_3]: [LayerIds.ACCESS_LEVEL_4],
  [LayerIds.ACCESS_LEVEL_4]: [LayerIds.ACCESS_LEVEL_5],
  // Add further relationships if needed
};

// Function to get child layer IDs
export function getChildLayerIds(currentLayerId: LayerIds): LayerIds[] {
  return layerHierarchy[currentLayerId] || [];
}

export function createLocationStyle(featureName: string): Style {
  return new Style({
    image: new Icon({
      anchor: [0.5, 1], // Centered at bottom
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      src: 'assets/media/svg/maps/location-marker.svg',
      scale: 1.3, // Adjust scale if needed
    }),
    text: new Text({
      text: featureName,
      font: 'bold 2.5rem Arial', // Bold, red, and larger font
      fill: new Fill({
        color: 'red',
      }),
      stroke: new Stroke({
        color: 'black',
        width: 2, // Outline for better readability
      }),
      offsetY: -80, // Offset text above the icon
    }),
  });
}

export function locationStyle(feature: FeatureLike): Style {
  return new Style({
    image: new Icon({
      anchor: [0.5, 1], // Centered at bottom
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      src: 'assets/media/svg/maps/location-marker.svg',
      scale: 1.3, // Adjust scale if needed
    }),
    text: new Text({
      text: feature.get('name') ?? '',
      font: 'bold 2.5rem Arial', // Bold, red, and larger font
      fill: new Fill({
        color: 'red',
      }),
      stroke: new Stroke({
        color: 'black',
        width: 2, // Outline for better readability
      }),
      offsetY: -80, // Offset text above the icon
    }),
  });
}

// Function to check if the zoom level is within the range for a specific layer
export function checkZoomAndAdjust(
  featureZoom: number,
  layerId: LayerIds,
): number {
  const ZOOM_LEVEL = Constant.DEFAULT.MAP.ZOOM_LEVEL;

  let layerZoomRange: { MIN: number; MAX: number };

  switch (layerId) {
    case LayerIds.CORE:
    case LayerIds.IS_ALERT_CORE:
    case LayerIds.NI_ALERT_CORE:
      layerZoomRange = ZOOM_LEVEL.CORE;
      break;
    case LayerIds.BOUNDARY:
      layerZoomRange = ZOOM_LEVEL.BOUNDARY;
      break;
    case LayerIds.ACCESS_LEVEL_3:
      layerZoomRange = ZOOM_LEVEL.ACCESS_LEVEL_3;
      break;
    case LayerIds.ACCESS_LEVEL_4:
      layerZoomRange = ZOOM_LEVEL.ACCESS_LEVEL_4;
      break;
    case LayerIds.ACCESS_LEVEL_5:
      layerZoomRange = ZOOM_LEVEL.ACCESS_LEVEL_5;
      break;
    default:
      return featureZoom; // If layerId doesn't match any known layers, return the original zoom level
  }

  if (featureZoom >= layerZoomRange.MIN && featureZoom <= layerZoomRange.MAX) {
    return featureZoom; // Zoom is within the range, return as is
  } else {
    return layerZoomRange.MIN + 0.2; // Adjust to the minimum zoom level of the layer
  }
}

export function isNetworkSystemLayer(layerId: LayerIds): boolean {
  return [
    LayerIds.CORE,
    LayerIds.BOUNDARY,
    LayerIds.ACCESS_LEVEL_3,
    LayerIds.ACCESS_LEVEL_4,
    LayerIds.ACCESS_LEVEL_5,
  ].includes(layerId);
}

export function setupIdForNetworkNodes(
  id: number | string,
  isCore: boolean = true,
) {
  return isCore ? `Core-${id}` : `Boundary-${id}`;
}

export function getLayerName(layerId: LayerIds): string | null {
  switch (layerId) {
    case LayerIds.COMMUNE:
      return 'Xã';
    case LayerIds.DISTRICT:
      return 'Quận';
    case LayerIds.PROVINCE:
      return 'Tỉnh';
    case LayerIds.NATION:
      return 'Biên giới quốc gia';
    case LayerIds.MILITARY_REGION:
      return 'Quân khu';
    case LayerIds.BACKBONE_NODES:
      return 'Trạm cáp quang';
    case LayerIds.QA_ROUTE:
      return 'Tuyến QA';
    case LayerIds.QB_ROUTE:
      return 'Tuyến QB';
    case LayerIds.QC_ROUTE:
      return 'Tuyến QC';
    case LayerIds.MILITARY_BRANCH_LINE:
      return 'Tuyến nhánh';
    case LayerIds.AAE_CABLE:
      return 'Cáp AAE';
    case LayerIds.AAG_CABLE:
      return 'Cáp AAG';
    case LayerIds.ADC_CABLE:
      return 'Cáp ADC';
    case LayerIds.APG_CABLE:
      return 'Cáp APG';
    case LayerIds.SJC2_CABLE:
      return 'Cáp SJC2';
    case LayerIds.SMW3_CABLE:
      return 'Cáp SMW3';
    case LayerIds.TGN_CABLE:
      return 'Cáp TGN';
    case LayerIds.SEA_CABLE:
      return 'Cáp quang biển';
    case LayerIds.AGGREGATION_ROUTES:
      return 'Tuyến Internet';
    case LayerIds.CABLE_LANDING_STATIONS:
      return 'Trạm cáp quang biển';
    case LayerIds.FIBER_CABLE_TO_CHINA:
      return 'Cáp quang đi Trung Quốc';
    case LayerIds.FIBER_CABLE_TO_CAMPUCHIA:
      return 'Cáp quang đi Campuchia';
    case LayerIds.FIBER_CABLE_TO_LAOS:
      return 'Cáp quang đi Lào';
    default:
      return null;
  }
}

/**
 * Maps the provided sample data to NetworkInfrastructureTreeCount.
 * @param {Object} dataFromLeftPanel - The sample data to map.
 * @returns {NetworkInfrastructureTreeCount} The mapped NetworkInfrastructureTreeCount object.
 */
export function mapToNetworkInfrastructureTreeCount(
  dataFromLeftPanel: any,
): NetworkInfrastructureTreeCount {
  return {
    type: dataFromLeftPanel.type,
    unitPath: dataFromLeftPanel.unit_path,
    unitNameFull: dataFromLeftPanel.unit_name_full || undefined,
    coreLayerName: dataFromLeftPanel.loploi || null,
    boundaryLayerName: dataFromLeftPanel.lopbien || null,
    total: 1, // Assuming the total is always 1 for a single item, adjust if needed.
    status: dataFromLeftPanel.status || undefined,
  };
}

/**
 * Maps the provided sample data to SecurityEventTreeCount.
 * @param {Object} dataFromLeftPanel - The sample data to map.
 * @returns {SecurityEventTreeCount} The mapped SecurityEventTreeCount object.
 */
export function mapToSecurityEventTreeCount(
  dataFromLeftPanel: any,
): SecurityEventTreeCount {
  return {
    type: dataFromLeftPanel.alert_type || Constant.MESSAGE.UNKNOWN, // Map alert_type to type
    unitPath: dataFromLeftPanel.unit.path, // Directly map unit.path
    unitNameFull: dataFromLeftPanel.unit.unit_name_full || undefined, // Map unit_name_full to unitName, optional
    coreLayerName: dataFromLeftPanel.loi || 'N/A', // Map loi to coreLayerName, default to 'N/A'
    boundaryLayerName: dataFromLeftPanel.bien || 'N/A', // Map bien to boundaryLayerName, default to 'N/A'
    total: 1, // Assuming each alert is a single event, so total is 1
    warningLevel: 1, // Determine warningLevel from message
  };
}

export function isAccessLayer(layerId: LayerIds | undefined) {
  if (!layerId) return false;
  return (
    layerId === LayerIds.ACCESS_LEVEL_3 ||
    layerId === LayerIds.ACCESS_LEVEL_4 ||
    layerId === LayerIds.ACCESS_LEVEL_5
  );
}

export function isValidExtent(
  extent: [number, number, number, number] | Extent | undefined,
): boolean {
  if (!extent) {
    return false;
  }

  const [minX, minY, maxX, maxY] = extent;

  // Kiểm tra xem có giá trị nào là Infinity hoặc -Infinity
  if (
    minX === Infinity ||
    minY === Infinity ||
    maxX === -Infinity ||
    maxY === -Infinity ||
    minX === -Infinity ||
    minY === -Infinity ||
    maxX === Infinity ||
    maxY === Infinity
  ) {
    return false;
  }

  // Kiểm tra xem minX có nhỏ hơn maxX và minY có nhỏ hơn maxY không
  if (minX >= maxX || minY >= maxY) {
    return false;
  }

  return true;
}

export function isValidCoordinate(coordinate: any): boolean {
  // Kiểm tra xem coordinate có phải là một mảng
  if (!Array.isArray(coordinate)) {
    return false;
  }

  // Kiểm tra xem mảng có độ dài là 2 (cho tọa độ 2D) hoặc 3 (cho tọa độ 3D)
  if (coordinate.length !== 2 && coordinate.length !== 3) {
    return false;
  }

  // Kiểm tra xem tất cả các phần tử trong mảng có phải là số hay không
  return coordinate.every(
    (value) => typeof value === 'number' && !isNaN(value),
  );
}

// Function to get LayerId based on zoom level
export function getLayerIdForZoom(zoomLevel: number): LayerIds | null {
  const ZOOM_LEVEL = Constant.DEFAULT.MAP.ZOOM_LEVEL;
  if (zoomLevel >= ZOOM_LEVEL.CORE.MIN && zoomLevel < ZOOM_LEVEL.CORE.MAX) {
    return LayerIds.CORE;
  } else if (
    zoomLevel >= ZOOM_LEVEL.BOUNDARY.MIN &&
    zoomLevel < ZOOM_LEVEL.BOUNDARY.MAX
  ) {
    return LayerIds.BOUNDARY;
  } else if (
    zoomLevel >= ZOOM_LEVEL.ACCESS_LEVEL_3.MIN &&
    zoomLevel < ZOOM_LEVEL.ACCESS_LEVEL_3.MAX
  ) {
    return LayerIds.ACCESS_LEVEL_3;
  } else if (
    zoomLevel >= ZOOM_LEVEL.ACCESS_LEVEL_4.MIN &&
    zoomLevel < ZOOM_LEVEL.ACCESS_LEVEL_4.MAX
  ) {
    return LayerIds.ACCESS_LEVEL_4;
  } else if (
    zoomLevel >= ZOOM_LEVEL.ACCESS_LEVEL_5.MIN &&
    zoomLevel < ZOOM_LEVEL.ACCESS_LEVEL_5.MAX
  ) {
    return LayerIds.ACCESS_LEVEL_5;
  }
  // Return null if zoom level does not match any range
  return null;
}

export function generateTooltipContent(
  feature: Feature,
  labels: { [key: string]: string },
): string {
  const properties = feature.getProperties();
  return Object.entries(properties)
    .filter(([key]) => labels.hasOwnProperty(key))
    .map(
      ([key, value]) =>
        `<strong>${labels[key]}: </strong> ${
          // value || 'Không có dữ liệu'
          value || ' - '
        }  <br />`,
    )
    .join('');
}

export function getAlertTypeFromLayerId(layerId: LayerIds): AlertType | null {
  switch (layerId) {
    case LayerIds.IS_ALERT_CORE:
    case LayerIds.IS_ALERT_BOUNDARY:
    case LayerIds.IS_ALERT_ACCESS_LEVEL_3:
    case LayerIds.IS_ALERT_ACCESS_LEVEL_4:
    case LayerIds.IS_ALERT_ACCESS_LEVEL_5:
      return AlertType.INFO_SEC;

    case LayerIds.NI_ALERT_CORE:
    case LayerIds.NI_ALERT_BOUNDARY:
    case LayerIds.NI_ALERT_ACCESS_LEVEL_3:
    case LayerIds.NI_ALERT_ACCESS_LEVEL_4:
    case LayerIds.NI_ALERT_ACCESS_LEVEL_5:
      return AlertType.NETWORK;

    default:
      return null;
  }
}

// Reusable function to filter the array
export function getFilteredCombinedStore(
  combinedStore$: Observable<OverviewStatistics[] | null>,
  componentEvent$: Observable<EventStream>,
): Observable<OverviewStatistics[]> {
  return combineLatest([combinedStore$, componentEvent$]).pipe(
    map(([combinedStore, componentEvent]) => {
      // If combinedStore is null, return an empty array
      if (!combinedStore) {
        return [];
      }

      // Check if filtering is required
      if (componentEvent.isFilter) {
        // Filter the combinedStore based on the condition
        return filterArray(combinedStore, componentEvent.alertType);
      }

      // Return the original combinedStore if no filtering is needed
      return combinedStore;
    }),
  );
}

// The actual filtering logic
export function filterArray(
  array: OverviewStatistics[],
  alertType?: AlertType,
): any[] {
  if (!array) {
    return []; // Return an empty array if the input array is null or undefined
  }

  // Apply filtering based on the alertType
  return array.filter((item) => {
    if (alertType === AlertType.NETWORK) {
      // Filter by 'disconnected'
      return item.totalDisconnectedNetworkDevices !== 0;
    } else if (alertType === AlertType.INFO_SEC) {
      // Filter by 'totalSecurityViolations'
      return item.totalSecurityViolations !== 0;
    } else {
      // Default filter for other cases: filter where any metric is not 0
      return (
        item.totalNetworkDevices !== 0 ||
        item.totalEndpoints !== 0 ||
        item.totalDisconnectedNetworkDevices !== 0 ||
        item.totalSecurityViolations !== 0
      );
    }
  });
}

export function splitTextIntoLines(
  text: string,
  maxWidth: number,
  font: string,
): string[] {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context!.font = font;

  const words = text.split(' ');
  let lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = context!.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);

  return lines;
}
