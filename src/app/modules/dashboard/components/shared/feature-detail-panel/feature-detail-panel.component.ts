import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureStatsOverlayComponent } from '../../mid-panel/feature-stats-overlay/feature-stats-overlay.component';
import { TopologyCardComponent } from '../topology-card/topology-card.component';
import {
  FeatureDisplayData,
  InfrastructureCountMap,
  LayerIds,
  OverviewStatistics,
} from '../../../models/btth.interface';
import { Observable, of, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { DateTimeRangePickerComponent } from '../../../../../shared/date-time-range-picker/date-time-range-picker.component';
import { LetDirective } from '@ngrx/component';
import { OverviewTabPanelComponent } from '../../mid-panel/overview-tab-panel/overview-tab-panel.component';
import { getFilteredCombinedStore } from '../../../utils/map-utils';
import {
  selectAccessStatistics,
  selectBoundaryStatistics,
  selectCoreStatistics,
} from '../../../../../store/map-interaction/statistics-store/statistics-store.selectors';
import * as StatisticsStoreActions from '../../../../../store/map-interaction/statistics-store/statistics-store.actions';
import {
  EventStream,
  MilitaryMapService,
} from '../../../services/military-map.service';

@Component({
  selector: 'app-feature-detail-panel',
  standalone: true,
  imports: [
    CommonModule,
    FeatureStatsOverlayComponent,
    TopologyCardComponent,
    DateTimeRangePickerComponent,
    LetDirective,
    OverviewTabPanelComponent,
  ],
  templateUrl: './feature-detail-panel.component.html',
  styleUrls: ['./feature-detail-panel.component.scss'],
})
export class FeatureDetailPanelComponent implements OnInit, OnChanges {
  @Input() selectedFeature?: FeatureDisplayData;
  @Input() layerId: LayerIds = LayerIds.CORE;
  @Input() topTitle: string = 'Cấu trúc mạng';
  @Input() isOverview: boolean = false;
  @Input() isUnitView: boolean = false;

  @Input() infrastructureStats: InfrastructureCountMap | null;

  combinedStore$: Observable<OverviewStatistics[] | null>;
  componentEvent$: Observable<EventStream>;
  filteredCombinedStore$: Observable<OverviewStatistics[]>; // The filtered observable to be used in the template
  protected readonly LayerIds = LayerIds;

  private mapService = inject(MilitaryMapService);
  private store = inject(Store);

  constructor() {
    this.componentEvent$ = this.mapService.currentEvent$.pipe(
      tap((res) => console.log('Event Stream:', res)),
    );
  }
  ngOnInit() {
    this.filteredCombinedStore$ = getFilteredCombinedStore(
      this.combinedStore$,
      this.componentEvent$,
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isOverview && this.layerId) {
      this.combinedStore$ = this.handleMoveEnd(this.layerId);
      this.filteredCombinedStore$ = getFilteredCombinedStore(
        this.combinedStore$,
        this.componentEvent$,
      );
    }
    if (changes['selectedFeature']) {
      const selectedFeatureValue = changes['selectedFeature'].currentValue;
      if (selectedFeatureValue) {
        this.combinedStore$ = this.handleSelectFeature(selectedFeatureValue);
        this.filteredCombinedStore$ = getFilteredCombinedStore(
          this.combinedStore$,
          this.componentEvent$,
        );
      }
    }
  }

  handleMoveEnd(layerId: LayerIds) {
    switch (layerId) {
      case LayerIds.CORE:
        this.store.dispatch(StatisticsStoreActions.loadCoreStats());
        return this.store.select(selectCoreStatistics());
      case LayerIds.BOUNDARY:
        this.store.dispatch(StatisticsStoreActions.loadBoundaryStats({}));
        return this.store.select(selectBoundaryStatistics());
      case LayerIds.ACCESS_LEVEL_3:
        this.store.dispatch(
          StatisticsStoreActions.loadAccessStatsByBoundaryCodeAndLevel({
            level: 3,
          }),
        );
        return this.store.select(selectAccessStatistics());
      case LayerIds.ACCESS_LEVEL_4:
        this.store.dispatch(
          StatisticsStoreActions.loadAccessStatsByBoundaryCodeAndLevel({
            level: 4,
          }),
        );
        return this.store.select(selectAccessStatistics());
      case LayerIds.ACCESS_LEVEL_5:
        this.store.dispatch(
          StatisticsStoreActions.loadAccessStatsByBoundaryCodeAndLevel({
            level: 5,
          }),
        );
        return this.store.select(selectAccessStatistics());
      default:
        return of(null);
    }
  }

  handleSelectFeature(selectedFeature: FeatureDisplayData) {
    switch (selectedFeature.layerId) {
      case LayerIds.CORE:
        this.store.dispatch(
          StatisticsStoreActions.loadBoundaryStats({
            coreLayerCode: selectedFeature.code,
          }),
        );
        return this.store.select(selectBoundaryStatistics());
      case LayerIds.BOUNDARY:
        this.store.dispatch(
          StatisticsStoreActions.loadAccessStatsByBoundaryCode({
            boundaryCode: selectedFeature.code,
          }),
        );
        return this.store.select(selectAccessStatistics());
      case LayerIds.ACCESS_LEVEL_3:
      case LayerIds.ACCESS_LEVEL_4:
      case LayerIds.ACCESS_LEVEL_5:
        if (this.isUnitView && selectedFeature?.unitPath) {
          this.store.dispatch(
            StatisticsStoreActions.loadAccessStatsByUnitPath({
              unitPath: selectedFeature.unitPath,
              boundaryCode: selectedFeature.code,
              coreCode: selectedFeature.foreignCode,
            }),
          );
        }
        return this.store.select(selectAccessStatistics());
      default:
        return of(null);
    }
  }

  getTitle(layerId: LayerIds | undefined): string {
    if (!layerId) return '';
    switch (layerId) {
      case LayerIds.CORE:
        return 'Danh sách lớp biên';
      default:
        return 'Danh sách đơn vị';
    }
  }
}
