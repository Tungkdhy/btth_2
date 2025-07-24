import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feature-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feature-info.component.html',
  styleUrls: ['./feature-info.component.scss'],
})
export class FeatureInfoComponent {
  @Input() featureInfo: any;
}
