import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import BaseLayer from 'ol/layer/Base';
import { FormsModule } from '@angular/forms';
import { MilitaryMapService } from '../../../services/military-map.service';
import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import VectorSource from 'ol/source/Vector';
import { Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import { AlertType } from '../../../models/btth.interface';
import { Style } from 'ol/style';
import { Constant } from '../../../../../core/config/constant';

@Component({
  selector: 'app-layers-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './layers-control.component.html',
  styleUrls: ['./layers-control.component.scss'],
})
export class LayersControlComponent implements OnInit, AfterViewInit {
  public showLayers: boolean = false;
  public allLayersVisible: boolean = true;
  protected readonly AlertType = AlertType;
  networkChecked = true;
  infoSecChecked = true;

  allLayers: any[] = [];

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

  alertISLayers: Map<number, WebGLPointsLayer<VectorSource<Point>>> = new Map<
    number,
    WebGLPointsLayer<VectorSource<Point>>
  >();

  alertNILayers: Map<number, WebGLPointsLayer<VectorSource<Point>>> = new Map<
    number,
    WebGLPointsLayer<VectorSource<Point>>
  >();

  private mapService = inject(MilitaryMapService);

  ngOnInit() {
    this.administrationLayers = this.mapService.administrationLayers;
    this.militaryLayers = this.mapService.militaryLayers;
    this.internetLayers = this.mapService.internetLayers;
    this.alertISLayers = this.mapService.alertISLayers;
    this.alertNILayers = this.mapService.alertNILayers;
    this.allLayers = [
      ...this.administrationLayers.values(),
      ...this.militaryLayers.values(),
      ...this.internetLayers.values(),
      ...this.alertISLayers.values(),
      ...this.alertNILayers.values(),
    ];
  }

  ngAfterViewInit() {
    // Ensure all checkboxes are in sync after view initialization
    this.checkAllLayersVisibility();
  }

  toggleLayersVisibility() {
    this.showLayers = !this.showLayers;
  }

  setAlertLayerVisibility(alertType: AlertType, isVisible: boolean) {
    const layers =
      alertType === 'INFO_SEC' ? this.alertISLayers : this.alertNILayers;

    layers.forEach((layer) => {
      layer.setVisible(isVisible);
    });
    this.toggleAlertFeatureVisibility();
  }

  setLayerVisibility(layer: BaseLayer, isVisible: boolean) {
    layer.setVisible(isVisible);
    this.checkAllLayersVisibility();
  }

  toggleAllLayers(isVisible: boolean) {
    this.allLayers.forEach((layer) => layer.setVisible(isVisible));
  }

  checkAllLayersVisibility() {
    return this.allLayers.some((layer) => layer.getVisible());
  }

  toggleAlertFeatureVisibility() {
    this.mapService.networkSystemNodes.forEach((feature) => {
      const network = feature.get(Constant.DEFAULT.MAP.PROPERTIES.NETWORK);
      const infoSec = feature.get(Constant.DEFAULT.MAP.PROPERTIES.INFO_SEC);

      const isVisible =
        (this.networkChecked && network) ||
        (this.infoSecChecked && infoSec) ||
        (this.networkChecked && this.infoSecChecked);
      const style: Style | undefined = feature.getStyle() as Style;
      if (style) {
        style.getImage().setOpacity(isVisible ? 1 : 0);
        feature.setStyle(style);
      }
    });
  }
}
