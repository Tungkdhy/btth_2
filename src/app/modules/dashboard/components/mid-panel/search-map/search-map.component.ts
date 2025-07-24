import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventId, UnitSuggestionResult } from '../../../models/btth.interface';
import { MapSupabaseService } from '../../../services/map-supabase.service';
import { SocketService } from '../../../services/socket.service';
import {
  MilitaryMapComponent,
  TemplateId,
} from '../military-map/military-map.component';
import { Coordinate } from 'ol/coordinate';
import { MilitaryMapService } from '../../../services/military-map.service';
import { BreadcrumbService } from '../../../services/breadcrumb.service';

@Component({
  selector: 'app-search-map',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgFor, AsyncPipe, NgIf, NgClass],
  templateUrl: './search-map.component.html',
  styleUrls: ['./search-map.component.scss'],
})
export class SearchMapComponent implements OnInit {
  isExpanded = false;
  searchQuery = '';
  searchMode: 'Địa danh' | 'Đơn vị' = 'Đơn vị';
  results$: Observable<UnitSuggestionResult[]>;

  private mapComponent = inject(MilitaryMapComponent);
  private mapService = inject(MilitaryMapService);
  private breadcrumbService = inject(BreadcrumbService);
  private supabase = inject(MapSupabaseService);
  private socket = inject(SocketService);

  ngOnInit() {}

  toggleSearch() {
    this.isExpanded = !this.isExpanded;
  }

  handleClearSearch() {
    this.mapComponent.resetSelectedFeatureStyle();
    this.breadcrumbService.clearBreadcrumbs();
    this.clearSearch();
  }

  handleCollapseSearch() {
    this.collapseSearch();
  }

  collapseSearch() {
    this.isExpanded = false;
  }

  clearSearch() {
    this.searchQuery = '';
    this.results$ = of([]);
  }

  toggleSearchMode() {
    this.searchMode = this.searchMode === 'Địa danh' ? 'Đơn vị' : 'Địa danh';
  }

  onInputChange() {
    // Optional: Implement debounce logic here if needed
  }

  onSearch() {
    this.results$ = this.fetchSearchResults(
      this.searchMode,
      this.searchQuery,
    ).pipe(
      map((data) => {
        data.map((item: any) => {
          item.areaSearch = item.areaSearch
            ? item.areaSearch.split(';')[0]
            : '';
          item.unitSearch = item.unitSearch
            ? item.unitSearch.split(';')[0]
            : '';

          return item;
        });
        if (this.searchMode === 'Địa danh') {
          return Array.from(
            new Map(data.map((item: any) => [item.areaSearch, item])).values(),
          );
        } else {
          return this.sortUnits(data);
        }
      }),
    );
  }

  private sortUnits(results: UnitSuggestionResult[]): UnitSuggestionResult[] {
    return results.sort((a, b) => {
      // Nếu trường `sort` của `unit` tồn tại, sắp xếp theo giá trị của nó
      if (a.unit.sort !== null && b.unit.sort !== null) {
        return a.unit.sort - b.unit.sort;
      }

      // Nếu một trong hai không có `sort`, đưa nó xuống cuối
      if (a.unit.sort === null && b.unit.sort !== null) {
        return 1; // a không có `sort`, đưa a xuống cuối
      }
      if (a.unit.sort !== null && b.unit.sort === null) {
        return -1; // b không có `sort`, đưa b xuống cuối
      }

      // Nếu cả hai đều không có `sort`, giữ nguyên vị trí
      return 0;
    });
  }

  fetchSearchResults(
    searchMode: string,
    textSearch: string,
  ): Observable<UnitSuggestionResult[]> {
    let unitSearch: string | null = null;
    let locationSearch: string | null = null;
    if (searchMode === 'Địa danh') {
      locationSearch = textSearch;
    } else {
      unitSearch = textSearch;
    }
    return this.supabase.searchUnitSuggestions(unitSearch, locationSearch);
  }

  goToFeature(result: UnitSuggestionResult) {
    console.log('Navigating to feature:', result);
    if (!result) return;

    if (this.searchMode === 'Địa danh') {
      console.log(result);
      // TODO: Implement the goToFeature logic here
      // const center = result.center.coordinates;
      const coordinates = result.coordinates.coordinates;
      //
      // this.mapService.highlightArea(result.geographicCode, coordinates);
      this.mapService.highlightArea(coordinates);
    } else {
      const path = result.unit.path;
      if (!path) return;
      this.breadcrumbService.clearBreadcrumbs();
      this.mapComponent.selectFeature(path);
      this.mapComponent.setTemplate(TemplateId.unit);
    }
  }
}
