import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NumberFormatPipe } from '../../../core/pipes/number-format/number-format.pipe';

@Component({
  selector: 'app-prtg-alert-card',
  standalone: true,
  imports: [CommonModule, InlineSVGModule, NumberFormatPipe],
  templateUrl: './prtg-alert-card.component.html',
  styleUrls: ['./prtg-alert-card.component.scss'],
})
export class PrtgAlertCardComponent {
  @Input() iconUrl: string;
  @Input() deviceTotal: number | null;
  @Input() deviceDown: number | null;
  @Input() name: string;
  @Input() isInfoInsecurity: boolean = false;
}
