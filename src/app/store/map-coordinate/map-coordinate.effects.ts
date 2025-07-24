import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject, Injectable } from '@angular/core';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  loadMapCoordinates,
  loadMapCoordinatesFailure,
  loadMapCoordinatesSuccess,
} from './map-coordinate.actions';
// import { MapCoordinateService } from '../../modules/map-coordinate/services/map-coordinate.service';

@Injectable()
export class MapCoordinateEffects {
  private actions$: Actions = inject(Actions);
  // private mapCoordinateService: MapCoordinateService =
  //   inject(MapCoordinateService);

  // loadMapCoordinates$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(loadMapCoordinates)
  //     // exhaustMap(() =>
  //     //   this.mapCoordinateService.getAllMapCoordinates().pipe(
  //     //     map((data) => loadMapCoordinatesSuccess({ data })),
  //     //     catchError((error) => of(loadMapCoordinatesFailure({ error }))),
  //     //   ),
  //     ),
  //   );
  // });
}
