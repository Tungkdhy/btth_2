import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { IData, StateService } from '../../../services/state.service';
import { ParentNode } from '../tcm-map/tcm-map.component';

@Component({
  selector: 'app-data-detail-legend-on-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-detail-legend-on-map.component.html',
  styleUrls: ['./data-detail-legend-on-map.component.scss'],
})
export class DataDetailLegendOnMapComponent implements OnInit {
  @Input() legendData: any[];
  data: IData | null;
  subscription: Subscription;
  constructor(private stateService: StateService) {}
  ngOnInit() {
    this.subscription = this.stateService.viewDetail$.subscribe(
      (value: IData | null) => {
        if (value?.type === 'dulieu') {
          this.data = value;
        } else {
          this.data = null;
        }
      },
    );
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
    console.log('item: ', item);
  }
}
