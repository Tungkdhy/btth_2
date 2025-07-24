import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AlertType,
  InfrastructureCount,
  InfrastructureCountMap,
  OverviewStatistics,
} from '../../../models/btth.interface';
import { NumberFormatPipe } from '../../../../../core/pipes/number-format/number-format.pipe';
import {
  EventStream,
  MilitaryMapService,
} from '../../../services/military-map.service';
import { SplitUnitNameFullPipe } from '../../../pipes/split-unit-name-full.pipe';
import { isEqual } from 'lodash';
import { Observable, tap } from 'rxjs';

export interface UnitOnLegend {
  name: string;
  id: string | number;
}

@Component({
  selector: 'app-feature-stats-overlay',
  standalone: true,
  imports: [CommonModule, NumberFormatPipe, SplitUnitNameFullPipe],
  templateUrl: './feature-stats-overlay.component.html',
  styleUrls: ['./feature-stats-overlay.component.scss'],
})
export class FeatureStatsOverlayComponent implements OnInit {
  get combinedStore(): OverviewStatistics[] {
    return this._combinedStore;
  }

  @Input() set combinedStore(value: OverviewStatistics[]) {
    if (value) {
      if (isEqual(value, this.combinedStore)) return;
      this._combinedStore = value;
      this.initialState();
      this.calculateTotalPages();
      this.updatePaginatedUnits();
      this.cdr.markForCheck();
    }
  }
  get infrastructureStats(): InfrastructureCountMap {
    return this._infrastructureStats;
  }

  @Input() set infrastructureStats(value: InfrastructureCountMap | null) {
    if (value) {
      this._infrastructureStats = value;
      this.infrastructureCountArray = [...this.infrastructureStats.values()];
      this.initialState();
      this.calculateTotalPages();
      this.updatePaginatedUnits();
    }
  }

  private _infrastructureStats: InfrastructureCountMap = new Map();

  private _combinedStore: OverviewStatistics[];

  infrastructureCountArray: InfrastructureCount[];

  componentEvent$: Observable<EventStream>;

  @Input() units: UnitOnLegend[] | null;

  paginatedList: OverviewStatistics[];

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number;

  private cdr = inject(ChangeDetectorRef);
  private mapService = inject(MilitaryMapService);

  ngOnInit() {
    this.componentEvent$ = this.mapService.currentEvent$;
  }

  initialState(): void {
    this.currentPage = 1;
    this.pageSize = 10;
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.combinedStore.length / this.pageSize);
  }

  updatePaginatedUnits() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedList = this.combinedStore.slice(startIndex, endIndex);
    this.cdr.markForCheck();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedUnits();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedUnits();
    }
  }

  zoomInToFeature(id: string) {
    this.mapService.updateEvent({ id });
  }

  protected readonly AlertType = AlertType;
}
