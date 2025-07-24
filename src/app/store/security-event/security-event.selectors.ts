import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SecurityEventState } from './security-event.models';
import {
  NetworkInfrastructureTreeCount,
  SecurityEventTreeCount,
} from '../../modules/dashboard/models/btth.interface';
import {
  selectNetworkInfrastructureEndpointFilters,
  selectNetworkInfrastructureEndpointTreeCountData,
} from '../network-infrastructure-endpoint/network-infrastructure-endpoint.selectors';

export const selectSecurityEventState =
  createFeatureSelector<SecurityEventState>('securityEvent');

export const selectSecurityEventData = createSelector(
  selectSecurityEventState,
  (state: SecurityEventState) => state.data,
);

export const selectSecurityEventApiFilters = createSelector(
  selectSecurityEventState,
  (state: SecurityEventState) => state.apiFilters,
);

export const selectSecurityEventFilters = createSelector(
  selectSecurityEventState,
  (state: SecurityEventState) => state.filters,
);

export const selectSecurityEventLoading = createSelector(
  selectSecurityEventState,
  (state: SecurityEventState) => state.loading,
);

export const selectSecurityEventError = createSelector(
  selectSecurityEventState,
  (state: SecurityEventState) => state.error,
);

// Selector lọc dữ liệu trực tiếp bằng cách truyền các bộ lọc từ component
export const selectFilteredSecurityTreeCountDataWithoutAction = (filters: {
  type?: string;
  unitPath?: string;
  unitName?: string;
  coreLayerName?: string;
  boundaryLayerName?: string;
  warningLevel?: number;
}) =>
  createSelector(selectSecurityEventData, (data: SecurityEventTreeCount[]) => {
    return data.filter((item) => {
      const matchesType = filters.type ? item.type === filters.type : true;
      const matchesUnitPath = filters.unitPath
        ? item.unitPath.includes(filters.unitPath)
        : true;
      const matchesUnitName = filters.unitName
        ? item.unitName?.includes(filters.unitName)
        : true;
      const matchesCoreLayerName = filters.coreLayerName
        ? item.coreLayerName === filters.coreLayerName
        : true;
      const matchesBoundaryLayerName = filters.boundaryLayerName
        ? item.boundaryLayerName === filters.boundaryLayerName
        : true;
      const matchesLevel = filters.warningLevel
        ? item.warningLevel === filters.warningLevel
        : true;

      return (
        // matchesType &&
        matchesUnitPath &&
        matchesUnitName &&
        matchesCoreLayerName &&
        matchesBoundaryLayerName &&
        matchesLevel
      );
    });
  });

export const selectFilteredSecurityData = createSelector(
  selectSecurityEventData,
  selectSecurityEventFilters,
  (data: SecurityEventTreeCount[], filters) => {
    return data.filter((item) => {
      // Apply filtering conditions based on filters. If the filter value is null, don't apply the filter.
      const matchesType = filters.type ? item.type === filters.type : true;
      const matchesUnitPath = filters.unitPath
        ? item.unitPath.includes(filters.unitPath)
        : true;
      const matchesUnitName = filters.unitName
        ? item.unitName?.includes(filters.unitName)
        : true;
      const matchesCoreLayerName = filters.coreLayerName
        ? item.coreLayerName === filters.coreLayerName
        : true;
      const matchesBoundaryLayerName = filters.boundaryLayerName
        ? item.boundaryLayerName === filters.boundaryLayerName
        : true;
      const matchesLevel = filters.warningLevel
        ? item.warningLevel === filters.warningLevel
        : true;

      // Return true if all conditions match
      return (
        // matchesType &&
        matchesUnitPath &&
        matchesUnitName &&
        matchesCoreLayerName &&
        matchesBoundaryLayerName &&
        matchesLevel
      );
    });
  },
);
