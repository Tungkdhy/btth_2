import { createAction, props } from '@ngrx/store';
import {
  DeviceType,
  EndpointType,
} from '../../modules/dashboard/models/btth.type';
import { NetworkInfrastructureTreeCount } from '../../modules/dashboard/models/btth.interface';
import {
  NetworkInfrastructureApiFilters,
  NetworkInfrastructureFilters,
} from './network-infrastructure.models';

export const loadNetworkInfrastructureTreeCount = createAction(
  '[Network Infrastructure] Load Tree Count',
  props<{
    mainType: DeviceType | null;
    subType: string | null;
    endpointType: string | null;
    coreLayerName: string | null;
    boundaryLayerName: string | null;
    isAuto: boolean;
  }>(),
);

export const loadNetworkInfrastructureTreeCountSuccess = createAction(
  '[Network Infrastructure] Load Tree Count Success',
  props<{ data: NetworkInfrastructureTreeCount[] }>(),
);

export const loadNetworkInfrastructureTreeCountFailure = createAction(
  '[Network Infrastructure] Load Tree Count Failure',
  props<{ error: any }>(),
);

export const updateNetworkInfrastructureFilters = createAction(
  '[Network Infrastructure] Update Filters',
  props<{ filters: Partial<NetworkInfrastructureFilters> }>(), // Sử dụng Partial để cho phép truyền một phần của filters
);

export const refreshNetworkInfrastructureTreeCount = createAction(
  '[Network Infrastructure] Refresh Tree Count',
);
