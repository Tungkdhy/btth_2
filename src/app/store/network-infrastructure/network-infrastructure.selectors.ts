import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NetworkInfrastructureState } from './network-infrastructure.models';
import { NetworkInfrastructureTreeCount } from '../../modules/dashboard/models/btth.interface';

export const selectNetworkInfrastructureState =
  createFeatureSelector<NetworkInfrastructureState>('networkInfrastructure');

// Select dữ liệu tổng thể
export const selectNetworkInfrastructureTreeCountData = createSelector(
  selectNetworkInfrastructureState,
  (state: NetworkInfrastructureState) => state.data,
);

// Select bộ lọc api
export const selectNetworkInfrastructureApiFilters = createSelector(
  selectNetworkInfrastructureState,
  (state: NetworkInfrastructureState) => state.apiFilters,
);

// Select bộ lọc
export const selectNetworkInfrastructureFilters = createSelector(
  selectNetworkInfrastructureState,
  (state: NetworkInfrastructureState) => state.filters,
);

// Selector to get filtered data based on filters
export const selectFilteredNetworkInfrastructureData = createSelector(
  selectNetworkInfrastructureTreeCountData,
  selectNetworkInfrastructureFilters,
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

// Select trạng thái loading
export const selectNetworkInfrastructureLoading = createSelector(
  selectNetworkInfrastructureState,
  (state: NetworkInfrastructureState) => state.loading,
);

// Select lỗi
export const selectNetworkInfrastructureError = createSelector(
  selectNetworkInfrastructureState,
  (state: NetworkInfrastructureState) => state.error,
);
