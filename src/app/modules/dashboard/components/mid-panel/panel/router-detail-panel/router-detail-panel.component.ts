import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewTabPanelComponent } from '../../overview-tab-panel/overview-tab-panel.component';
import { FeatureDetailPanelComponent } from '../../../shared/feature-detail-panel/feature-detail-panel.component';
import { FeatureDisplayData } from '../../../../models/btth.interface';

@Component({
  selector: 'app-router-detail-panel',
  standalone: true,
  imports: [
    CommonModule,
    OverviewTabPanelComponent,
    FeatureDetailPanelComponent,
  ],
  templateUrl: './router-detail-panel.component.html',
  styleUrls: ['./router-detail-panel.component.scss'],
})
export class RouterDetailPanelComponent {
  @Input() selectedFeature?: FeatureDisplayData;
}
