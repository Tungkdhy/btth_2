import { createReducer, on } from '@ngrx/store';
import * as NetworkInfrastructureEndpointActions from './network-infrastructure-endpoint.actions';
import { networkInfrastructureEndpointInitialState } from './network-infrastructure-endpoint.models';

export const networkInfrastructureEndpointReducer = createReducer(
  networkInfrastructureEndpointInitialState,
  on(
    NetworkInfrastructureEndpointActions.loadNetworkInfrastructureEndpointTreeCount,
    (state, action) => ({
      ...state,
      loading: true,
      error: null,
      apiFilters: {
        mainType: action.mainType,
        subType: action.subType,
        endpointType: action.endpointType,
        coreLayerName: action.coreLayerName,
        boundaryLayerName: action.boundaryLayerName,
        isAuto: action.isAuto,
      },
    }),
  ),
  on(
    NetworkInfrastructureEndpointActions.loadNetworkInfrastructureEndpointTreeCountSuccess,
    (state, { data }) => ({
      ...state,
      data,
      loading: false,
      error: null,
    }),
  ),
  on(
    NetworkInfrastructureEndpointActions.loadNetworkInfrastructureEndpointTreeCountFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    }),
  ),
  on(
    NetworkInfrastructureEndpointActions.updateNetworkInfrastructureEndpointFilters,
    (state, { filters }) => ({
      ...state,
      filters: {
        ...state.filters, // giữ lại các giá trị cũ của filters
        ...filters, // chỉ ghi đè những thuộc tính được truyền vào
      },
    }),
  ),
  on(
    NetworkInfrastructureEndpointActions.refreshNetworkInfrastructureEndpointTreeCount,
    (state) => ({
      ...state,
      loading: true,
    }),
  ),
);
