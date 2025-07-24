import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IData, StateService } from '../../../services/state.service';
import { Subscription } from 'rxjs';
import { AdministrativeMapService } from '../../../services/administrative-map.service';
import { Constant } from 'src/app/core/config/constant';
import { ParentNode } from '../tcm-map/tcm-map.component';

@Component({
  selector: 'app-method-detail-legend-on-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './method-detail-legend-on-map.component.html',
  styleUrls: ['./method-detail-legend-on-map.component.scss'],
})
export class MethodDetailLegendOnMapComponent {
  @Input() legendData: any[];
  @Output() goBack: EventEmitter<any> = new EventEmitter();
  data: IData | null;
  subscription: Subscription;
  acceptIcon: string;
  rejectIcon: string;
  constructor(
    private stateService: StateService,
    private mapService: AdministrativeMapService,
  ) {
    this.acceptIcon = Constant.DEFAULT.TCM.ACCEPT;
    this.rejectIcon = Constant.DEFAULT.TCM.REJECT;
  }
  ngOnInit() {
    this.subscription = this.stateService.viewDetail$.subscribe(
      (value: IData | null) => {
        if (value?.type === 'kttc') {
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
  toggleExpand(item: ParentNode): void {
    this.legendData.forEach((node) => {
      if (node !== item) {
        node.expand = false;
      }
    });
    item.expand = !item.expand;
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
  onRowClick(item: any): void {}
}
