import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrativeMapService } from '../../../services/administrative-map.service';
import { LegendOnMapComponent } from '../legend-on-map/legend-on-map.component';
import { DeviceStats } from '../../../models/geographical-coordinates';
import { Feature, Map as MapOl } from 'ol';
import { UnitTreeFilter } from '../../../models/unit-tree-filter';
import { UnitTree } from '../../../models/unit-tree';
import { PayloadChannel } from '../../../models/payload-channel';
import { DeviceCount } from '../../../models/device-count';
import { InfoStatsOnMap } from '../../../models/info-stats-on-map';
import { DeviceType, SocketEventType } from '../../../models/utils-type';
import { SecurityEvent } from '../../../models/security-event';
import { map } from 'rxjs/operators';
import { from, Observable, Subscription } from 'rxjs';
import { MapArea, TCTTTargetType } from '../../../models/btth.type';
import { Constant } from '../../../../../core/config/constant';
import { RegionMap } from '../../../models/btth.interface';
import {
  BCTTRouter,
  BCTTRouterDto,
  SecurityEventCountDto,
} from '../../../models/btth.dto';
import { Point } from 'ol/geom';
import { Icon, Style, Fill, Circle as CircleStyle, Stroke } from 'ol/style';
import { OSM, Vector as SVector } from 'ol/source';
import { Tile, Vector as LVector } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import { TCMLegendOnMapComponent } from '../tcm-legend-on-map/tcm-legend-on-map.component';
import { TCMDetailLegendOnMapComponent } from '../tcm-detail-legend-on-map/tcm-detail-legend-on-map.component';
import { TargetDetailLegendOnMapComponent } from '../target-detail-legend-on-map/target-detail-legend-on-map.component';
import { DataDetailLegendOnMapComponent } from '../data-detail-legend-on-map/data-detail-legend-on-map.component';
import { VktbDetailLegendOnMapComponent } from '../vktb-detail-legend-on-map/vktb-detail-legend-on-map.component';
import { MethodDetailLegendOnMapComponent } from '../method-detail-legend-on-map/method-detail-legend-on-map.component';
import { SupabaseService } from '../../../services/supabase.service';
import { InformationTargetComponent } from '../information-target/information-target.component';
import { CYBER_MAP_COLOR } from './tcm-map.interface';
import { IData, StateService } from '../../../services/state.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { layersConfig } from '../../../utils/geo-layers';

interface Router {
  id: number | string;
  name: string;
  foreignId?: number | string;
  long: number;
  lat: number;
}
export interface ChildNode {
  key: string;
  name: string;
}

export interface ParentNode {
  id: string;
  index: string;
  code: string;
  unit: string;
  target: string;
  count: string;
  coordinate: number[];
  children: ChildNode[];
  expand?: boolean;
}
@Component({
  selector: 'app-tcm-map',
  standalone: true,
  imports: [
    CommonModule,
    LegendOnMapComponent,
    TCMLegendOnMapComponent, //Legend TCM on MAP of t5
    TCMDetailLegendOnMapComponent, //Detail Legend TCM on MAP of t5
    TargetDetailLegendOnMapComponent, //Target Detail Legend TCM on MAP of t5
    DataDetailLegendOnMapComponent, //Data Detail Legend TCM on MAP of t5
    VktbDetailLegendOnMapComponent, //VKTB Detail Legend TCM on MAP of t5
    MethodDetailLegendOnMapComponent, //KTTC Detail Legend TCM on MAP of t5
    InformationTargetComponent,
  ],
  templateUrl: './tcm-map.component.html',
  styleUrls: ['./tcm-map.component.scss'],
})
export class TCMMapComponent implements OnInit, AfterViewInit {
  private supabase = inject(SupabaseService);

  get selectedArea(): MapArea {
    return this._selectedArea;
  }

  @Input() set selectedArea(value: MapArea) {
    this._selectedArea = value;
    const region = this.regions[value];
    this.administrativeMap.setView(region.center, region.zoom);
  }

  private _selectedArea: MapArea = 'all';

  @Input() mapId: string = 'tcm-map';

  isWarning: boolean = false;
  private intervalId: any;

  bcttRouters: BCTTRouterDto[];
  coreRouter: Router[];
  boundaryRouter: Required<Router>[];
  accessRouter: Required<Router>[];

  //mock data
  data: any[] = [
    {
      id: 'id01',
      index: '1',
      code: 'TT186',
      unit: 'Trung tâm 1',
      desc: '',
      desc_weapon: '',
      desc_unit: '',
      desc_report: '',
      desc_technical: '',
      force: '',
      used: '',
      coordinate: [105.78825223118932, 21.07795609397116],
      children: [],
    },
    {
      id: 'id02',
      index: '2',
      code: 'TT286',
      unit: 'Trung tâm 2',
      desc: '',
      desc_weapon: '',
      desc_unit: '',
      desc_report: '',
      desc_technical: '',
      force: '',
      used: '',
      coordinate: [106.629664, 10.823099],
      children: [],
    },
    {
      id: 'id03',
      index: '3',
      code: 'TT386',
      unit: 'Trung tâm 3',
      desc: '',
      desc_weapon: '',
      desc_unit: '',
      desc_report: '',
      desc_technical: '',
      force: '',
      used: '',
      coordinate: [108.202167, 16.047079],
      children: [],
    },
    {
      id: 'id04',
      index: '4',
      code: 'TT586',
      unit: 'Trung tâm 5',
      desc: '',
      desc_weapon: '',
      desc_unit: '',
      desc_report: '',
      desc_technical: '',
      force: '',
      used: '',
      coordinate: [105.8429910221332, 21.032069602852477],
      children: [],
    },
  ];
  description: SafeHtml;
  // _sub_desc = `LL: CMF (<span style="color: green; font-weight: 700">CURRENT_UNIT</span>/TOTAL_UNIT); MT: TARGET (<span style="color: green; font-weight: 700">CURRENT_TARGET</span>/TOTAL_TARGET); DL: <span style="color: green; font-weight: 700">TOTAL_REPORT</span> Báo cáo; VKTB: <span style="color: green; font-weight: 700">CURRENT_WEAPON</span>/TOTAL_WEAPON; KT: <span style="color: green; font-weight: 700">CURRENT_TECH</span>/TOTAL_TECH`;
  _sub_desc = `LL: CMF (<span style="color: green; font-weight: 700">CURRENT_UNIT</span>/TOTAL_UNIT); MT: TARGET (<span style="color: green; font-weight: 700">CURRENT_TARGET</span>/TOTAL_TARGET); DL: <span style="color: green; font-weight: 700">TOTAL_REPORT</span> Báo cáo.`;

  //variable to binding
  detail: any[]; //don_vi
  target_category: any[] = []; //muc_tieu
  data_category: any[] = []; //du_lieu
  vktb_category: any[] = []; //vktb
  kttc_category: any[] = []; //ky_

  //temporary variables
  _detail: any[];
  _target_category: any[] = [];
  _data_category: any[] = [];
  _vktb_category: any[] = [];
  _kttc_category: any[] = [];

  information_target: any = {};

  layerPromise: Promise<any>;
  unitPromise: Promise<any>;
  noLegendPromise: Promise<any>;

  channel$: Observable<any>;
  mapOl: MapOl;
  regions: RegionMap;
  size: Number;
  ttfeatures: Feature[];
  cmffeatures: Feature[];
  targetfeatures: Feature[];

  unitTreeFields = new UnitTreeFilter();

  private administrativeMap = inject(AdministrativeMapService);
  private cdr = inject(ChangeDetectorRef);

  constructor(
    private stateService: StateService,
    private sanitizer: DomSanitizer,
  ) {
    //this.supabase.signIn().then();
    this.ttfeatures = [];
    this.cmffeatures = [];
    this.targetfeatures = [];
    this.information_target = null;

    this.description = '';
    this.regions = {
      all: {
        center: [105.5, 16.0],
        zoom: Constant.DEFAULT_VIEW.ZOOM,
      },
      north: {
        center: [105.83416, 21.027764],
        zoom: 8,
      }, // Hanoi, Vietnam
      central: {
        center: [108.202167, 16.047079],
        zoom: 8,
      }, // Da Nang, Vietnam
      south: {
        center: [106.629664, 10.823099],
        zoom: 8,
      }, // Ho Chi Minh City, Vietnam
    };
  }
  subscription: Subscription;
  test$: Observable<any>;

  ngOnInit(): void {
    this.unitTreeFields.rootPath = '728.724';
    this.unitTreeFields.level = 3;

    this.administrativeMap.generateFeatureStyle();
    this.intervalId = setInterval(() => {
      this.toggleLayerVisibilitySequentially();
    }, 500);

    this.channel$ = this.administrativeMap.payloadChannel$.pipe(
      map((channelData) => {
        const payload = channelData.payload as PayloadChannel;
        const type = payload.socketEventType;
        const data = payload.data;
        this.administrativeMap.generateFeatureStyle(type);
        this.clearSources();

        switch (type) {
          case 'ROUTER':
            this.layerPromise = this.loadCoreLayer();
            // this.layerPromise = this.loadCoreLayer();
            break;
          case 'ALERT':
            this.noLegendPromise = this.loadBCTTRouter('728.724').then(
              (routers) => {
                this.coreRouter = [
                  ...new Set(
                    routers.map((item) => {
                      return {
                        id: item.idloi,
                        name: item.tenloi,
                        long: item.longloi,
                        lat: item.latloi,
                      };
                    }),
                  ),
                ];
                this.administrativeMap.displayRouterFeatures(
                  this.coreRouter as unknown as DeviceStats[],
                  this.administrativeMap.coreSource,
                  this.administrativeMap.coreLayer,
                );
              },
            );
            this.intervalId = setInterval(() => {
              this.toggleLayerVisibilitySequentially();
            }, 500);
            break;
          case 'TCTT':
            if (!data || !data.tctt) break;
            this.noLegendPromise = this.loadTargets(data.tctt.type);
            break;
          default:
            this.unitPromise = this.loadUnits(this.unitTreeFields, type);
            break;
        }
      }),
    );

    this.subscription = this.stateService.viewDetail$.subscribe(
      (data: IData | null) => {
        this.target_category = this._target_category.filter(
          (item: any) => item.cyber_code === data?.cyber_code,
        );
        this.data_category = this._data_category.filter(
          (item: any) => item.cyber_code === data?.cyber_code,
        );
        this.detail = this._detail.filter(
          (item: any) => item.cyber_code === data?.cyber_code,
        );
        this.kttc_category = this._kttc_category.filter(
          (item: any) => item.cyber_code === data?.cyber_code,
        );
        this.vktb_category = this._vktb_category.filter(
          (item: any) => item.cyber_code === data?.cyber_code,
        );
      },
    );

    ///////////////
    //sample

    // vector source, vector layer is default
    const point = new Point([21.027764, 105.83416]);
    const icon = new Icon({
      anchor: [0, 0],
      anchorYUnits: 'fraction',
      anchorXUnits: 'fraction',
      width: 50,
      height: 50,
      src: Constant.DEFAULT.TCM.CMF1,
    });
    const iconStyle = new Style({
      image: icon,
    });

    const feature = new Feature({
      geometry: point,
    });
    feature.set('id', '12312312');
    feature.set('name', 'ABC');
    feature.setStyle(iconStyle);

    this.administrativeMap.vectorSource.addFeature(feature);
    //////////////

    this.getTcmTarget();
    this.getTcmReport();
    this.test$ = from(this.getTcmUnit());
    // this.test$ = from(this.getTcmWeapon());
    // this.test$ = from(this.getTcmTechnical());
    // this.updateViewMap();
  }

  promiseToNull(): Promise<null> {
    return Promise.resolve(null).finally(() => this.cdr.markForCheck());
  }
  clearSources(): void {
    this.administrativeMap.clearSources();
    this.unitPromise = this.promiseToNull();
    this.layerPromise = this.promiseToNull();
    this.noLegendPromise = this.promiseToNull();
    clearInterval(this.intervalId);
  }

  generateIcon(code: string): string {
    let src = '';
    switch (code) {
      case 'TT186':
        return Constant.DEFAULT.TCM.TT1;
      case 'TT286':
        return Constant.DEFAULT.TCM.TT2;
      case 'TT386':
        return Constant.DEFAULT.TCM.TT3;
      case 'TT586':
        return Constant.DEFAULT.TCM.TT5;
      default:
        return src;
    }
  }

  ngAfterViewInit() {
    this.mapOl = this.administrativeMap.map;
    this.mapOl.setTarget(this.mapId);
    this.administrativeMap.showTooltipWhenHover();
    this.administrativeMap.generateRouterLayers();
    this.administrativeMap.generateAlertLayers();

    this.handleClickOnRouter();
    this.mapOl
      .getView()
      .on('change:center', () => this.updateMapInfo(this.mapOl));

    const iconSize = 100;
    this.data.map((item, index) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(item.coordinate)),
      });
      feature.setStyle(
        new Style({
          image: new Icon({
            width: iconSize,
            height: iconSize,
            src: this.generateIcon(item.code),
          }),
        }),
      );
      feature.setProperties({
        coordinate: item.coordinate,
      });
      feature.setId(item.id);
      this.ttfeatures.push(feature);
    });
  }

  updateViewMap(): void {
    // Tạo một vector layer cho các feature
    const vectorSource = new SVector({
      features: [
        ...this.ttfeatures,
        ...this.cmffeatures,
        ...this.targetfeatures,
      ],
    });
    const vectorLayer = new LVector({ source: vectorSource });
    this.mapOl.setLayers([
      layersConfig.VIETNAM_MOSAIC, // TODO: Fix - đăng ký layer nhiều lần
      vectorLayer,
      // polylineLayer,
    ]);
  }

  updateMapInfo(map: MapOl): void {
    // console.log(map.getView());
  }

  handleClickOnRouter() {
    this.mapOl.on('click', (event) => {
      this.mapOl.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
        const coordinate = fromLonLat(feature.get('coordinate'));
        const detail = feature.get('detail');
        this.information_target = true;
        const map = this.administrativeMap.map;
        const view = map.getView();
        view.animate({
          center: coordinate,
          zoom: 12,
          duration: 1000,
        });
      });
    });
  }

  loadUnits(
    unitTreeFilter: UnitTreeFilter,
    type: SocketEventType,
  ): Promise<InfoStatsOnMap[]> {
    let unitTreeMap = new Map();
    return this.administrativeMap
      .getUnitTree(unitTreeFilter)
      .then((unitTree) => {
        this.administrativeMap.displayUnitFeatures(
          unitTree,
          this.administrativeMap.vectorSource,
        );
        return unitTree;
      })
      .then((unitTree: UnitTree[]) => {
        unitTree.forEach((item) => {
          unitTreeMap.set(item.path, item);
        });
        return this.administrativeMap.countDeviceByUnitFrom(
          unitTreeFilter.rootPath!,
        );
      })
      .then((deviceStatsMap: DeviceCount[]) => {
        const result: InfoStatsOnMap[] = [];
        for (const deviceStats of deviceStatsMap) {
          if (
            unitTreeMap.has(deviceStats.unitPath) &&
            deviceStats.type === type
          ) {
            const unit = unitTreeMap.get(deviceStats.unitPath) as UnitTree;
            const device: InfoStatsOnMap = {
              name: unit.name,
              unitPath: unit.path,
              type: deviceStats.type,
              count: deviceStats.count,
              long: unit.long,
              lat: unit.lat,
            };
            result.push(device);
          }
        }

        return result;
      });
  }

  loadAlerts(unitTreeFilter: UnitTreeFilter): Promise<InfoStatsOnMap[]> {
    let unitTreeMap = new Map();
    return this.administrativeMap
      .getUnitTree(unitTreeFilter)
      .then((unitTree) => {
        this.administrativeMap.displayUnitFeatures(
          unitTree,
          this.administrativeMap.unitSource,
        );
        this.administrativeMap.displayAlertFeatures(unitTree);
        return unitTree;
      })
      .then((unitTree: UnitTree[]) => {
        unitTree.forEach((item) => {
          unitTreeMap.set(item.path, item);
        });
        return this.administrativeMap.countSecurityEventByUnitFrom(
          unitTreeFilter.rootPath!,
          new Date('2020-01-01'),
        );
      })
      .then((stats: SecurityEvent[]) => {
        const result: InfoStatsOnMap[] = [];
        if (stats.length === 0) {
          return result;
        }
        const aggregation = this.aggregateSecurity(stats);
        for (const item of stats) {
          if (unitTreeMap.has(item.unitPath)) {
            const unit = unitTreeMap.get(item.unitPath) as UnitTree;
            const device: InfoStatsOnMap = {
              name: unit.name,
              unitPath: unit.path,
              count: aggregation.get(unit.path) ?? 0,
              long: unit.long,
              lat: unit.lat,
            };
            result.push(device);
          }
        }

        return result;
      });
  }

  toggleLayerVisibilitySequentially() {
    this.isWarning = !this.isWarning;
    // this.administrativeMap.alertLayer.setVisible(this.isWarning);
  }

  aggregateSecurity(data: SecurityEvent[]): Map<string, number> {
    return data.reduce((acc: Map<string, number>, { unitPath, count }) => {
      acc.set(unitPath, (acc.get(unitPath) || 0) + count);
      return acc;
    }, new Map<string, number>());
  }

  loadCoreLayer(): Promise<DeviceStats[]> {
    return this.administrativeMap
      .loadFeatureByLayerType('core')
      .then((data) => {
        this.administrativeMap.displayRouterFeatures(
          data,
          this.administrativeMap.coreSource,
          this.administrativeMap.coreLayer,
        );
        return data;
      })
      .finally(() => this.cdr.markForCheck());
  }

  loadBoundaryLayer(coreLayerId: string): Promise<DeviceStats[]> {
    return this.administrativeMap
      .loadFeatureByLayerType('boundary', coreLayerId)
      .then((data) => {
        this.administrativeMap.saveState('core', coreLayerId, data);
        this.administrativeMap.displayRouterFeatures(
          data,
          this.administrativeMap.boundarySource,
          this.administrativeMap.boundaryLayer,
        );
        return data;
      })
      .finally(() => this.cdr.markForCheck());
  }

  loadAccessLayer(boundaryLayerId: string): Promise<DeviceStats[]> {
    return this.administrativeMap
      .loadFeatureByLayerType('access', boundaryLayerId)
      .then((data) => {
        this.administrativeMap.saveState('boundary', boundaryLayerId, data);
        this.administrativeMap.displayRouterFeatures(
          data,
          this.administrativeMap.accessSource,
          this.administrativeMap.accessLayer,
        );
        return data;
      })
      .finally(() => this.cdr.markForCheck());
  }

  goBack(): void {
    const previousState = this.administrativeMap.loadPreviousState();
    if (previousState) {
      const source =
        previousState.layer === 'core'
          ? this.administrativeMap.coreSource
          : previousState.layer === 'boundary'
          ? this.administrativeMap.boundarySource
          : this.administrativeMap.accessSource;
      const layer =
        previousState.layer === 'core'
          ? this.administrativeMap.coreLayer
          : previousState.layer === 'boundary'
          ? this.administrativeMap.boundaryLayer
          : this.administrativeMap.accessLayer;
      this.administrativeMap.displayRouterFeatures(
        previousState.layerData,
        source,
        layer,
      );
    }
  }

  loadTargets(type: TCTTTargetType) {
    return this.administrativeMap.getTCTTTargetsByType(type).then((data) => {
      if (!data) return [];
      data.forEach((item) => {
        if (item.longitude && item.latitude) {
          const feature = this.administrativeMap.generateFeature([
            item.longitude,
            item.latitude,
          ]);
          feature.set('name', item.name);
          feature.setStyle(this.administrativeMap.pointStyle);
          this.administrativeMap.tcttSource.addFeature(feature);
        }
      });

      return data;
    });
  }

  loadBCTTRouter(path: string) {
    let routers: BCTTRouter[];
    let events: SecurityEventCountDto[];
    return this.administrativeMap
      .getBCTTRouter()
      .then((data: BCTTRouter[] | undefined) => {
        routers = data ?? [];
        return data;
      })
      .then(() => {
        return this.administrativeMap.countSecurityEventByUnitFrom(
          path,
          new Date('2020-01-01'),
        );
      })
      .then((events: SecurityEvent[]) => {
        if (routers.length === 0 || events.length === 0) return [];
        const violatedUnitPath = [
          ...new Set(events.map((item) => item.unitPath)),
        ];
        return routers.filter((item) => {
          return (
            item.upath &&
            item.uparentpath &&
            violatedUnitPath.includes(item.uparentpath)
          );
        });
      })
      .then((data) => {
        this.bcttRouters = data;
        this.coreRouter = [
          ...new Set(
            data.map((item: BCTTRouter): Router => {
              return {
                id: item.idloi,
                name: item.tenloi,
                long: item.longloi,
                lat: item.latloi,
              };
            }),
          ),
        ];
        this.boundaryRouter = [
          ...new Set(
            data.map((item: BCTTRouter): Required<Router> => {
              return {
                id: item.idbien,
                name: item.tenbien,
                foreignId: item.idloi,
                long: item.longbien,
                lat: item.latbien,
              };
            }),
          ),
        ];
        this.accessRouter = [
          ...new Set(
            data.map((item: BCTTRouter): Required<Router> => {
              return {
                id: item.upath!,
                name: item.uname,
                foreignId: item.idbien,
                long: item.ulong,
                lat: item.ulat,
              };
            }),
          ),
        ];

        this.administrativeMap.displayRouterFeatures(
          this.coreRouter as unknown as DeviceStats[],
          this.administrativeMap.coreSource,
          this.administrativeMap.coreLayer,
        );
        this.administrativeMap.displayAlertFeatures(
          this.coreRouter as UnitTree[],
        );
        return data;
      });
  }

  loadBoundaryRouter(coreId: number) {
    const routers = this.boundaryRouter.filter(
      (item) => item.foreignId === coreId,
    );
    // routers.forEach(item => {
    //   const feature = this.administrativeMap.generateFeature([item.long, item.lat]);
    //   feature.set('id', item.id);
    //   feature.set('name', item.name);
    //   feature.setStyle(this.administrativeMap.currentStyle);
    //   this.administrativeMap.boundarySource.addFeature(feature);
    // })
    this.administrativeMap.displayRouterFeatures(
      routers as unknown as DeviceStats[],
      this.administrativeMap.boundarySource,
      this.administrativeMap.boundaryLayer,
    );
    this.administrativeMap.displayAlertFeatures(
      routers as unknown as UnitTree[],
    );
  }

  async getTcmTarget() {
    var sp = this.supabase.getSp();
    const { data, error } = await sp.rpc('get_tcm_targets_with_children');
    if (error) {
      console.error('Error fetching data from Supabase:', error);
      this.target_category = [];
    }

    let btl_current = 0;
    let btl_total = 0;

    data.forEach((each: any) => {
      each.current_force = 0;
      each.total_force = 0;
      each.children.forEach((child: any) => {
        each.total_force += 1;
        if (child.status === true) each.current_force += 1;
      });

      btl_current += each.current_force;
      btl_total += each.total_force;
    });

    // console.log('btl: ', btl_current + '/' + btl_total);
    try {
      this._sub_desc = this._sub_desc.replace('TARGET', data.length.toString());
      this._sub_desc = this._sub_desc.replace(
        'CURRENT_TARGET',
        btl_current.toString(),
      );
      this._sub_desc = this._sub_desc.replace(
        'TOTAL_TARGET',
        btl_total.toString(),
      );
      this.description = this.sanitizer.bypassSecurityTrustHtml(this._sub_desc);
    } catch (error) {
      console.error('An error occurred:', error);
    }

    this._target_category = data;
    this.target_category = data;

    this.data.forEach((element) => {
      if (element.code == 'TT186') {
        this.target_category.forEach((item) => {
          if (item.cyber_code == 'TT186') {
            this.setMucTieu(item, element, '1-2');
          }
        });
      } else if (element.code == 'TT286') {
        this.target_category.forEach((item) => {
          if (item.cyber_code == 'TT286') {
            this.setMucTieu(item, element, '1-2');
          }
        });
      } else if (element.code == 'TT386') {
        this.target_category.forEach((item) => {
          if (item.cyber_code == 'TT386') {
            this.setMucTieu(item, element, '1-2');
          }
        });
      } else if (element.code == 'TT586') {
        this.target_category.forEach((item) => {
          if (item.cyber_code == 'TT586') {
            this.setMucTieu(item, element, '1-2');
          }
        });
      }
    });
    data.map((item: any, index: number) => {
      item?.children?.map((ele: any, i: number) => {
        const lat = ele.lat;
        const lon = ele.lon;
        const _color =
          ele?.cyber_code == 'TT186'
            ? 'rgba(165, 209, 138, 0.6)'
            : ele?.cyber_code == 'TT286'
            ? 'rgba(255, 63, 255, 0.6)'
            : ele?.cyber_code == 'TT386'
            ? 'rgba(81, 119, 255, 0.6)'
            : 'rgba(0, 255, 255, 0.6)';
        const feature = new Feature({
          geometry: new Point(fromLonLat([lat, lon])),
        });
        // feature.setStyle(
        //   new Style({
        //     image: new Icon({
        //       width: 60,
        //       height: 60,
        //       src: Constant.DEFAULT.TCM.LOCATION,
        //       //@ts-ignore
        // color: CYBER_MAP_COLOR[ele?.cyber_code],
        //     }),
        //   }),
        // );
        feature.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 10,
              fill: new Fill({
                color: _color,
              }),
              stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0.8)',
                width: 2,
              }),
            }),
          }),
        );
        feature.set('name', ele.name);
        feature.setProperties({
          detail: ele,
          coordinate: [lat, lon],
        });
        this.targetfeatures.push(feature);
      });
    });
    this.updateViewMap();
  }

  setMucTieu(item: any, element: any, _id: string) {
    element.desc +=
      (element.desc.length == 0 ? '' : ', ') +
      item.name +
      ' (' +
      item.total_force +
      ')';
    let notContaint: boolean = false;
    element.children.forEach((child: any) => {
      if (child.id == _id) {
        notContaint = true;
        child.desc = element.desc;
        child.current_force += item.current_force;
        child.total_force += item.total_force;
        child.total = child.current_force + '/' + child.total_force;
        element.used = child.current_force + '/' + child.total_force;
      }
    });
    if (!notContaint) {
      element.children.push({
        id: _id,
        name: 'Mục tiêu',
        type: 'muctieu',
        desc: element.desc,
        current_force: item.current_force,
        total_force: item.total_force,
        total: item.current_force + '/' + item.total_force,
        used: item.current_force + '/' + item.total_force,
        cyber_code: item.cyber_code,
      });
      element.used = item.current_force + '/' + item.total_force;
    }
  }

  async getTcmReport() {
    var sp = this.supabase.getSp();
    const { data, error } = await sp.rpc('get_tcm_reports_with_children');
    if (error) {
      console.error('Error fetching data from Supabase:', error);
      this.data_category = [];
    }

    let btl_current = 0;

    data.forEach((each: any) => {
      each.count = 0;
      each.count_post_fix = 'Báo cáo';
      each.volume = 0;
      each.volume_post_fix = 'GB';
      each.children.forEach((child: any) => {
        if (child.post_fix == each.count_post_fix) each.count += child.count;
        if (child.post_fix == each.volume_post_fix) each.volume += child.count;
      });
      btl_current += each.count;
    });

    try {
      this._sub_desc = this._sub_desc.replace(
        'TOTAL_REPORT',
        btl_current.toString(),
      );
      this.description = this.sanitizer.bypassSecurityTrustHtml(this._sub_desc);
    } catch (error) {
      console.error('An error occurred:', error);
    }

    this.data_category = data;
    // console.log('Báo cáo: ', data);

    this.data.forEach((element) => {
      if (element.code == 'TT186') {
        this.data_category.forEach((item) => {
          if (item.cyber_code == 'TT186') {
            this.setBaoCao(item, element, '1-3');
          }
        });
      } else if (element.code == 'TT286') {
        this.data_category.forEach((item) => {
          if (item.cyber_code == 'TT286') {
            this.setBaoCao(item, element, '1-3');
          }
        });
      } else if (element.code == 'TT386') {
        this.data_category.forEach((item) => {
          if (item.cyber_code == 'TT386') {
            this.setBaoCao(item, element, '1-3');
          }
        });
      } else if (element.code == 'TT586') {
        this.data_category.forEach((item) => {
          if (item.cyber_code == 'TT586') {
            this.setBaoCao(item, element, '1-3');
          }
        });
      }
    });
  }

  setBaoCao(item: any, element: any, _id: string) {
    element.desc_report +=
      (element.desc_report.length == 0 ? '' : ', ') +
      item.name +
      ' (' +
      item.count + ' ' + item.count_post_fix + ', ' +
      item.volume + ' ' + item.volume_post_fix +
      ')';

    let notContaint: boolean = false;
    element.children.forEach((child: any) => {
      if (child.id == _id) {
        notContaint = true;
        child.desc = element.desc_report;
        child.count += item.count;
        child.total = child.count + ' ' + item.post_fix;
      }
    });
    if (!notContaint) {
      element.children.push({
        id: _id,
        name: 'Dữ liệu',
        type: 'dulieu',
        desc: element.desc_report,
        count: item.count,
        total: item.count + ' ' + item.post_fix,
        cyber_code: item.cyber_code,
      });
    }
  }

  async getTcmUnit() {
    var sp = this.supabase.getSp();
    const { data, error } = await sp.rpc('get_tcm_units_with_children');
    if (error) {
      console.error('Error fetching data from Supabase:', error);
      this.detail = [];
    }

    let btl_current = 0;
    let btl_total = 0;

    data.forEach((each: any) => {
      each.current_force = 0;
      each.current_officer = 0;
      each.current_professional_officer = 0;
      each.total_force = 0;
      each.total_officer = 0;
      each.total_professional_officer = 0;
      each.children.forEach((child: any) => {
        each.current_force += child.current_force;
        each.current_officer += child.current_officer;
        each.current_professional_officer += child.current_professional_officer;
        each.total_force += child.total_force;
        each.total_officer += child.total_officer;
        each.total_professional_officer += child.total_professional_officer;
      });
      each.detail =
        'SQ: ' +
        each.current_officer +
        '/' +
        each.total_officer +
        '; ' +
        'QNCN: ' +
        each.current_professional_officer +
        '/' +
        each.total_professional_officer;
      btl_current += each.current_force;
      btl_total += each.total_force;
    });

    try {
      this._sub_desc = this._sub_desc.replace(
        'CMF',
        data.length.toString() + 'CMF',
      );
      this._sub_desc = this._sub_desc.replace(
        'CURRENT_UNIT',
        btl_current.toString(),
      );
      this._sub_desc = this._sub_desc.replace(
        'TOTAL_UNIT',
        btl_total.toString(),
      );
      this.description = this.sanitizer.bypassSecurityTrustHtml(this._sub_desc);
    } catch (error) {
      console.error('An error occurred:', error);
    }

    this.detail = data;
    this._detail = data;

    this.data.forEach((element) => {
      if (element.code == 'TT186') {
        this.detail.forEach((item) => {
          if (item.cyber_code == 'TT186') {
            this.setLucLuong(item, element, '1-1');
          }
        });
      } else if (element.code == 'TT286') {
        this.detail.forEach((item) => {
          if (item.cyber_code == 'TT286') {
            this.setLucLuong(item, element, '1-1');
          }
        });
      } else if (element.code == 'TT386') {
        this.detail.forEach((item) => {
          if (item.cyber_code == 'TT386') {
            this.setLucLuong(item, element, '1-1');
          }
        });
      } else if (element.code == 'TT586') {
        this.detail.forEach((item) => {
          if (item.cyber_code == 'TT586') {
            this.setLucLuong(item, element, '1-1');
          }
        });
      }
    });
  }

  setLucLuong(item: any, element: any, _id: string) {
    element.desc_unit +=
      (element.desc_unit.length == 0 ? '' : ', ') +
      item.name +
      ' (' +
      item.current_force +
      '/' +
      item.total_force +
      ')';
    let notContaint: boolean = false;
    element.children.forEach((child: any) => {
      if (child.id == _id) {
        notContaint = true;
        child.desc = element.desc_unit;
        child.current_force += item.current_force;
        child.total_force += item.total_force;
        child.total = child.current_force + '/' + child.total_force;
        element.force = child.current_force + '/' + child.total_force;
      }
    });
    if (!notContaint) {
      element.children.push({
        id: _id,
        name: 'Lực lượng',
        type: 'lucluong',
        desc: element.desc_unit,
        current_force: item.current_force,
        total_force: item.total_force,
        total: item.current_force + '/' + item.total_force,
        force: item.current_force + '/' + item.total_force,
        cyber_code: item.cyber_code,
      });
      element.force = item.current_force + '/' + item.total_force;
    }
  }

  async getTcmWeapon() {
    var sp = this.supabase.getSp();
    const { data, error } = await sp.rpc('get_tcm_weapons_with_children');
    if (error) {
      console.error('Error fetching data from Supabase:', error);
      this.vktb_category = [];
    }

    let btl_current = 0;
    let btl_total = 0;

    data.forEach((each: any) => {
      each.current_force = 0;
      each.total_force = 0;
      each.children.forEach((child: any) => {
        each.total_force += 1;
        if (child.status === true) each.current_force += 1;
      });
      btl_current += each.current_force;
      btl_total += each.total_force;
    });

    try {
      this._sub_desc = this._sub_desc.replace(
        'CURRENT_WEAPON',
        btl_current.toString(),
      );
      this._sub_desc = this._sub_desc.replace(
        'TOTAL_WEAPON',
        btl_total.toString(),
      );
      this.description = this.sanitizer.bypassSecurityTrustHtml(this._sub_desc);
    } catch (error) {
      console.error('An error occurred:', error);
    }

    this.vktb_category = data;
    this._vktb_category = data;

    this.data.forEach((element) => {
      if (element.code == 'TT186') {
        this.vktb_category.forEach((item) => {
          if (item.cyber_code == 'TT186') {
            this.setVKTB(item, element, '1-4');
          }
        });
      } else if (element.code == 'TT286') {
        this.vktb_category.forEach((item) => {
          if (item.cyber_code == 'TT286') {
            this.setVKTB(item, element, '1-4');
          }
        });
      } else if (element.code == 'TT386') {
        this.vktb_category.forEach((item) => {
          if (item.cyber_code == 'TT386') {
            this.setVKTB(item, element, '1-4');
          }
        });
      } else if (element.code == 'TT586') {
        this.vktb_category.forEach((item) => {
          if (item.cyber_code == 'TT586') {
            this.setVKTB(item, element, '1-4');
          }
        });
      }
    });
  }

  setVKTB(item: any, element: any, _id: string) {
    element.desc_weapon +=
      (element.desc_weapon.length == 0 ? '' : ', ') +
      item.name +
      ' (' +
      item.current_force +
      '/' +
      item.total_force +
      ')';
    let notContaint: boolean = false;
    element.children.forEach((child: any) => {
      if (child.id == _id) {
        notContaint = true;
        child.desc = element.desc_weapon;
        child.current_force += item.current_force;
        child.total_force += item.total_force;
        child.total = child.current_force + '/' + child.total_force;
      }
    });
    if (!notContaint) {
      element.children.push({
        id: _id,
        name: 'VKTB',
        type: 'vktb',
        desc: element.desc_weapon,
        current_force: item.current_force,
        total_force: item.total_force,
        total: item.current_force + '/' + item.total_force,
        cyber_code: item.cyber_code,
      });
    }
  }

  async getTcmTechnical() {
    var sp = this.supabase.getSp();
    const { data, error } = await sp.rpc('get_tcm_technicals_with_children');
    if (error) {
      console.error('Error fetching data from Supabase:', error);
      this.kttc_category = [];
    }

    let btl_current = 0;
    let btl_total = 0;

    data.forEach((each: any) => {
      each.current_force = 0;
      each.total_force = 0;
      each.children.forEach((child: any) => {
        each.total_force += 1;
        if (child.status === true) each.current_force += 1;
      });
      btl_current += each.current_force;
      btl_total += each.total_force;
    });

    try {
      this._sub_desc = this._sub_desc.replace(
        'CURRENT_TECH',
        btl_current.toString(),
      );
      this._sub_desc = this._sub_desc.replace(
        'TOTAL_TECH',
        btl_total.toString(),
      );
      this.description = this.sanitizer.bypassSecurityTrustHtml(this._sub_desc);
    } catch (error) {
      console.error('An error occurred:', error);
    }

    this.kttc_category = data;
    this._kttc_category = data;

    this.data.forEach((element) => {
      if (element.code == 'TT186') {
        this.kttc_category.forEach((item) => {
          if (item.cyber_code == 'TT186') {
            this.setKTTC(item, element, '1-5');
          }
        });
      } else if (element.code == 'TT286') {
        this.kttc_category.forEach((item) => {
          if (item.cyber_code == 'TT286') {
            this.setKTTC(item, element, '1-5');
          }
        });
      } else if (element.code == 'TT386') {
        this.kttc_category.forEach((item) => {
          if (item.cyber_code == 'TT386') {
            this.setKTTC(item, element, '1-5');
          }
        });
      } else if (element.code == 'TT586') {
        this.kttc_category.forEach((item) => {
          if (item.cyber_code == 'TT586') {
            this.setKTTC(item, element, '1-5');
          }
        });
      }
    });
  }

  setKTTC(item: any, element: any, _id: string) {
    element.desc_technical +=
      (element.desc_technical.length == 0 ? '' : ', ') +
      item.name +
      ' (' +
      item.current_force +
      '/' +
      item.total_force +
      ')';
    let notContaint: boolean = false;
    element.children.forEach((child: any) => {
      if (child.id == _id) {
        notContaint = true;
        child.desc = element.desc_technical;
        child.current_force += item.current_force;
        child.total_force += item.total_force;
        child.total = child.current_force + '/' + child.total_force;
      }
    });
    if (!notContaint) {
      element.children.push({
        id: _id,
        name: 'KTTC',
        type: 'kttc',
        desc: element.desc_technical,
        current_force: item.current_force,
        total_force: item.total_force,
        total: item.current_force + '/' + item.total_force,
        cyber_code: item.cyber_code,
      });
    }
  }

  loadAccessRouter(boundaryId: number) {
    const routers = this.accessRouter.filter(
      (item) => item.foreignId === boundaryId,
    );
    // routers.forEach(item => {
    //   const feature = this.administrativeMap.generateFeature([item.long, item.lat]);
    //   feature.set('id', item.id);
    //   feature.set('name', item.name);
    //   feature.setStyle(this.administrativeMap.currentStyle);
    //   this.administrativeMap.accessSource.addFeature(feature);
    // })
    this.administrativeMap.displayRouterFeatures(
      routers as unknown as DeviceStats[],
      this.administrativeMap.accessSource,
      this.administrativeMap.accessLayer,
    );
    this.administrativeMap.displayAlertFeatures(
      routers as unknown as UnitTree[],
    );
  }

  handleGoBack(): void {}
}
