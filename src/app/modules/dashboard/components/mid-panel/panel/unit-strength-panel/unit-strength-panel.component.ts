import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberFormatPipe } from '../../../../../../core/pipes/number-format/number-format.pipe';

import { Statistics } from '../../../../models/btth.interface';

@Component({
  selector: 'app-unit-strength-panel',
  standalone: true,
  imports: [CommonModule, NumberFormatPipe],
  templateUrl: './unit-strength-panel.component.html',
  styleUrls: ['./unit-strength-panel.component.scss'],
})
export class UnitStrengthPanelComponent {
  @Input() statistics: Statistics;
}
