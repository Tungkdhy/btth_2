import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, repeat, tap } from 'rxjs';
import {
  NetworkInfrastructureTreeCount,
  OverviewStatistics,
  SecurityEventTreeCount,
  FeatureDisplayData,
  Statistics,
  UnitPath,
} from '../../../../models/btth.interface';
import { map } from 'rxjs/operators';
import { MapSupabaseService } from '../../../../services/map-supabase.service';
import { getPathParentFromLTree } from '../../../../../../_metronic/layout/core/common/common-utils';
import { NavTabsComponent } from '../../../shared/nav-tabs/nav-tabs.component';
import { TopologyWrapperCardComponent } from '../topology-wrapper-card/topology-wrapper-card.component';
import { Store } from '@ngrx/store';
import {
  selectDeviceStatisticsByUnitPath,
  selectStatisticsByUnitPath,
} from '../../../../../../store/combined-store/combined-store.selectors';
import { NumberFormatPipe } from '../../../../../../core/pipes/number-format/number-format.pipe';

@Component({
  selector: 'app-access-stats-panel',
  standalone: true,
  imports: [
    CommonModule,
    NavTabsComponent,
    TopologyWrapperCardComponent,
    NumberFormatPipe,
  ],
  templateUrl: './access-stats-panel.component.html',
  styleUrls: ['./access-stats-panel.component.scss'],
})
export class AccessStatsPanelComponent implements OnChanges {
  @Input() selectedFeature?: FeatureDisplayData;

  tabs = [
    { label: 'Cảnh báo', value: 'alert' },
    { label: 'Cấu trúc mạng', value: 'topology' },
  ];

  selectedTab: 'alert' | 'topology' = 'alert';
  stats$: Observable<Statistics>;

  private store = inject(Store);

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.selectedFeature) return;
    const unitPath = this.selectedFeature.unitPath;
    if (!unitPath) return;
    this.stats$ = this.store.select(selectDeviceStatisticsByUnitPath(unitPath));
  }

  onTabChange(tab: any) {
    this.selectedTab = tab;
  }
}
