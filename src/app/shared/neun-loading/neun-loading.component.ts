import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-neun-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './neun-loading.component.html',
  styles: [],
})
export class NeunLoadingComponent {
  @Input() align: 'center' | 'left' | 'right' = 'center';

  alignText(): string {
    switch (this.align) {
      case 'left':
        return 'text-left';
      case 'right':
        return 'text-right';
      default:
        return 'text-center';
    }
  }
}
