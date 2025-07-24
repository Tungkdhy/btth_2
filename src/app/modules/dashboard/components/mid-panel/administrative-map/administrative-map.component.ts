import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeoService } from '../../../../digital-map/services/geo.service';
import { addCommon as addCommonProjections } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Constant } from '../../../../../core/config/constant';
import { LegendOnMapComponent } from '../legend-on-map/legend-on-map.component';

@Component({
  selector: 'app-administrative-map',
  standalone: true,
  imports: [CommonModule, LegendOnMapComponent],
  templateUrl: './administrative-map.component.html',
  styleUrls: ['./administrative-map.component.scss'],
})
export class AdministrativeMapComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() mapId: string = 'unitCoordinate-map';

  warningVectorSources: Map<number, VectorSource> = new Map();
  warningVectorLayers: Map<number, VectorLayer<VectorSource>> = new Map();

  flag = {
    infra: Constant.ALERT_FLAG_TYPE.FLAG.PRTG,
    infoSec: Constant.ALERT_FLAG_TYPE.FLAG.FMS,
    fmcServer: Constant.ALERT_FLAG_TYPE.FLAG.FMC,
    nacServer: Constant.ALERT_FLAG_TYPE.FLAG.NAC,
    all: Constant.ALERT_FLAG_TYPE.FLAG.ALL,
  };

  private _vectorSource: VectorSource;
  private _vectorLayer: VectorLayer<any>;

  private geoService = inject(GeoService);

  constructor() {}

  ngOnInit() {
    this.generateWarningVectorSources();
    this.generateWarningVectorLayers();
  }

  ngAfterViewInit(): void {
    addCommonProjections();

    this.generateMap();
    this.addMapControls();
  }

  ngOnDestroy(): void {
    if (this._vectorLayer && this._vectorSource)
      this.geoService.destroyMap(this._vectorLayer, this._vectorSource);
  }

  generateWarningVectorSources() {
    this.addToVectorSourceMap(this.flag.infoSec);
    this.addToVectorSourceMap(this.flag.infra);
    this.addToVectorSourceMap(this.flag.fmcServer);
    this.addToVectorSourceMap(this.flag.nacServer);
  }

  generateWarningVectorLayers() {
    this.addToVectorLayerMap(this.flag.infoSec);
    this.addToVectorLayerMap(this.flag.infra);
    this.addToVectorLayerMap(this.flag.fmcServer);
    this.addToVectorLayerMap(this.flag.nacServer);
  }

  addWarningLayerInBulk() {
    this.addWarningLayerToMapLayer(this.flag.infoSec);
    this.addWarningLayerToMapLayer(this.flag.infra);
    this.addWarningLayerToMapLayer(this.flag.fmcServer);
    this.addWarningLayerToMapLayer(this.flag.nacServer);
  }

  generateMap() {
    this.geoService.initializeMap(this.mapId);
    this.addVectorLayer();
    this.addWarningLayerInBulk();
  }

  addVectorLayer(): void {
    this._vectorSource = new VectorSource({
      features: [],
    });
    this._vectorLayer = new VectorLayer({
      source: this._vectorSource,
      // style: setStyleFeature,
    });
    this.geoService.addVectorLayer(this._vectorLayer);
  }

  addToVectorSourceMap(warningType: number) {
    const newVectorSource = new VectorSource({
      features: [],
    });
    this.warningVectorSources.set(warningType, newVectorSource);
  }

  addToVectorLayerMap(warningType: number) {
    const newVectorLayer = new VectorLayer({
      source: this.warningVectorSources.get(warningType),
    });
    this.warningVectorLayers.set(warningType, newVectorLayer);
  }

  addWarningLayerToMapLayer(warningType: number) {
    const layer = this.warningVectorLayers.get(warningType);
    if (layer) this.geoService.addVectorLayer(layer);
  }

  addMapControls() {
    this.geoService.addControl(this.geoService.generateStatisticalControl());
    // this.geoService.addControl(this.geoService.generateExportWordControl());
    // this.geoService.addControl(this.geoService.generateTopologyControl());
  }
}
