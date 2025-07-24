import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { getLayerName } from '../../../utils/map-utils';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-info-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss'],
})
export class InfoPanelComponent implements OnChanges {
  @Input() features: any[];
  isVisible: boolean = false;

  private translationService = inject(TranslationService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.features) {
      this.isVisible = !!this.features && this.features.length > 0;
    }
  }

  getKeys(data: any): string[] {
    return Object.keys(data);
  }

  getName(id: string): string {
    const key = id.split('.')[0];
    return this.translationService.translate(key);
  }
}
