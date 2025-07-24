import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { UnitDetailIntegrationModel } from '../../../../../../modules/unit/models/unit-detail-integration.model';
import { UnitService } from '../../../../../../modules/unit/services/unit.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../shared/shared.module';
import { NeunIconUnitComponent } from '../../../../../../shared/neun-icon-unit/neun-icon-unit.component';

@Component({
  selector: 'app-sidebar-unit-data',
  standalone: true,
  imports: [CommonModule, SharedModule, NeunIconUnitComponent],
  templateUrl: './sidebar-unit-data.component.html',
  styleUrls: ['./sidebar-unit-data.component.scss'],
})
export class SidebarUnitDataComponent {
  private _unitData: UnitDetailIntegrationModel[];

  @Input()
  set unitData(value: UnitDetailIntegrationModel[]) {
    this._unitData = value;
    this.highestLevelUnits = this.getHighestLevelUnits(this.unitData);
  }

  get unitData(): UnitDetailIntegrationModel[] {
    return this._unitData;
  }

  @Output() selectUnit: EventEmitter<UnitDetailIntegrationModel> =
    new EventEmitter<UnitDetailIntegrationModel>();

  highestLevelUnits: UnitDetailIntegrationModel[];

  private unitService: UnitService = inject(UnitService);

  isSelectedUnitId(unitId: string | null): boolean {
    return this.unitService.isSelectedUnitId(unitId);
  }
  getChildrenFromUnitsById(
    unitTree: UnitDetailIntegrationModel[],
    unitId: string | null,
  ): UnitDetailIntegrationModel[] {
    if (!unitId) return [];
    return this.unitService.getChildrenFromUnitsById(unitTree, unitId);
  }

  getHighestLevelUnits(
    units: UnitDetailIntegrationModel[],
  ): UnitDetailIntegrationModel[] {
    return units.filter(
      (unit: UnitDetailIntegrationModel) =>
        unit.treeLevel === units[0].treeLevel,
    );
  }

  handleSelectUnit(unit: UnitDetailIntegrationModel): void {
    this.selectUnit.emit(unit);
  }
}
