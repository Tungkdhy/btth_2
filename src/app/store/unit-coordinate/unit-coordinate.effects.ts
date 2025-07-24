// import { UnitCoordinateService } from '../../modules/digital-map/services/unit-coordinate.service';
// import { Actions, createEffect, ofType } from '@ngrx/effects';
// import { inject, Injectable } from '@angular/core';
// import {
//   loadUnitCoordinate,
//   loadDataFailure,
//   loadDataSuccess,
//   loadCoordinatesChildrenByUnitId,
// } from './unit-coordinate.actions';
// import {
//   catchError,
//   exhaustMap,
//   map,
//   mergeMap,
//   switchMap,
// } from 'rxjs/operators';
// import { of, tap } from 'rxjs';
// import { UnitCoordinate } from '../../modules/unit/models/unit.model';

// @Injectable()
// export class UnitCoordinateEffects {
//   private actions$: Actions = inject(Actions);
//   private unitCoordinateService: UnitCoordinateService = inject(
//     UnitCoordinateService,
//   );

//   loadData$ = createEffect(() => {
//     return this.actions$.pipe(
//       ofType(loadUnitCoordinate),
//       mergeMap(() =>
//         this.unitCoordinateService.getData().pipe(
//           map((data) => loadDataSuccess({ data })),
//           catchError((error) => of(loadDataFailure({ error }))),
//         ),
//       ),
//     );
//   });

//   loadCoordinatesChildrenByUnitId$ = createEffect(() => {
//     return this.actions$.pipe(
//       ofType(loadCoordinatesChildrenByUnitId),
//       exhaustMap((action) =>
//         this.unitCoordinateService.getChildrenByUnitId(action.unitId).pipe(
//           map((data: UnitCoordinate[]) => loadDataSuccess({ data })),
//           catchError((error) => of(loadDataFailure({ error }))),
//         ),
//       ),
//     );
//   });
// }
