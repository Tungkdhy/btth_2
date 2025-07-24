import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitDetailIntegrationModel } from '../../modules/unit/models/unit-detail-integration.model';
import { UtilsService } from '../../core/services/utils.service';

@Component({
  selector: 'app-neun-icon-unit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './neun-icon-unit.component.html',
  styleUrls: ['./neun-icon-unit.component.scss'],
})
export class NeunIconUnitComponent {
  @Input() unit: UnitDetailIntegrationModel | { iconId: string; name: string };

  private utils = inject(UtilsService);

  getUnitIconById(unitId: string) {
    return this.utils.getUnitIconById(unitId);
  }
}
