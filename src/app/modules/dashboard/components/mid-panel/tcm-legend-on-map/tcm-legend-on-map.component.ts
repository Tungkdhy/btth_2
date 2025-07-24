import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fromLonLat } from 'ol/proj';
import { AdministrativeMapService } from '../../../services/administrative-map.service';
import { Store } from '@ngrx/store';
import { ParentNode } from '../tcm-map/tcm-map.component';
import { StateService } from '../../../services/state.service';
import { Subscription } from 'rxjs';
import { Constant } from 'src/app/core/config/constant';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-tcm-legend-on-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tcm-legend-on-map.component.html',
  styleUrls: ['./tcm-legend-on-map.component.scss'],
})
export class TCMLegendOnMapComponent implements OnInit {
  constructor(
    private mapService: AdministrativeMapService,
    private store: Store,
    private stateService: StateService,
  ) {}
  expandSet = new Set<number>();
  selectedRow: string | null;
  subscription: Subscription;
  @Input() legendData: any[];
  @Input() description: SafeHtml;
  @Output() goBack: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.subscription = this.stateService.activeRow$.subscribe(
      (key: string | null) => {
        this.selectedRow = key;
      },
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  generateIcon(code: string): any {
    let src = '';
    switch (code) {
      case 'TT186':
        return Constant.DEFAULT.TCM.TT1;
      case 'TT286':
        return Constant.DEFAULT.TCM.TT2;
      case 'TT386':
        return Constant.DEFAULT.TCM.TT3;
      case 'TT586':
        return Constant.DEFAULT.TCM.TT5;
      default:
        return src;
    }
  }

  getNumerator(count: string): string {
    return count.split('/')[0];
  }

  getDenominator(count: string): string {
    return count.split('/')[1];
  }
  getRemoveNull(count:string): string {
    return count.split(' ')[0];
  }

  isGreenText(count: string): boolean {
    // Modify this logic if you have specific conditions for applying green text
    const numerator = parseInt(this.getNumerator(count), 10);
    // return numerator > 100; // Example condition: apply green text if the numerator is greater than 100
    return true;
  }
  toggleExpand(item: ParentNode): void {
    this.legendData.forEach((node) => {
      if (node !== item) {
        node.expand = false;
      }
    });
    item.expand = !item.expand;
  }
  onRowClick(item: any): void {
    this.stateService.onShowDetailTarget(null);
    this.stateService.onSelect(null);
    this.stateService.onRowSelected(item.id);
    const coordinates = fromLonLat(item?.coordinate);
    const map = this.mapService.map;
    const view = map.getView();
    view.animate({
      center: coordinates,
      zoom: 12,
      duration: 1000,
    });
    //expand every row-click
    //this.toggleExpand(item);
  }
  isSelected(row: any): boolean {
    return this.selectedRow === row.id;
  }
  onChildRowClick(item: any): void {
    //comment this to persist the child table
    this.legendData.forEach((node) => {
      if (node !== item) {
        node.expand = false;
      }
    });

    this.stateService.onSelect({
      id: item.id,
      type: item.type,
      cyber_code: item?.cyber_code,
    });
    ///Zoom out
    const map = this.mapService.map;
    const view = map.getView();
    if (item.type == 'muctieu') {
      view.animate({
        zoom: 12,
        duration: 1000,
      });
    }
  }
}
