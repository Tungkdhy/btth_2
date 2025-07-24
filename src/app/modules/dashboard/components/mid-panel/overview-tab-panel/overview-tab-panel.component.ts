import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectPlaceByLayerName } from '../../../../../store/unit-btth/unit-btth.selectors';
import { LayerIds, FeatureDisplayData } from '../../../models/btth.interface';
import { selectDeviceInfoByNameAndLayerId } from '../../../../../store/map-interaction/network-system/network-system.selectors';
import { map } from 'rxjs/operators';

interface Info {
  name: string;
  value: string;
}

@Component({
  selector: 'app-overview-tab-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview-tab-panel.component.html',
  styleUrls: ['./overview-tab-panel.component.scss'],
})
export class OverviewTabPanelComponent {
  get selectedFeature(): FeatureDisplayData {
    return this._selectedFeature;
  }

  @Input() set selectedFeature(value: FeatureDisplayData) {
    this._selectedFeature = value;

    const code = this.selectedFeature.code;
    const layerId = this.selectedFeature.layerId;
    if (!code) return;
    if (layerId === LayerIds.CORE || layerId === LayerIds.BOUNDARY) {
      this.place$ = this.store.select(
        selectPlaceByLayerName(code, this.selectedFeature.layerId),
      );

      this.info$ = this.store
        .select(selectDeviceInfoByNameAndLayerId(code, layerId))
        .pipe(map((data) => this.convertToInfo(data)));
    }
  }
  private _selectedFeature: FeatureDisplayData;

  place$: Observable<string | null>;
  info$: Observable<Info[] | null>;

  private store = inject(Store);

  constructor() {}

  convertToInfo(
    deviceInfo: {
      device: string;
      wan: string;
      wanTn: string;
    } | null,
  ): Info[] {
    if (!deviceInfo) return [];
    // Define a mapping of property names to Info names
    const mapping = {
      device: 'Thiết bị',
      wan: 'WAN',
      wanTn: 'WAN TN',
    };

    // Convert the object into an array of Info objects
    return Object.entries(deviceInfo).map(([key, value]) => ({
      name: mapping[key as keyof typeof mapping],
      value: value || '', // Default to 'N/A' if the value is empty
    }));
  }
}
