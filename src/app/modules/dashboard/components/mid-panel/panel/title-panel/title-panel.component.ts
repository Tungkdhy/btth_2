import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { isAccessLayer } from '../../../../utils/map-utils';
import { Observable } from 'rxjs';
import { selectUnitPathToParent } from '../../../../../../store/unit-btth/unit-btth.selectors';
import { Store } from '@ngrx/store';
import { FeatureDisplayData } from '../../../../models/btth.interface';

@Component({
  selector: 'app-title-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title-panel.component.html',
  styleUrls: ['./title-panel.component.scss'],
})
export class TitlePanelComponent implements OnChanges {
  @Input() selectedFeature?: FeatureDisplayData;

  protected readonly isAccessLayer = isAccessLayer;

  unitPathToParent$: Observable<string | null>;

  private store = inject(Store);

  ngOnChanges(changes: SimpleChanges) {
    if (
      this.selectedFeature &&
      this.selectedFeature.unitPath &&
      isAccessLayer(this.selectedFeature.layerId)
    ) {
      this.unitPathToParent$ = this.store.select(
        selectUnitPathToParent(this.selectedFeature.unitPath),
      );
    }
  }
}
