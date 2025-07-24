import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FeatureDisplayData, Statistics } from '../../../models/btth.interface';
import { MapSupabaseService } from '../../../services/map-supabase.service';
import { UnitStrengthPanelComponent } from '../panel/unit-strength-panel/unit-strength-panel.component';

@Component({
  selector: 'app-unit-strength-wrapper',
  standalone: true,
  imports: [CommonModule, UnitStrengthPanelComponent],
  templateUrl: './unit-strength-wrapper.component.html',
  styleUrls: ['./unit-strength-wrapper.component.scss'],
})
export class UnitStrengthWrapperComponent implements OnInit {
  @Input() selectedFeature: FeatureDisplayData;

  stats$: Observable<Statistics>;

  private supabase = inject(MapSupabaseService);

  ngOnInit() {
    const unitPath = this.selectedFeature.unitPath;
    const boundaryCode = this.selectedFeature.code;
    const coreCode = this.selectedFeature.foreignCode;

    if (unitPath && boundaryCode && coreCode) {
      this.fetchDeviceStatistics(unitPath, boundaryCode);
    }
  }

  private fetchDeviceStatistics(unitPath: string, boundaryCode: string) {
    this.stats$ = this.supabase.getDeviceStatistics({
      subTypeList: [unitPath],
      boundaryList: [boundaryCode],
    });
  }
}
