import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LegendOnMap,
  LegendOnMapComponent,
} from '../legend-on-map/legend-on-map.component';
import { DeviceStats } from '../../../models/geographical-coordinates';
import { Feature, Map as MapOl, Overlay, View } from 'ol';
import { UnitTreeFilter } from '../../../models/unit-tree-filter';
import { Observable, tap } from 'rxjs';
import { MapArea } from '../../../models/btth.type';
import { Constant } from '../../../../../core/config/constant';
import {
  AlertType,
  EventId,
  LayerIds,
  MapSubType,
  REGION,
  FeatureDisplayData,
  UnitPath,
} from '../../../models/btth.interface';
import { FeatureInfoComponent } from '../feature-info/feature-info.component';
import { SearchMapComponent } from '../search-map/search-map.component';
import { Store } from '@ngrx/store';
import { transform } from 'ol/proj';
import { FeatureStatsOverlayComponent } from '../feature-stats-overlay/feature-stats-overlay.component';
import { Select } from 'ol/interaction';
import { singleClick } from 'ol/events/condition';
import { selectAccessLayersMapByUnitPathAndOneLevelDeeper } from '../../../../../store/map-interaction/network-system/network-system.selectors';
import { FeatureDetailPanelComponent } from '../../shared/feature-detail-panel/feature-detail-panel.component';
import {
  EventStream,
  MilitaryMapService,
} from '../../../services/military-map.service';
import { MapSupabaseService } from '../../../services/map-supabase.service';
import { map } from 'rxjs/operators';
import {
  generateTooltipContent,
  getLayerIdForZoom,
  isAccessLayer,
  isNetworkSystemLayer,
  locationStyle,
  setupIdForNetworkNodes,
} from '../../../utils/map-utils';
import { HomeControl } from '../controls/home-control';
import { LayersControlComponent } from '../layers-control/layers-control.component';
import { InfoControl } from '../controls/info-control';
import { InfoPanelComponent } from '../info-panel/info-panel.component';
import { SocketService } from '../../../services/socket.service';
import { DataTypePayload } from '../../../models/payload-channel';
import { AlertListCardComponent } from '../panel/alert-list-card/alert-list-card.component';
import { TopologyWrapperCardComponent } from '../panel/topology-wrapper-card/topology-wrapper-card.component';
import { AccessStatsPanelComponent } from '../panel/access-stats-panel/access-stats-panel.component';
import { OverviewTabPanelComponent } from '../overview-tab-panel/overview-tab-panel.component';
import { selectUnitPathToParent } from '../../../../../store/unit-btth/unit-btth.selectors';
import { AlertDetailCardComponent } from '../panel/alert-detail-card/alert-detail-card.component';
import { LegendTableComponent } from '../panel/legend-table/legend-table.component';
import {
  Breadcrumb,
  BreadcrumbIds,
  BreadcrumbService,
} from '../../../services/breadcrumb.service';
import { NavTabsComponent } from '../../shared/nav-tabs/nav-tabs.component';
import { RouterDetailPanelComponent } from '../panel/router-detail-panel/router-detail-panel.component';
import { UnitDetailPanelComponent } from '../panel/unit-detail-panel/unit-detail-panel.component';
import { RouterAccessDetailPanelComponent } from '../panel/router-access-detail-panel/router-access-detail-panel.component';
import { ContactInformationPanelComponent } from '../panel/contact-information-panel/contact-information-panel.component';
import { TitlePanelComponent } from '../panel/title-panel/title-panel.component';
import * as StatisticsStoreActions from '../../../../../store/map-interaction/statistics-store/statistics-store.actions';
import * as MapStoreActions from '../../../../../store/map-interaction/map-store/map-store.actions';
import { UnitOverviewPanelComponent } from '../panel/unit-overview-panel/unit-overview-panel.component';
import { AlertControl } from '../controls/alert-control';
import { AlertListPanelComponent } from '../panel/alert-list-panel/alert-list-panel.component';
import { DeviceTooltipComponent } from '../overlays/device-tooltip/device-tooltip.component';

export enum TemplateId {
  overview,
  detail,
  unit,
  none,
}

@Component({
  selector: 'app-military-map',
  standalone: true,
  imports: [
    CommonModule,
    LegendOnMapComponent,
    FeatureInfoComponent,
    SearchMapComponent,
    FeatureStatsOverlayComponent,
    FeatureDetailPanelComponent,
    LayersControlComponent,
    InfoPanelComponent,
    AlertListCardComponent,
    TopologyWrapperCardComponent,
    AccessStatsPanelComponent,
    OverviewTabPanelComponent,
    AlertDetailCardComponent,
    LegendTableComponent,
    NavTabsComponent,
    RouterDetailPanelComponent,
    UnitDetailPanelComponent,
    RouterAccessDetailPanelComponent,
    ContactInformationPanelComponent,
    TitlePanelComponent,
    UnitOverviewPanelComponent,
    AlertListPanelComponent,
    DeviceTooltipComponent,
  ],
  templateUrl: './military-map.component.html',
  styleUrls: ['./military-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MilitaryMapComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  @ViewChild(DeviceTooltipComponent) tooltipComponent!: DeviceTooltipComponent;

  @Output() openTopology = new EventEmitter<any>();
  @Input() mapId: string = 'it-map';

  @Input() selectedArea: MapArea;

  unitPathToParent$: Observable<string | null>;

  // Biến để kiểm soát template hiện tại
  currentTemplate: TemplateId = TemplateId.overview; // Mặc định hiển thị 'overview'
  showAlertListPanel: boolean = false;

  // Manage visibility for each panel
  isLeftPanelVisible: boolean = true;
  isRightPanelVisible: boolean = true;

  featureDataOnLegend?: FeatureDisplayData;
  selectedFeature: Feature | null;
  selectedLayerId: LayerIds = LayerIds.CORE;

  coreLayer$: Observable<DeviceStats[]>;
  boundaryLayer$: Observable<DeviceStats[]>;
  accessLayer$: Observable<DeviceStats[]>;
  infoSecLayer$: Observable<any>;
  networkAlertLayer$: Observable<any>;

  payloadChannel$: Observable<any>;
  componentEvent$: Observable<EventStream>;

  mapOl: MapOl;
  view: View;
  infoMode: boolean = false;
  infoData: any; // Dữ liệu để truyền đến InfoPanelComponent
  boundHandleMapClick: any;
  boundHandleMapTooltip: any;

  // TODO: new tooltip
  tooltipOverlay: Overlay;
  tooltipElement: HTMLElement;

  contextMenu: any;
  infoWarfare$: Observable<LegendOnMap[]>;
  unitTreeFields = new UnitTreeFilter();
  protected readonly isAccessLayer = isAccessLayer;
  protected readonly TemplateId = TemplateId;

  private readonly CORE_PROPERTY_LABELS: { [key: string]: string } = {
    name: 'Tên',
  };

  private readonly BOUNDARY_PROPERTY_LABELS: { [key: string]: string } = {
    name: 'Tên',
    device: 'Thiết bị',
    wan: 'WAN',
    wanTn: 'WANTN',
  };

  private mapService = inject(MilitaryMapService);
  private supabase = inject(MapSupabaseService);
  private socket = inject(SocketService);
  private cdr = inject(ChangeDetectorRef);
  private breadcrumbService = inject(BreadcrumbService);
  private store = inject(Store);

  constructor() {
    this.listenChannelEvent();
    this.listenComponentEvent();
    this.boundHandleMapClick = this.handleMapClick.bind(this);
    this.boundHandleMapTooltip = this.displayTooltip.bind(this);
  }

  ngOnInit(): void {
    this.initializeState();
    this.setupInitialValues();
  }

  ngOnChanges(changes: SimpleChanges) {
    const region = changes.selectedArea.currentValue as MapArea;
    if (region) {
      let core;
      switch (region) {
        case 'north':
          core = REGION.NORTH;
          break;
        case 'central':
          core = REGION.CENTRAL;
          break;
        case 'south':
          core = REGION.SOUTH;
          break;
        default:
          return;
      }
      this.setupInitialValues(); //TODO: Fix area
      this.resetState();
      this.selectFeature(setupIdForNetworkNodes(core), true);
    }
  }

  ngOnDestroy() {
    this.clearSources();
  }

  ngAfterViewInit() {
    this.mapOl = this.mapService.map;
    this.view = this.mapOl.getView();
    this.mapOl.setTarget(this.mapId);
    this.setupInteractions();
    this.setupControls();
  }

  // Initializes context menu and map
  private initializeState(): void {
    // this.initializeContextMenu();
    this.configureUnitTree();
    this.setupMap();
  }

  // Sets the initial configuration of the unit tree
  private configureUnitTree(): void {
    this.unitTreeFields.rootPath = UnitPath.QS_QP;
    this.unitTreeFields.level = 3;
  }

  // Sets up the map by initializing and adding layers
  private setupMap(): void {
    this.initializeMap();
    this.addMapLayers();
  }

  // Initializes the map service
  private initializeMap(): void {
    this.mapService.initialMap();
  }

  addTooltipOverlayOnMap(): void {
    this.createTooltipOverlay();
    this.mapOl.addOverlay(this.tooltipOverlay);
  }

  createTooltipOverlay(): void {
    // const tooltipElm = document.createElement('div');
    // tooltipElm.id = 'ol-tooltip';
    // this.tooltipElement = tooltipElm;
    // this.tooltipElement.style.display = 'block';
    // this.tooltipOverlay = new Overlay({
    //   element: this.tooltipElement,
    //   offset: [10, -50],
    //   positioning: 'top-left',
    // });

    const container = document.getElementById('overlay-container');
    // Initialize OpenLayers overlay with Angular element
    if (!container) return;
    this.tooltipOverlay = new Overlay({
      element: container,
      autoPan: true,
      positioning: 'bottom-center', // Position the overlay at the bottom-center
      stopEvent: false,
    });
  }

  // Adds both network and alert layers to the map
  private addMapLayers(): void {
    this.addNetworkLayers();
    this.addAlertLayers();
  }

  // Initializes network layers, optional REGION can be passed
  private addNetworkLayers(core?: REGION) {
    this.coreLayer$ = this.mapService.getCoreLayer(core);
    this.boundaryLayer$ = this.mapService.getBoundaryLayer(core);
    this.accessLayer$ = this.mapService.getAccessLayer(core);
  }

  // Initializes alert layers, optional REGION can be passed
  private addAlertLayers(core?: REGION) {
    this.infoSecLayer$ = this.mapService.fetchAndRenderInfoSecAlerts(core);
    this.networkAlertLayer$ = this.mapService.fetchAndRenderNetworkAlerts(core);
  }

  // Sets up initial values like template and breadcrumbs
  private setupInitialValues(): void {
    this.setInitialTemplate();
    this.clearBreadcrumbs();
    this.clearEventStream();
    this.initializeFeatureData();
    this.loadInfoWarfareOverview();
  }

  // function for setting template
  private setInitialTemplate(): void {
    this.setTemplate(TemplateId.overview);
  }

  private showAllPanels() {
    this.isLeftPanelVisible = true;
    this.isRightPanelVisible = true;
  }

  // Clears breadcrumbs using the breadcrumb service
  private clearBreadcrumbs(): void {
    this.breadcrumbService.clearBreadcrumbs();
  }

  private clearEventStream(): void {
    this.mapService.clearEventStream();
  }

  // Resets feature data on legend
  private initializeFeatureData(): void {
    this.featureDataOnLegend = undefined;
  }

  // Loads information warfare overview and prepares data for UI
  private loadInfoWarfareOverview(): void {
    this.infoWarfare$ = this.supabase.getInfoWarfareOverview(10).pipe(
      map((items) => {
        return items.map((item) => ({
          name: item.district,
          count: (item.positive ?? 0) + (item.neutral ?? 0),
        }));
      }),
    );
  }

  setupInteractions() {
    this.mapOl.on('moveend', () => this.updateMapInfo(this.mapOl));
    this.handleMapMoveEnd();
    this.addTooltipOverlayOnMap();
    this.setupHoverInteractionForDevices();
    this.addSelectOnMap();
  }

  setupHoverInteractionForDevices(): void {
    const coreLayer = this.mapService.networkSystemLayers.get(LayerIds.CORE);
    const boundaryLayer = this.mapService.networkSystemLayers.get(
      LayerIds.BOUNDARY,
    );
    if (coreLayer && boundaryLayer) {
      // const hoverInteraction = this.mapService.createHoverInteraction(
      //   [coreLayer, boundaryLayer],
      //   this.updateTooltip.bind(this),
      // );
      const hoverInteraction = this.mapService.createHoverInteraction(
        [...this.mapService.networkSystemLayers.values()],
        this.updateTooltip.bind(this),
      );
      this.mapOl.addInteraction(hoverInteraction);
    }
  }

  updateTooltip(event: any): void {
    if (event.selected.length > 0) {
      const feature = event.selected[0];
      const layerId = feature.get('layerId');
      let content = '';
      switch (layerId) {
        case LayerIds.CORE:
          content = `Trạm ${feature.get('name')}`;
          break;
        case LayerIds.BOUNDARY:
          content = generateTooltipContent(
            feature,
            this.BOUNDARY_PROPERTY_LABELS,
          );
          break;
        default:
          content = '';
          break;
      }
      this.tooltipComponent.hoverInfo = this.setFeatureData(feature, layerId);
      this.mapService.showTooltip(this.tooltipOverlay, feature, content);
      this.cdr.markForCheck();
    } else {
      // this.tooltipElement.style.display = 'none';
      this.tooltipOverlay.setPosition(undefined);
    }
  }

  addSelectOnMap() {
    const selectClick = new Select({
      layers: Array.from(this.mapService.networkSystemLayers.values()),
      condition: singleClick,
      style: locationStyle,
      hitTolerance: 8,
    });

    this.mapOl.addInteraction(selectClick);
    this.handleSelectFeature(selectClick);
  }

  displayTooltip(event: any): void {
    const features = this.mapOl.getFeaturesAtPixel(event.pixel, {
      hitTolerance: 5,
      layerFilter: (layer) => {
        return !isNetworkSystemLayer(layer.get('id'));
      },
    });

    if (features.length > 0) {
      const coordinate = event.coordinate;
      const feature = features[0];
      let content = '';
      const featureInfo = Object.entries(feature.getProperties()).map(
        ([key, value]) => ({
          name: key,
          value: value || 'Không có dữ liệu', // Default to 'N/A' if the value is empty
        }),
      );
      featureInfo.forEach((item) => {
        content += `<strong>${item.name}: </strong> ${item.value} <br />`;
      });

      this.tooltipElement.innerHTML = content ?? 'Không có dữ liệu';
      this.tooltipOverlay.setPosition(coordinate);
      this.tooltipElement.style.display = 'block';
    } else {
      this.tooltipElement.style.display = 'none';
    }
  }

  setupControls() {
    const homeControl = new HomeControl({
      onClick: this.handleHomeControl.bind(this),
    });
    this.mapOl.addControl(homeControl);

    const infoControl = new InfoControl({
      toggleInfoMode: this.toggleInfoMode.bind(this),
    });

    this.mapOl.addControl(infoControl);

    const alertControl = new AlertControl({
      toggle: this.toggleAlertListPanel.bind(this),
    });

    this.mapOl.addControl(alertControl);
  }

  clearSources(): void {
    this.mapService.destroyMap();
  }

  listenChannelEvent(): void {
    this.payloadChannel$ = this.socket.payload$.pipe(
      tap((channelData: any) => {
        const payload = channelData.payload;
        if (payload.type === EventId.MAP) {
          this.handleMapChannelEvent(payload.data);
        }
      }),
    );
  }

  // Handling map events
  private handleMapChannelEvent(data: any): void {
    const subType = data.subType as MapSubType;
    const dataType = data.dataType as DataTypePayload;
    const actualData = data.actualData;
    if (!actualData) return;

    switch (dataType) {
      case 'array':
        this.handleArrayData(actualData, subType);
        break;
      case 'object':
        this.handleObjectData(actualData, subType);
        break;
      default:
        this.handleDefaultCase(subType);
        break;
    }
    this.cdr.markForCheck(); // Ensure change detection
  }

  // Handle array-type data
  handleArrayData(actualData: any, subType: MapSubType): void {
    const titles = actualData.title;
    this.setTemplate(TemplateId.overview);

    // Clear map state and reset zoom if no relevant feature is selected
    if (!this.isCoreLayerSelected()) {
      this.clearMapState();
      this.clearEventAndBreadcrumbs();
      this.mapService.animateToDefaultZoom();
    }

    // Dispatch filters and update visibility based on subType
    this.dispatchFiltersAndVisibility(actualData.apiFilter, subType);

    // Handle breadcrumbs
    this.breadcrumbService.clearBreadcrumbs();
    this.addAlertTitlesBreadcrumbs(titles);
  }

  // Handle object-type data
  private handleObjectData(actualData: any, subType: MapSubType): void {
    this.mapService.isolateAndHighlightFeature(actualData.unit_path, subType);
    this.selectFeature(actualData.unit_path, false, false);
    this.breadcrumbService.upsertBreadcrumb({
      id: BreadcrumbIds.ALERT_DETAIL,
      label: 'Chi tiết cảnh báo',
    });
  }

  // Handle default case
  private handleDefaultCase(subType: MapSubType): void {
    this.mapService.animateToDefaultZoom();
    this.mapService.setAlertVisibility(
      subType === MapSubType.INFRASTRUCTURE_ALERT
        ? AlertType.NETWORK
        : AlertType.INFO_SEC,
    );
  }

  // Check if the selected feature is in the core layer
  private isCoreLayerSelected(): boolean {
    return !!(
      this.selectedFeature &&
      this.selectedFeature.get('layerId') === LayerIds.CORE
    );
  }

  // Dispatches filters and updates visibility based on the subType
  private dispatchFiltersAndVisibility(
    apiFilter: any,
    subType: MapSubType,
  ): void {
    switch (subType) {
      case MapSubType.INFRASTRUCTURE_ALERT:
        this.updateFiltersAndVisibility(
          { systemType: apiFilter.columnType },
          AlertType.NETWORK,
        );
        break;
      case MapSubType.CYBER_SECURITY_ALERT:
        this.updateFiltersAndVisibility(
          { alertType: apiFilter.columnType },
          AlertType.INFO_SEC,
        );
        break;
    }
  }

  // Helper function to dispatch filter actions and set map visibility
  private updateFiltersAndVisibility(filters: any, alertType: AlertType): void {
    this.store.dispatch(StatisticsStoreActions.updateFilters({ filters }));
    this.store.dispatch(MapStoreActions.updateMapFilters({ filters }));
    this.mapService.setAlertVisibility(alertType);
    this.mapService.updateEvent({
      alertType,
      isFilter: true,
    });
  }

  // Adds breadcrumbs to the breadcrumb service
  private addAlertTitlesBreadcrumbs(titles: Breadcrumb[]): void {
    titles.forEach((item: Breadcrumb) =>
      this.breadcrumbService.addBreadcrumb(item),
    );
  }

  listenComponentEvent() {
    this.componentEvent$ = this.mapService.currentEvent$.pipe(
      tap((data: EventStream) => {
        const featureId = data.id;
        if (featureId) this.selectFeature(featureId);
      }),
    );
  }

  handleHomeControl() {
    // this.setupInitialValues();
    this.mapService.animateToDefaultZoom();
    this.resetState();
    // this.setupInitialValues();
  }

  // Reset the entire state
  private resetState(): void {
    this.setInitialTemplate();
    this.clearMapState();
    this.resetVisibility();
    this.clearEventAndBreadcrumbs();
    this.resetFilters();
    this.store.dispatch(StatisticsStoreActions.loadCoreStats());
    this.showAlertListPanel = false;
  }

  // Clear highlight and selected feature styles from map
  private clearMapState(): void {
    this.clearHighlightAndSelectedFeatureStyle();
  }

  // Reset network and alert visibility in the map
  private resetVisibility(): void {
    this.mapService.resetAllVisibility();
  }

  // Clear event stream and breadcrumbs
  private clearEventAndBreadcrumbs(): void {
    this.mapService.clearEventStream();
    this.breadcrumbService.clearBreadcrumbs();
  }

  // Dispatch actions to update filters
  private resetFilters(): void {
    this.updateDefaultFiltersStores();
  }

  updateDefaultFiltersStores() {
    this.store.dispatch(MapStoreActions.updateMapDefaultFilters());
    this.store.dispatch(StatisticsStoreActions.updateDefaultFilters());
  }

  toggleInfoMode() {
    this.infoMode = !this.infoMode;
    const mapElement = document.getElementById(this.mapId);

    if (this.infoMode) {
      this.mapOl.on('pointermove', this.boundHandleMapTooltip);
      if (mapElement) {
        mapElement.style.cursor =
          'url("assets/cursors/Aero_help-Transparent.cur"), help';
      }
    } else {
      this.mapOl.un('pointermove', this.boundHandleMapTooltip);
      if (mapElement) {
        mapElement.style.cursor = '';
      }
    }
  }

  toggleAlertListPanel() {
    if (this.currentTemplate === TemplateId.overview)
      this.setTemplate(TemplateId.none);
    this.showAlertListPanel = !this.showAlertListPanel;
    this.cdr.markForCheck();
  }

  handleMapClick(event: any) {
    const viewResolution = /** @type {number} */ this.view.getResolution();
    const url = this.mapService.infoLayer
      ?.getSource()
      ?.getFeatureInfoUrl(event.coordinate, viewResolution!, 'EPSG:3857', {
        INFO_FORMAT: 'application/json',
      });
    if (url) {
      const headers = {};
      fetch(url + '&FEATURE_COUNT=50', {
        method: 'GET',
        mode: 'cors',
        headers: headers,
      })
        .then((response) => response.json())
        .then((json) => {
          this.infoData = json.features;
          this.cdr.markForCheck();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  private clearHighlightAndSelectedFeatureStyle() {
    this.mapService.clearHighlight();
    this.resetSelectedFeatureStyle();
  }

  updateMapInfo(map: MapOl): void {
    const center = map.getView().getCenter();
    if (!center) return;
    const coordinates = transform(
      center,
      Constant.MAP_MATERIAL.COORDINATE_SYSTEM.WEB_MERCATOR,
      Constant.MAP_MATERIAL.COORDINATE_SYSTEM.WGS84,
    );
    // TODO: View in console.log
    // console.log(
    //   `Center: ${coordinates} / ZoomLevel: ${map.getView().getZoom()}`,
    // );
  }

  // Function to handle move end event
  // TODO: Dispatch MapStore in this
  handleMapMoveEnd() {
    this.mapOl.on('moveend', () => {
      const zoomLevel = this.mapOl.getView().getZoom();

      if (zoomLevel !== undefined) {
        const layerId = getLayerIdForZoom(zoomLevel);
        if (layerId !== null) {
          if (this.selectedLayerId !== layerId) {
            this.selectedLayerId = layerId;
            this.cdr.markForCheck();
            this.handleDispatchMapStore(layerId);
          }

          // You can also update any UI element here with the LayerId
        } else {
          console.error(`No Layer ID found for zoom level ${zoomLevel}`);
        }
      }
    });
  }

  clearAlertBreadcrumbs() {
    if (
      this.breadcrumbService.breadcrumbExists(BreadcrumbIds.INFRA_ALERT_LIST) ||
      this.breadcrumbService.breadcrumbExists(
        BreadcrumbIds.INFO_SEC_ALERT_LIST,
      ) ||
      this.breadcrumbService.breadcrumbExists(BreadcrumbIds.ALERT_DETAIL)
    ) {
      this.breadcrumbService.clearBreadcrumbs();
    }
  }

  selectFeature(
    featureId: string,
    isUpdateLastBreadcrumb: boolean = false,
    isAutoUpdateBreadCrumb: boolean = true,
  ) {
    const feature = this.mapService.networkSystemNodes.get(featureId);
    if (!feature) return;
    this.setTemplate(TemplateId.detail);

    // Thay đổi style của feature như khi nó được select
    feature.setStyle(locationStyle(feature));

    this.clearAlertBreadcrumbs();

    // Xử lý các tác vụ cần thiết sau khi feature được chọn
    this.processSelectedFeature(feature);
    if (isUpdateLastBreadcrumb) {
      this.updateLastBreadcrumb(feature);
    } else if (isAutoUpdateBreadCrumb) {
      this.updateBreadcrumb(feature);
    }
    // Đánh dấu trạng thái đã thay đổi để Angular cập nhật view
    this.cdr.markForCheck();
  }

  handleSelectFeature(select: Select) {
    select.on('select', (event) => {
      const selectedFeatures = event.selected;

      if (selectedFeatures.length > 0) {
        const feature = selectedFeatures[0];
        // this.processSelectedFeature(feature);
        // this.updateBreadcrumb(feature);
        this.selectFeature(feature.get('id'));
      } else {
        if (this.selectedFeature)
          this.breadcrumbService.removeBreadcrumbById(
            this.selectedFeature.get('id'),
          );
        this.resetSelectedFeatureStyle();
      }
      this.cdr.markForCheck();
    });
  }

  handleDispatchMapStore(layerId: LayerIds) {
    // if (!selectedFeature) return;
    // const layerId = selectedFeature.layerId;
    switch (layerId) {
      case LayerIds.CORE:
        this.store.dispatch(MapStoreActions.loadCoreData());
        break;
      case LayerIds.BOUNDARY:
        this.store.dispatch(MapStoreActions.loadBoundaryData({}));
        break;
      case LayerIds.ACCESS_LEVEL_3:
        this.store.dispatch(
          MapStoreActions.loadAccessDataByBoundaryIdAndLevel({ level: 3 }),
        );
        break;
      case LayerIds.ACCESS_LEVEL_4:
        this.store.dispatch(
          MapStoreActions.loadAccessDataByBoundaryIdAndLevel({ level: 4 }),
        );
        break;
      case LayerIds.ACCESS_LEVEL_5:
        this.store.dispatch(
          MapStoreActions.loadAccessDataByBoundaryIdAndLevel({ level: 5 }),
        );
        break;
      default:
        this.store.dispatch(MapStoreActions.loadCoreData());
        break;
    }
  }

  private processSelectedFeature(feature: Feature) {
    this.resetSelectedFeatureStyle();
    const layerId = feature.get('layerId') as LayerIds;
    this.mapService.zoomToFeatureById(this.mapOl, feature.get('id'));
    this.updateSelectedFeature(feature, layerId);
  }

  private updateLastBreadcrumb(feature: Feature) {
    const layerId = feature.get('layerId') as LayerIds;
    const breadcrumb = {
      id: feature.get('id'),
      label: feature.get('name'),
      data: {
        layerId,
      },
    };
    this.breadcrumbService.updateLastBreadcrumb(breadcrumb);
  }

  private updateBreadcrumb(feature: Feature) {
    const layerId = feature.get('layerId') as LayerIds;
    const currentBreadcrumb = this.breadcrumbService
      .getCurrentBreadcrumbs()
      .at(-1);
    const breadcrumb = {
      id: feature.get('id'),
      label: feature.get('name'),
      data: {
        layerId,
      },
    };

    if (this.featureDataOnLegend?.layerId === currentBreadcrumb?.data?.layerId)
      this.breadcrumbService.updateCurrentBreadcrumb(breadcrumb);
    else {
      this.breadcrumbService.addBreadcrumb(breadcrumb);
    }
  }

  resetSelectedFeatureStyle() {
    if (!this.selectedFeature) return;
    this.selectedFeature.setStyle(
      this.mapService.styleCaches.get(this.selectedFeature.get('id')) ??
        this.mapService.defaultStyle,
    );

    this.featureDataOnLegend = undefined;
    this.selectedFeature = null;
  }

  setFeatureData(feature: any, layer: LayerIds): FeatureDisplayData {
    return {
      id: feature.get('id'),
      name: feature.get('name'),
      code: feature.get('code'),
      foreignCode: feature.get('foreignCode'),
      unitPath: feature.get('unitPath'),
      icon: feature.get('icon') || null,
      layerId: layer,
    };
  }

  updateSelectedFeature(feature: any, layer: LayerIds) {
    this.featureDataOnLegend = this.setFeatureData(feature, layer);
    this.selectedFeature = feature;

    if (this.featureDataOnLegend.unitPath && isAccessLayer(layer)) {
      this.unitPathToParent$ = this.store.select(
        selectUnitPathToParent(this.featureDataOnLegend.unitPath),
      );
    }
  }

  closePanel() {
    this.setTemplate(TemplateId.none);
  }

  setTemplate(template: TemplateId) {
    this.currentTemplate = template;
    if (template === TemplateId.overview) {
      this.showAllPanels();
    }
  }

  // Close the left panel
  closeLeftPanel(): void {
    this.isLeftPanelVisible = false;
  }

  // Close the right panel
  closeRightPanel(): void {
    this.isRightPanelVisible = false;
  }

  viewUnitDetail(selectedFeature: FeatureDisplayData) {
    const path = selectedFeature.unitPath;
    const name = selectedFeature.name;

    if (!path || !name) return;
    this.socket.sendBroadcastChannel({
      type: EventId.UNIT,
      data: {
        unit_path: path,
        unit_name: name,
      },
    });
  }
}
