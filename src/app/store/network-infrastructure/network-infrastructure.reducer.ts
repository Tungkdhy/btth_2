import { createReducer, on } from '@ngrx/store';
import * as NetworkInfrastructureActions from './network-infrastructure.actions';
import { networkInfrastructureInitialState } from './network-infrastructure.models';

export const networkInfrastructureReducer = createReducer(
  networkInfrastructureInitialState,
  on(
    NetworkInfrastructureActions.loadNetworkInfrastructureTreeCount,
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
    NetworkInfrastructureActions.loadNetworkInfrastructureTreeCountSuccess,
    (state, { data }) => ({
      ...state,
      data,
      loading: false,
      error: null,
    }),
  ),
  on(
    NetworkInfrastructureActions.loadNetworkInfrastructureTreeCountFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    }),
  ),
  on(
    NetworkInfrastructureActions.updateNetworkInfrastructureFilters,
    (state, { filters }) => ({
      ...state,
      filters: {
        ...state.filters, // giữ lại các giá trị cũ của filters
        ...filters, // chỉ ghi đè những thuộc tính được truyền vào
      },
    }),
  ),
  on(
    NetworkInfrastructureActions.refreshNetworkInfrastructureTreeCount,
    (state) => ({
      ...state,
      loading: true,
    }),
  ),
);
