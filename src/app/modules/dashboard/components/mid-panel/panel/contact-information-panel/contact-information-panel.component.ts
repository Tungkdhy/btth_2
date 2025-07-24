import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapSupabaseService } from '../../../../services/map-supabase.service';
import { Observable, repeat, tap } from 'rxjs';
import {
  ContactInformation,
  FeatureDisplayData,
  UnitDutyDetail,
  UnitDutySchedule,
} from '../../../../models/btth.interface';
import { map } from 'rxjs/operators';
import {
  getRegionName,
  getUnitNameOfDutyRoster,
} from '../../../../utils/table-utils';
import { Store } from '@ngrx/store';
import {
  selectDutyByUnitName,
  selectDutySchedule,
} from '../../../../../../store/duty-schedule/duty-schedule.selectors';

@Component({
  selector: 'app-contact-information-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-information-panel.component.html',
  styleUrls: ['./contact-information-panel.component.scss'],
})
export class ContactInformationPanelComponent implements OnChanges {
  @Input() selectedFeature?: FeatureDisplayData;

  location: string = '';

  contactInformation$: Observable<ContactInformation>;
  dutySchedule$: Observable<UnitDutySchedule | undefined>;

  private supabase = inject(MapSupabaseService);
  private store = inject(Store);

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.selectedFeature?.unitPath) return;
    this.contactInformation$ = this.supabase
      .getContactInformation(this.selectedFeature.unitPath)
      .pipe(
        map((contact: ContactInformation[]): ContactInformation => {
          return contact[0] ?? {};
        }),
      );

    const regionCode = this.selectedFeature.foreignCode;
    this.location = getRegionName(regionCode) ?? '';

    this.dutySchedule$ = this.store
      .select(selectDutyByUnitName(getUnitNameOfDutyRoster(regionCode)))
      .pipe(
        repeat(2),
        tap((res) => console.log('Contact: ', res)),
      );
  }
}
