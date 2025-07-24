import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NumberFormatPipe } from 'src/app/core/pipes/number-format/number-format.pipe';

@Component({
  selector: 'app-prtg-alert-card-small',
  standalone: true,
  imports: [CommonModule, InlineSVGModule, NumberFormatPipe],
  templateUrl: './prtg-alert-card-small.component.html',
  styleUrls: ['./prtg-alert-card-small.component.scss'],
})
export class PrtgAlertCardSmallComponent {
  @Input() iconUrl: string;
  @Input() deviceTotal: number | null;
  @Input() deviceDown: number;
  @Input() name: string;
  @Input() tooltipText: string = '';

  @Input() isInfoInsecurity: boolean = false;
  @Input() internetAlerts: number | null;
  @Input() malwareAlerts: number | null;
  @Input() domainAlerts: number | null;
}
