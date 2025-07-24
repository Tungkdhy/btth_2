import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NumberFormatPipe } from '../../../core/pipes/number-format/number-format.pipe';

@Component({
  selector: 'app-prtg-alert-card-panel',
  standalone: true,
  imports: [CommonModule, InlineSVGModule, NumberFormatPipe],
  templateUrl: './prtg-alert-card-panel.component.html',
  styleUrls: ['./prtg-alert-card-panel.component.scss'],
})
export class PrtgAlertCardPanelComponent {
  @Input() iconUrl: string;
  @Input() deviceTotal: number | null;
  @Input() deviceDown: number;
  @Input() name: string;
}
