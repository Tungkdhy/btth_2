import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IData, StateService } from '../../../services/state.service';
import { Subscription } from 'rxjs';
import { ParentNode } from '../tcm-map/tcm-map.component';
import { Constant } from 'src/app/core/config/constant';

@Component({
  selector: 'app-vktb-detail-legend-on-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vktb-detail-legend-on-map.component.html',
  styleUrls: ['./vktb-detail-legend-on-map.component.scss'],
})
export class VktbDetailLegendOnMapComponent implements OnInit {
  @Input() legendData: any[];
  data: IData | null;
  subscription: Subscription;
  acceptIcon: string;
  rejectIcon: string;
  constructor(private stateService: StateService) {
    this.acceptIcon = Constant.DEFAULT.TCM.ACCEPT;
    this.rejectIcon = Constant.DEFAULT.TCM.REJECT;
  }
  ngOnInit() {
    this.subscription = this.stateService.viewDetail$.subscribe(
      (value: IData | null) => {
        if (value?.type === 'vktb') {
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
  onRowClick(item: any): void {}
}
