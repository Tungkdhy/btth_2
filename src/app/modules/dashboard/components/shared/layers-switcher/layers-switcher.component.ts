import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Layer } from 'ol/layer';

export interface LayerSwitcher {
  name: string;
  iconUrl: string;
  layer: Layer;
}

@Component({
  selector: 'app-layers-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './layers-switcher.component.html',
  styleUrls: ['./layers-switcher.component.scss'],
})
export class LayersSwitcherComponent {
  @Input() layersSwitcher: LayerSwitcher[] = [];
  @Output() activeLayerChange = new EventEmitter<Layer | null>();

  activeLayer: Layer | null = null;
  showOptions = false; // Added variable to control the visibility of options card

  selectLayer(layer: Layer | null) {
    this.activeLayer = layer;
    this.layersSwitcher.forEach((l) =>
      l.layer.setVisible(l.layer === layer || layer === null),
    );
    this.activeLayerChange.emit(layer);
  }
}
