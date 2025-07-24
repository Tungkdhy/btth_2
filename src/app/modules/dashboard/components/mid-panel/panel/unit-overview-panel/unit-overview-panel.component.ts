import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureDetailPanelComponent } from '../../../shared/feature-detail-panel/feature-detail-panel.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectHasChildrenByPath } from '../../../../../../store/unit-btth/unit-btth.selectors';
import { UnitDetailPanelComponent } from '../unit-detail-panel/unit-detail-panel.component';
import { UnitGroupDetailPanelComponent } from '../unit-group-detail-panel/unit-group-detail-panel.component';
import { FeatureDisplayData } from '../../../../models/btth.interface';
import { UnitListPanelComponent } from '../unit-list-panel/unit-list-panel.component';

@Component({
  selector: 'app-unit-overview-panel',
  standalone: true,
  imports: [
    CommonModule,
    UnitDetailPanelComponent,
    UnitGroupDetailPanelComponent,
    FeatureDetailPanelComponent,
    UnitListPanelComponent,
  ],
  templateUrl: './unit-overview-panel.component.html',
  styleUrls: ['./unit-overview-panel.component.scss'],
})
export class UnitOverviewPanelComponent implements OnChanges {
  @Input() selectedFeature?: FeatureDisplayData;

  hasChildren$: Observable<boolean>;

  private store: Store = inject(Store);

  ngOnChanges(changes: SimpleChanges) {
    if (!this.selectedFeature || !this.selectedFeature.unitPath) return;
    this.hasChildren$ = this.store.select(
      selectHasChildrenByPath(this.selectedFeature.unitPath),
    );
  }
}
