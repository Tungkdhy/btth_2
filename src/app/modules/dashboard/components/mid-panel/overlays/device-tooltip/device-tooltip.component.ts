import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FeatureDisplayData,
  LayerIds,
} from '../../../../models/btth.interface';
import { OverviewTabPanelComponent } from '../../overview-tab-panel/overview-tab-panel.component';
import { isAccessLayer } from '../../../../utils/map-utils';
import { TitlePanelComponent } from '../../panel/title-panel/title-panel.component';
import { UnitStrengthWrapperComponent } from '../../unit-strength-wrapper/unit-strength-wrapper.component';

@Component({
  selector: 'app-device-tooltip',
  standalone: true,
  imports: [
    CommonModule,
    OverviewTabPanelComponent,
    TitlePanelComponent,
    UnitStrengthWrapperComponent,
  ],
  templateUrl: './device-tooltip.component.html',
  styleUrls: ['./device-tooltip.component.scss'],
})
export class DeviceTooltipComponent {
  @Input() hoverInfo: FeatureDisplayData;
  protected readonly isAccessLayer = isAccessLayer;

  getNameByLayer(name: string, layerId: LayerIds): string {
    console.log('Count name');
    return layerId === LayerIds.CORE ? `Trạm ${name}` : name;
  }
}
