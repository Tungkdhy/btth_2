import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitGroupDetailPanelComponent } from '../unit-group-detail-panel/unit-group-detail-panel.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectHasChildrenByPath } from '../../../../../../store/unit-btth/unit-btth.selectors';
import { UnitDetailPanelComponent } from '../unit-detail-panel/unit-detail-panel.component';
import { FeatureDisplayData } from '../../../../models/btth.interface';

@Component({
  selector: 'app-router-access-detail-panel',
  standalone: true,
  imports: [
    CommonModule,
    UnitGroupDetailPanelComponent,
    UnitDetailPanelComponent,
  ],
  templateUrl: './router-access-detail-panel.component.html',
  styleUrls: ['./router-access-detail-panel.component.scss'],
})
export class RouterAccessDetailPanelComponent implements OnChanges {
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
