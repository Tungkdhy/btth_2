import { createAction, props } from '@ngrx/store';
import {
  DeviceType,
  EndpointType,
} from '../../modules/dashboard/models/btth.type';
import { NetworkInfrastructureTreeCount } from '../../modules/dashboard/models/btth.interface';
import {
  NetworkInfrastructureEndpointApiFilters,
  NetworkInfrastructureEndpointFilters,
} from './network-infrastructure-endpoint.models';

export const loadNetworkInfrastructureEndpointTreeCount = createAction(
  '[Network Infrastructure Endpoint] Load Tree Count',
  props<{
    mainType: EndpointType | null;
    subType: string | null;
    endpointType: string | null;
    coreLayerName: string | null;
    boundaryLayerName: string | null;
    isAuto: boolean;
  }>(),
);

export const loadNetworkInfrastructureEndpointTreeCountSuccess = createAction(
  '[Network Infrastructure Endpoint] Load Tree Count Success',
  props<{ data: NetworkInfrastructureTreeCount[] }>(),
);

export const loadNetworkInfrastructureEndpointTreeCountFailure = createAction(
  '[Network Infrastructure Endpoint] Load Tree Count Failure',
  props<{ error: any }>(),
);

export const updateNetworkInfrastructureEndpointFilters = createAction(
  '[Network Infrastructure Endpoint] Update Filters',
  props<{ filters: Partial<NetworkInfrastructureEndpointFilters> }>(),
);

export const refreshNetworkInfrastructureEndpointTreeCount = createAction(
  '[Network Infrastructure Endpoint] Refresh Tree Count',
);
