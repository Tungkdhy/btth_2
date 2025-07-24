import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {SummaryBlock} from './summary.data';

@Component({
  selector: 'app-monitoring-summary',
  templateUrl: './monitoring-summary.component.html',
  styleUrls: ['./monitoring-summary.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class MonitoringSummaryComponent {
  @Input() summaries: SummaryBlock[] = [];

  constructor(private router: Router) {}

  goTo(route?: string) {
    if (route) {
      this.router.navigate([route]);
    }
  }
}
