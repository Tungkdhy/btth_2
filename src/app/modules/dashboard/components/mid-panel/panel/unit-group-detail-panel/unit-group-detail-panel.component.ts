import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberFormatPipe } from '../../../../../../core/pipes/number-format/number-format.pipe';
import { FeatureDetailPanelComponent } from '../../../shared/feature-detail-panel/feature-detail-panel.component';
import { Observable } from 'rxjs';
import { TopologyWrapperCardComponent } from '../topology-wrapper-card/topology-wrapper-card.component';
import { MapSupabaseService } from '../../../../services/map-supabase.service';
import { AlertDetailCardComponent } from '../alert-detail-card/alert-detail-card.component';
import { DataTableExpandComponent } from '../../../shared/data-table-expand/data-table-expand.component';
import { NavTabsComponent } from '../../../shared/nav-tabs/nav-tabs.component';
import { UnitStrengthPanelComponent } from '../unit-strength-panel/unit-strength-panel.component';
import {
  FeatureDisplayData,
  Statistics,
} from '../../../../models/btth.interface';

@Component({
  selector: 'app-unit-group-detail-panel',
  standalone: true,
  imports: [
    CommonModule,
    NumberFormatPipe,
    FeatureDetailPanelComponent,
    TopologyWrapperCardComponent,
    AlertDetailCardComponent,
    DataTableExpandComponent,
    NavTabsComponent,
    UnitStrengthPanelComponent,
  ],
  templateUrl: './unit-group-detail-panel.component.html',
  styleUrls: ['./unit-group-detail-panel.component.scss'],
})
export class UnitGroupDetailPanelComponent implements OnChanges {
  @Input() selectedFeature?: FeatureDisplayData;

  tabs = [
    { label: 'Thực lực', value: 'strength' },
    { label: 'Cấu trúc mạng', value: 'topology' },
  ];

  selectedTab: 'topology' | 'strength' = 'strength';

  stats$: Observable<Statistics>;

  // private store = inject(Store);
  private supabase = inject(MapSupabaseService);

  ngOnChanges(changes: SimpleChanges) {
    if (!this.selectedFeature) return;
    const unitPath = this.selectedFeature.unitPath;
    const boundaryCode = this.selectedFeature.code;
    if (!unitPath || !boundaryCode) return;
    this.stats$ = this.supabase.getDeviceStatistics({
      subTypeList: [unitPath],
      boundaryList: [boundaryCode],
    });
  }

  onTabChange(tab: any) {
    this.selectedTab = tab;
  }
}
