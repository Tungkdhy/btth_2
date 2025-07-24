import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NetworkInfrastructureEndpointState } from './network-infrastructure-endpoint.models';
import { NetworkInfrastructureTreeCount } from '../../modules/dashboard/models/btth.interface';

export const selectNetworkInfrastructureEndpointState =
  createFeatureSelector<NetworkInfrastructureEndpointState>(
    'networkInfrastructureEndpoint',
  );

// Select dữ liệu tổng thể
export const selectNetworkInfrastructureEndpointTreeCountData = createSelector(
  selectNetworkInfrastructureEndpointState,
  (state: NetworkInfrastructureEndpointState) => state.data,
);

// Select bộ lọc api
export const selectNetworkInfrastructureEndpointApiFilters = createSelector(
  selectNetworkInfrastructureEndpointState,
  (state: NetworkInfrastructureEndpointState) => state.apiFilters,
);

// Select bộ lọc
export const selectNetworkInfrastructureEndpointFilters = createSelector(
  selectNetworkInfrastructureEndpointState,
  (state: NetworkInfrastructureEndpointState) => state.filters,
);

// Select trạng thái loading
export const selectNetworkInfrastructureEndpointLoading = createSelector(
  selectNetworkInfrastructureEndpointState,
  (state: NetworkInfrastructureEndpointState) => state.loading,
);

// Select lỗi
export const selectNetworkInfrastructureEndpointError = createSelector(
  selectNetworkInfrastructureEndpointState,
  (state: NetworkInfrastructureEndpointState) => state.error,
);

// Selector to get filtered data based on filters
export const selectFilteredNetworkInfrastructureEndpointData = createSelector(
  selectNetworkInfrastructureEndpointTreeCountData,
  selectNetworkInfrastructureEndpointFilters,
  (data: NetworkInfrastructureTreeCount[], filters) => {
    return data.filter((item) => {
      // Apply filtering conditions based on filters. If the filter value is null, don't apply the filter.
      const typeMatch = filters.type ? item.type === filters.type : true;
      const unitPathMatch = filters.unitPath
        ? item.unitPath === filters.unitPath
        : true;
      const unitNameMatch = filters.unitName
        ? item.unitName === filters.unitName
        : true;
      const coreLayerNameMatch = filters.coreLayerName
        ? item.coreLayerName === filters.coreLayerName
        : true;
      const boundaryLayerNameMatch = filters.boundaryLayerName
        ? item.boundaryLayerName === filters.boundaryLayerName
        : true;
      const totalMatch =
        filters.total !== null ? item.total === filters.total : true;
      const statusMatch =
        filters.status !== null ? item.status === filters.status : true;

      // Return true if all conditions match
      return (
        typeMatch &&
        unitPathMatch &&
        unitNameMatch &&
        coreLayerNameMatch &&
        boundaryLayerNameMatch &&
        totalMatch &&
        statusMatch
      );
    });
  },
);
