import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberFormatPipe } from '../../../../../core/pipes/number-format/number-format.pipe';

export interface LegendOnMap {
  name: string;
  count: number;
}

@Component({
  selector: 'app-legend-on-map',
  standalone: true,
  imports: [CommonModule, NumberFormatPipe],
  templateUrl: './legend-on-map.component.html',
  styleUrls: ['./legend-on-map.component.scss'],
})
export class LegendOnMapComponent {
  @Input() legendData: LegendOnMap[] | null;
}
