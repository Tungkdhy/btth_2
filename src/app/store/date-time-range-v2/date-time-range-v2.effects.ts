import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MapSupabaseService } from '../../modules/dashboard/services/map-supabase.service';
import * as DateTimeRangeActionsV2 from './date-time-range-v2.actions';
import { map, mergeMap } from 'rxjs/operators';

@Injectable()
export class DateTimeRangeV2Effects {
  private actions$ = inject(Actions);
  private supabse = inject(MapSupabaseService);

  loadDate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DateTimeRangeActionsV2.loadDateV2), // TODO: Noti error settings
      mergeMap(() =>
        this.supabse.getSettings().pipe(
          map((data) => {
            const dateRecord = data.filter((item) => item.name === 'main')[0];
            return DateTimeRangeActionsV2.setDateV2({
              startDate: new Date(dateRecord.from),
              endDate: new Date(dateRecord.to),
            });
          }),
        ),
      ),
    );
  });
}
