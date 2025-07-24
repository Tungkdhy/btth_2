import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentNode } from '../tcm-map/tcm-map.component';
import { IData, StateService } from '../../../services/state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tcm-detail-legend-on-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tcm-detail-legend-on-map.component.html',
  styleUrls: ['./tcm-detail-legend-on-map.component.scss'],
})
export class TCMDetailLegendOnMapComponent implements OnInit {
  @Input() legendData: any[];
  @Output() goBack: EventEmitter<any> = new EventEmitter();

  data: IData | null;
  subscription: Subscription;
  selectedRow: string | null;
  constructor(private stateService: StateService) {}

  ngOnInit() {
    this.subscription = this.stateService.viewDetail$.subscribe(
      (value: IData | null) => {
        if (value?.type === 'lucluong') {
          this.data = value;
        } else {
          this.data = null;
        }
      },
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  getNumerator(count: string): string {
    return count.split('/')[0];
  }

  getDenominator(count: string): string {
    return count.split('/')[1];
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
  isSelected(row: any): boolean {
    return this.selectedRow === row.id;
  }
  onRowClick(item: any): void {
    console.log('item: ', item);
  }
  onChildRowClick(item: any): void {
    this.stateService.onChildRowSelected(item.id);
    this.legendData.forEach((node) => {
      if (node !== item) {
        node.expand = false;
      }
    });
  }
}
