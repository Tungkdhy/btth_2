import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LayerIds,
  OverviewStatistics,
  FeatureDisplayData,
} from '../../../../models/btth.interface';
import { Observable, of, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAccessStatistics } from '../../../../../../store/map-interaction/statistics-store/statistics-store.selectors';
import { FeatureStatsOverlayComponent } from '../../feature-stats-overlay/feature-stats-overlay.component';
import * as StatisticsStoreActions from '../../../../../../store/map-interaction/statistics-store/statistics-store.actions';

@Component({
  selector: 'app-unit-list-panel',
  standalone: true,
  imports: [CommonModule, FeatureStatsOverlayComponent],
  templateUrl: './unit-list-panel.component.html',
  styleUrls: ['./unit-list-panel.component.scss'],
})
export class UnitListPanelComponent implements OnInit, OnChanges {
  @Input() selectedFeature: FeatureDisplayData;

  combinedStore$: Observable<OverviewStatistics[] | null>;

  private store = inject(Store);

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    // if (this.isOverview && this.layerId) {
    //   this.combinedStore$ = this.handleMoveEnd(this.layerId);
    //   this.filteredCombinedStore$ = getFilteredCombinedStore(
    //     this.combinedStore$,
    //     this.componentEvent$,
    //   );
    // }
    if (changes['selectedFeature']) {
      const selectedFeatureValue = changes['selectedFeature'].currentValue;
      if (selectedFeatureValue) {
        this.combinedStore$ = this.handleSelectFeature(selectedFeatureValue);
      }
    }
  }

  // handleMoveEnd(layerId: LayerIds) {
  //   switch (layerId) {
  //     case LayerIds.CORE:
  //       this.store.dispatch(StatisticsStoreActions.loadCoreStats());
  //       return this.store.select(selectCoreStatistics());
  //     case LayerIds.BOUNDARY:
  //       this.store.dispatch(StatisticsStoreActions.loadBoundaryStats({}));
  //       return this.store.select(selectBoundaryStatistics());
  //     case LayerIds.ACCESS_LEVEL_3:
  //       this.store.dispatch(
  //         StatisticsStoreActions.loadAccessStatsByBoundaryCodeAndLevel({
  //           level: 3,
  //         }),
  //       );
  //       return this.store.select(selectAccessStatistics());
  //     case LayerIds.ACCESS_LEVEL_4:
  //       this.store.dispatch(
  //         StatisticsStoreActions.loadAccessStatsByBoundaryCodeAndLevel({
  //           level: 4,
  //         }),
  //       );
  //       return this.store.select(selectAccessStatistics());
  //     case LayerIds.ACCESS_LEVEL_5:
  //       this.store.dispatch(
  //         StatisticsStoreActions.loadAccessStatsByBoundaryCodeAndLevel({
  //           level: 5,
  //         }),
  //       );
  //       return this.store.select(selectAccessStatistics());
  //     default:
  //       return of(null);
  //   }
  // }

  handleSelectFeature(selectedFeature: FeatureDisplayData) {
    switch (selectedFeature.layerId) {
      case LayerIds.ACCESS_LEVEL_3:
        this.store.dispatch(
          StatisticsStoreActions.loadAccessStatsByBoundaryCodeAndLevel({
            // boundaryCode: selectedFeature.code,
            level: 4,
            unitPath: selectedFeature.unitPath || undefined,
          }),
        );
        return this.store.select(selectAccessStatistics());
      case LayerIds.ACCESS_LEVEL_4:
        this.store.dispatch(
          StatisticsStoreActions.loadAccessStatsByBoundaryCodeAndLevel({
            // boundaryCode: selectedFeature.code,
            level: 5,
            unitPath: selectedFeature.unitPath || undefined,
          }),
        );
        return this.store.select(selectAccessStatistics());
      default:
        return of(null);
    }
  }
}
