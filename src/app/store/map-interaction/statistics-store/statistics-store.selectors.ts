import { createSelector } from '@ngrx/store';
import * as NetworkSystemSelector from '../network-system/network-system.selectors';
import * as DeviceStatsSelector from '../device-stats/device-stats.selectors';
import * as EndpointStatsSelector from '../endpoint-stats/endpoint-stats.selectors';
import * as SecurityStatsSelector from '../security-stats/security-stats.selectors';
import * as UnitBtthSelector from '../../unit-btth/unit-btth.selectors';
import {
  CoreLayer,
  OverviewStatistics,
  Statistics,
  SysTypes,
} from '../../../modules/dashboard/models/btth.interface';
import { selectEndpointStatsRawData } from '../endpoint-stats/endpoint-stats.selectors';
import { EndpointType } from '../../../modules/dashboard/models/btth.type';
import { selectSecurityStatsRawData } from '../security-stats/security-stats.selectors';
import { getRegionNameForCoreLayer } from '../map-interaction-utils';
import { Constant } from '../../../core/config/constant';
import { sortOverviewStatistics } from '../../../modules/dashboard/utils/table-utils';

export const selectCoreStatistics = () =>
  createSelector(
    NetworkSystemSelector.selectCoreLayersMap(),
    DeviceStatsSelector.selectDeviceStatsData,
    EndpointStatsSelector.selectEndpointStatsData,
    SecurityStatsSelector.selectSecurityStatsData,
    (
      coreMap,
      networkDevices,
      endpoints,
      securityEvents,
    ): OverviewStatistics[] => {
      const coreLayerStats: Record<
        string,
        {
          unitName: string;
          parentName: string;
          totalNetworkDevices: number;
          totalEndpoints: number;
          totalDisconnectedNetworkDevices: number;
          totalSecurityViolations: number;
        }
      > = {};

      const getUnitName = (core: CoreLayer) =>
        core.abbr || Constant.DEFAULT_VALUES.UNDEFINED_NAME;
      const getParentName = (core: CoreLayer) =>
        core.name || Constant.DEFAULT_VALUES.UNDEFINED_NAME;

      // Tổng hợp dữ liệu cho network device theo coreLayerName
      networkDevices.forEach((device) => {
        const coreLayer = coreMap.get(device.id);
        if (!coreLayer) {
          return; // Bỏ qua nếu không khớp với filter
        }
        const coreId = coreLayer.id;
        const unitName = getUnitName(coreLayer);
        const parentName = getParentName(coreLayer);

        if (!coreLayerStats[coreId]) {
          coreLayerStats[coreId] = {
            unitName,
            parentName,
            totalNetworkDevices: 0,
            totalEndpoints: 0,
            totalDisconnectedNetworkDevices: 0,
            totalSecurityViolations: 0,
          };
        }

        coreLayerStats[coreId].totalNetworkDevices += device.total;
        coreLayerStats[coreId].totalDisconnectedNetworkDevices +=
          device.disconnected || 0;
      });

      // Tổng hợp dữ liệu cho endpoint theo coreLayerName
      endpoints.forEach((endpoint) => {
        const coreLayer = coreMap.get(endpoint.id);
        if (!coreLayer) {
          return; // Bỏ qua nếu không khớp với filter
        }
        const coreId = coreLayer.id;
        const unitName = getUnitName(coreLayer);
        const parentName = getParentName(coreLayer);

        if (!coreLayerStats[coreId]) {
          coreLayerStats[coreId] = {
            unitName,
            parentName,
            totalNetworkDevices: 0,
            totalEndpoints: 0,
            totalDisconnectedNetworkDevices: 0,
            totalSecurityViolations: 0,
          };
        }

        coreLayerStats[coreId].totalEndpoints += endpoint.total;
      });

      // Tổng hợp dữ liệu cho security event theo coreLayerName
      securityEvents.forEach((event) => {
        const coreLayer = coreMap.get(event.id);
        if (!coreLayer) {
          return; // Bỏ qua nếu không khớp với filter
        }
        const coreId = coreLayer.id;
        const unitName = getUnitName(coreLayer);
        const parentName = getParentName(coreLayer);

        if (!coreLayerStats[coreId]) {
          coreLayerStats[coreId] = {
            unitName,
            parentName,
            totalNetworkDevices: 0,
            totalEndpoints: 0,
            totalDisconnectedNetworkDevices: 0,
            totalSecurityViolations: 0,
          };
        }

        coreLayerStats[coreId].totalSecurityViolations += event.total;
      });

      // Trả về dạng mảng với unitPath và unitName
      return Object.keys(coreLayerStats)
        .map((coreId) => ({
          unitPath: coreId,
          ...coreLayerStats[coreId],
        }))
        .filter(
          (item) => item.unitName !== Constant.DEFAULT_VALUES.UNDEFINED_NAME,
        );
    },
  );

export const selectBoundaryStatistics = () =>
  createSelector(
    NetworkSystemSelector.selectBoundaryLayersMap(),
    DeviceStatsSelector.selectDeviceStatsData,
    EndpointStatsSelector.selectEndpointStatsData,
    SecurityStatsSelector.selectSecurityStatsData,
    (
      boundaryMap,
      networkDevices,
      endpoints,
      securityEvents,
    ): OverviewStatistics[] => {
      const boundaryLayerStats: Record<
        string,
        {
          unitName: string;
          totalNetworkDevices: number;
          totalEndpoints: number;
          totalDisconnectedNetworkDevices: number;
          totalSecurityViolations: number;
        }
      > = {};

      // Tổng hợp dữ liệu cho network device theo boundaryLayerName
      networkDevices.forEach((device) => {
        const boundaryLayer = boundaryMap.get(device.id);
        if (!boundaryLayer) {
          return; // Bỏ qua nếu không khớp với filter
        }
        const boundaryId = boundaryLayer.id;
        const unitName =
          boundaryLayer.name || Constant.DEFAULT_VALUES.UNDEFINED_NAME;

        if (!boundaryLayerStats[boundaryId]) {
          boundaryLayerStats[boundaryId] = {
            unitName,
            totalNetworkDevices: 0,
            totalEndpoints: 0,
            totalDisconnectedNetworkDevices: 0,
            totalSecurityViolations: 0,
          };
        }

        boundaryLayerStats[boundaryId].totalNetworkDevices += device.total;
        boundaryLayerStats[boundaryId].totalDisconnectedNetworkDevices +=
          device.disconnected || 0;
      });

      // Tổng hợp dữ liệu cho endpoint theo boundaryLayerName
      endpoints.forEach((endpoint) => {
        const boundaryLayer = boundaryMap.get(endpoint.id);
        if (!boundaryLayer) {
          return; // Bỏ qua nếu không khớp với filter
        }
        const boundaryId = boundaryLayer.id;
        const unitName =
          boundaryLayer.name || Constant.DEFAULT_VALUES.UNDEFINED_NAME;

        if (!boundaryLayerStats[boundaryId]) {
          boundaryLayerStats[boundaryId] = {
            unitName,
            totalNetworkDevices: 0,
            totalEndpoints: 0,
            totalDisconnectedNetworkDevices: 0,
            totalSecurityViolations: 0,
          };
        }
        boundaryLayerStats[boundaryId].totalEndpoints += endpoint.total;
      });

      // Tổng hợp dữ liệu cho security event theo boundaryLayerName
      securityEvents.forEach((event) => {
        const boundaryLayer = boundaryMap.get(event.id);
        if (!boundaryLayer) {
          return; // Bỏ qua nếu không khớp với filter
        }
        const boundaryId = boundaryLayer.id;
        const unitName =
          boundaryLayer.name || Constant.DEFAULT_VALUES.UNDEFINED_NAME;

        if (!boundaryLayerStats[boundaryId]) {
          boundaryLayerStats[boundaryId] = {
            unitName,
            totalNetworkDevices: 0,
            totalEndpoints: 0,
            totalDisconnectedNetworkDevices: 0,
            totalSecurityViolations: 0,
          };
        }
        boundaryLayerStats[boundaryId].totalSecurityViolations += event.total;
      });

      // Trả về dạng mảng
      return Object.keys(boundaryLayerStats).map((boundaryId) => ({
        unitPath: boundaryId,
        ...boundaryLayerStats[boundaryId],
      }));
    },
  );

export const selectAccessStatistics = () =>
  createSelector(
    NetworkSystemSelector.selectAccessLayersMap(),
    DeviceStatsSelector.selectDeviceStatsData,
    EndpointStatsSelector.selectEndpointStatsData,
    SecurityStatsSelector.selectSecurityStatsData,
    UnitBtthSelector.selectUnits,
    (
      accessMap,
      networkDevices,
      endpoints,
      securityEvents,
      units,
    ): OverviewStatistics[] => {
      const accessLayerStats: Record<
        string,
        {
          unitName: string;
          totalNetworkDevices: number;
          totalEndpoints: number;
          totalDisconnectedNetworkDevices: number;
          totalSecurityViolations: number;
          sort: number | null;
        }
      > = {};

      // Tổng hợp dữ liệu cho network device theo boundaryLayerName
      networkDevices.forEach((device) => {
        const accessLayer = accessMap.get(device.id);
        if (!accessLayer) {
          return; // Bỏ qua nếu không khớp với filter
        }
        const accessId = accessLayer.path;
        const unitName =
          accessLayer.name || Constant.DEFAULT_VALUES.UNDEFINED_NAME;

        if (!accessLayerStats[accessId]) {
          accessLayerStats[accessId] = {
            unitName,
            totalNetworkDevices: 0,
            totalEndpoints: 0,
            totalDisconnectedNetworkDevices: 0,
            totalSecurityViolations: 0,
            sort: accessLayer.sort,
          };
        }

        accessLayerStats[accessId].totalNetworkDevices += device.total;
        accessLayerStats[accessId].totalDisconnectedNetworkDevices +=
          device.disconnected || 0;
      });

      // Tổng hợp dữ liệu cho endpoint theo boundaryLayerName
      endpoints.forEach((endpoint) => {
        const accessLayer = accessMap.get(endpoint.id);
        if (!accessLayer) {
          return; // Bỏ qua nếu không khớp với filter
        }
        const accessId = accessLayer.path;
        const unitName =
          accessLayer.name || Constant.DEFAULT_VALUES.UNDEFINED_NAME;

        if (!accessLayerStats[accessId]) {
          accessLayerStats[accessId] = {
            unitName,
            totalNetworkDevices: 0,
            totalEndpoints: 0,
            totalDisconnectedNetworkDevices: 0,
            totalSecurityViolations: 0,
            sort: accessLayer.sort,
          };
        }
        accessLayerStats[accessId].totalEndpoints += endpoint.total;
      });

      // Tổng hợp dữ liệu cho security event theo boundaryLayerName
      securityEvents.forEach((event) => {
        const accessLayer = accessMap.get(event.id);
        if (!accessLayer) {
          return; // Bỏ qua nếu không khớp với filter
        }
        const accessId = accessLayer.path;
        const unitName =
          accessLayer.name || Constant.DEFAULT_VALUES.UNDEFINED_NAME;

        if (!accessLayerStats[accessId]) {
          accessLayerStats[accessId] = {
            unitName,
            totalNetworkDevices: 0,
            totalEndpoints: 0,
            totalDisconnectedNetworkDevices: 0,
            totalSecurityViolations: 0,
            sort: accessLayer.sort,
          };
        }
        accessLayerStats[accessId].totalSecurityViolations += event.total;
      });

      // Trả về dạng mảng
      return sortOverviewStatistics(
        Object.keys(accessLayerStats)
          .map((accessId) => ({
            unitPath: accessId,
            ...accessLayerStats[accessId],
          }))
          .map((unit) => ({
            ...unit,
            parentName: units.find((item) => item.path === unit.unitPath)
              ?.parentName,
          })),
      );
    },
  );

// export const selectStatisticsByUnitPath = (
//   unitPath: string,
//   coreLayerNameFilter?: string,
//   boundaryLayerNameFilter?: string,
// ) =>
//   createSelector(
//     DeviceStatsSelector.selectDeviceStatsData,
//     EndpointStatsSelector.selectEndpointStatsData,
//     SecurityStatsSelector.selectSecurityStatsData,
//     (networkDevices, endpoints, securityEvents) => {
//       const unitPathStats = {
//         totalNetworkDevices: 0,
//         totalEndpoints: 0,
//         totalDisconnectedNetworkDevices: 0,
//         totalSecurityViolations: 0,
//       };
//
//       const startsWithUnitPath = (path: string, unitPath: string) =>
//         path.startsWith(unitPath);
//
//       // Cộng dồn dữ liệu cho network device với unitPath và tất cả cấp thấp hơn
//       networkDevices.forEach((device) => {
//         // Kiểm tra coreLayerName và boundaryLayerName trước khi cộng dồn dữ liệu
//         if (
//           startsWithUnitPath(device.unitPath, unitPath) &&
//           (!coreLayerNameFilter ||
//             device.coreLayerName === coreLayerNameFilter) &&
//           (!boundaryLayerNameFilter ||
//             device.boundaryLayerName === boundaryLayerNameFilter)
//         ) {
//           unitPathStats.totalNetworkDevices += device.total;
//           if (device.status === false) {
//             unitPathStats.totalDisconnectedNetworkDevices += device.total;
//           }
//         }
//       });
//
//       // Cộng dồn dữ liệu cho endpoint với unitPath và tất cả cấp thấp hơn
//       endpoints.forEach((endpoint) => {
//         // Kiểm tra coreLayerName và boundaryLayerName trước khi cộng dồn dữ liệu
//         if (
//           startsWithUnitPath(endpoint.unitPath, unitPath) &&
//           (!coreLayerNameFilter ||
//             endpoint.coreLayerName === coreLayerNameFilter) &&
//           (!boundaryLayerNameFilter ||
//             endpoint.boundaryLayerName === boundaryLayerNameFilter)
//         ) {
//           unitPathStats.totalEndpoints += endpoint.total;
//         }
//       });
//
//       // Cộng dồn dữ liệu cho security event với unitPath và tất cả cấp thấp hơn
//       securityEvents.forEach((event) => {
//         // Kiểm tra coreLayerName và boundaryLayerName trước khi cộng dồn dữ liệu
//         if (
//           startsWithUnitPath(event.unitPath, unitPath) &&
//           (!coreLayerNameFilter ||
//             event.coreLayerName === coreLayerNameFilter) &&
//           (!boundaryLayerNameFilter ||
//             event.boundaryLayerName === boundaryLayerNameFilter)
//         ) {
//           unitPathStats.totalSecurityViolations += event.total;
//         }
//       });
//
//       return {
//         unitPath,
//         ...unitPathStats,
//       };
//     },
//   );

export const selectUnitStatistics = () =>
  createSelector(
    DeviceStatsSelector.selectDeviceStatsRawData,
    EndpointStatsSelector.selectEndpointStatsRawData,
    SecurityStatsSelector.selectSecurityStatsRawData,
    (networkDevices, endpoints, securityEvents): Statistics => {
      const deviceStats = {
        router: 0,
        switch: 0,
        firewall: 0,
        server: 0,
        client: 0,
        disconnected: 0,
        infoSec: 0,
      };

      // Thống kê cho network device theo unitPath
      networkDevices.forEach((device) => {
        device.data.forEach((item: any) => {
          const systemType = item.sys as SysTypes;
          switch (systemType) {
            case SysTypes.ROUTER_CY:
            case SysTypes.ROUTER_BCTT:
              deviceStats.router += item.tong;
              break;
            case SysTypes.FIREWALL:
              deviceStats.firewall += item.tong;
              break;
            case SysTypes.SWITCH:
              deviceStats.switch += item.tong;
              break;
          }
          deviceStats.disconnected += item.mkn;
        });
      });

      // Thống kê cho endpoint theo unitPath
      endpoints.forEach((endpoint) => {
        endpoint.data.forEach((item: any) => {
          const systemType = item.type as EndpointType;
          switch (systemType) {
            case 'SERVER':
              deviceStats.server += item.total;
              break;
            case 'CLIENT':
              deviceStats.client += item.total;
              break;
          }
        });
      });

      // Thống kê thiết bị vi phạm an toàn thông tin từ security events
      securityEvents.forEach((event) => {
        event.data.forEach((item: any) => {
          deviceStats.infoSec += item.tong;
        });
      });

      return deviceStats;
    },
  );
