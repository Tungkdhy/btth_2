// order.effects.ts (tạo Effects và sử dụng mergeMap)
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { mergeMap } from 'rxjs/operators';
import { updateDefaultFilters, updateFilters } from './combined-store.actions';
import { updateNetworkInfrastructureFilters } from '../network-infrastructure/network-infrastructure.actions';
import { updateNetworkInfrastructureEndpointFilters } from '../network-infrastructure-endpoint/network-infrastructure-endpoint.actions';
import { updateSecurityEventFilters } from '../security-event/security-event.actions';
import { UnitPath } from '../../modules/dashboard/models/btth.interface';

@Injectable()
export class CombinedStoreEffects {
  private actions$ = inject(Actions);

  // Effect lắng nghe action updateFilters và dispatch nhiều action khác
  updateFiltersEffect$ = createEffect(() => {
    return this.actions$.pipe(
      // Lắng nghe khi action updateFilters được dispatch
      ofType(updateFilters),
      // mergeMap để dispatch nhiều action cùng lúc
      mergeMap(({ coreLayer, boundaryLayer }) => {
        const filters = {
          coreLayerName: coreLayer,
          boundaryLayerName: boundaryLayer,
        };
        return [
          updateNetworkInfrastructureFilters({ filters }),
          updateNetworkInfrastructureEndpointFilters({ filters }),
          updateSecurityEventFilters({ filters }),
        ];
      }),
    );
  });

  updateDefaultFiltersEffect$ = createEffect(() => {
    return this.actions$.pipe(
      // Lắng nghe khi action updateFilters được dispatch
      ofType(updateDefaultFilters),
      // mergeMap để dispatch nhiều action cùng lúc
      mergeMap(() => {
        const filters = {
          coreLayerName: null,
          boundaryLayerName: null,
        };
        return [
          updateNetworkInfrastructureFilters({ filters }),
          updateNetworkInfrastructureEndpointFilters({ filters }),
          updateSecurityEventFilters({ filters }),
        ];
      }),
    );
  });
}
