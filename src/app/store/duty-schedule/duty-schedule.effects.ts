import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as DutyActions from './duty-schedule.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DutyScheduleService } from '../../modules/dashboard/services/duty-schedule.service';

@Injectable()
export class DutyEffects {
  private actions$ = inject(Actions);
  private dutyScheduleService = inject(DutyScheduleService);

  loadDutySchedule$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DutyActions.loadDutySchedule),
      mergeMap(() =>
        this.dutyScheduleService.getDutySchedule().pipe(
          map((dutySchedule) =>
            DutyActions.loadDutyScheduleSuccess({ dutySchedule }),
          ),
          catchError((error) =>
            of(DutyActions.loadDutyScheduleFailure({ error })),
          ),
        ),
      ),
    );
  });

  loadUnitDutyById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DutyActions.loadUnitDutyById),
      mergeMap((action) =>
        this.dutyScheduleService.getUnitDutyId(action.unitId).pipe(
          map((unitDutyDetail) =>
            DutyActions.loadUnitDutyByIdSuccess({ unitDutyDetail }),
          ),
          catchError((error) =>
            of(DutyActions.loadUnitDutyByIdFailure({ error })),
          ),
        ),
      ),
    );
  });
}
