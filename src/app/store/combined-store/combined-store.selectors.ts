import { createSelector } from '@ngrx/store';
import {
  selectFilteredNetworkInfrastructureEndpointData,
  selectNetworkInfrastructureEndpointTreeCountData,
} from '../network-infrastructure-endpoint/network-infrastructure-endpoint.selectors';
import {
  selectFilteredSecurityData,
  selectSecurityEventData,
} from '../security-event/security-event.selectors';
import {
  selectFilteredNetworkInfrastructureData,
  selectNetworkInfrastructureTreeCountData,
} from '../network-infrastructure/network-infrastructure.selectors';
import { setupIdForNetworkNodes } from '../../modules/dashboard/utils/map-utils';
import { selectUnitsByPathLevel } from '../unit-btth/unit-btth.selectors';
import { Constant } from '../../core/config/constant';

// Selector tổng hợp để lấy thông tin từ cả 3 store
export const selectCombinedStatistics = createSelector(
  selectNetworkInfrastructureTreeCountData, // Network devices
  selectFilteredNetworkInfrastructureEndpointData, // Endpoints
  selectSecurityEventData, // Security events
  (networkDevices, endpoints, securityEvents) => {
    // 1. Tổng số thiết bị mạng
    const totalNetworkDevices = networkDevices.reduce(
      (total, device) => total + device.total,
      0,
    );

    // 2. Tổng số thiết bị đầu cuối
    const totalEndpoints = endpoints.reduce(
      (total, endpoint) => total + endpoint.total,
      0,
    );

    // 3. Tổng số thiết bị mạng mất kết nối (status = false)
    const totalDisconnectedNetworkDevices = networkDevices
      .filter((device) => !device.status) // Thiết bị mạng mất kết nối
      .reduce((total, device) => total + device.total, 0);

    // 4. Tổng số thiết bị vi phạm an toàn thông tin
    const totalSecurityViolations = securityEvents.reduce(
      (total, event) => total + event.total,
      0,
    );

    // 5. Danh sách unitPath, ưu tiên lấy từ network device, nếu không có thì lấy từ endpoint
    const unitPaths = networkDevices
      .map((device) => device.unitPath)
      .concat(
        endpoints
          .filter(
            (endpoint) =>
              !networkDevices.some(
                (device) => device.unitPath === endpoint.unitPath,
              ),
          )
          .map((endpoint) => endpoint.unitPath),
      );

    return {
      unitPaths,
      totalNetworkDevices,
      totalEndpoints,
      totalDisconnectedNetworkDevices,
      totalSecurityViolations,
    };
  },
);

export const selectStatisticsByCoreLayerName = (coreLayerNameFilter?: string) =>
  createSelector(
    selectFilteredNetworkInfrastructureData,
    selectFilteredNetworkInfrastructureEndpointData,
    selectFilteredSecurityData,
    (networkDevices, endpoints, securityEvents) => {
      const coreLayerStats: Record<
        string,
        {
          unitName: string;
          totalNetworkDevices: number;
          totalEndpoints: number;
          totalDisconnectedNetworkDevices: number;
          totalSecurityViolations: number;
        }
      > = {};

      // Tổng hợp dữ liệu cho network device theo coreLayerName
      networkDevices.forEach((device) => {
        const coreLayerName =
          device.coreLayerName || Constant.DEFAULT_VALUES.UNDEFINED_NAME;
        if (coreLayerNameFilter && coreLayerName !== coreLayerNameFilter) {
          return; // Bỏ qua nếu không khớp với filter
        }
        const coreId = setupIdForNetworkNodes(coreLayerName);
        const unitName = coreLayerName;

        if (!coreLayerStats[coreId]) {
          coreLayerStats[coreId] = {
            unitName,
            totalNetworkDevices: 0,
            totalEndpoints: 0,
            totalDisconnectedNetworkDevices: 0,
            totalSecurityViolations: 0,
          };
        }

        coreLayerStats[coreId].totalNetworkDevices += device.total;
        if (device.status === false) {
          coreLayerStats[coreId].totalDisconnectedNetworkDevices +=
            device.total;
        }
      });

      // Tổng hợp dữ liệu cho endpoint theo coreLayerName
      endpoints.forEach((endpoint) => {
        const coreLayerName =
          endpoint.coreLayerName || Constant.DEFAULT_VALUES.UNDEFINED_NAME;
        if (coreLayerNameFilter && coreLayerName !== coreLayerNameFilter) {
          return; // Bỏ qua nếu không khớp với filter
        }
        const coreId = setupIdForNetworkNodes(coreLayerName);
        const unitName = coreLayerName;

        if (!coreLayerStats[coreId]) {
          coreLayerStats[coreId] = {
            unitName,
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
        const coreLayerName =
          event.coreLayerName || Constant.DEFAULT_VALUES.UNDEFINED_NAME;
        if (coreLayerNameFilter && coreLayerName !== coreLayerNameFilter) {
          return; // Bỏ qua nếu không khớp với filter
        }
        const coreId = setupIdForNetworkNodes(coreLayerName);
        const unitName = coreLayerName;

        if (!coreLayerStats[coreId]) {
          coreLayerStats[coreId] = {
            unitName,
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

export const selectStatisticsByBoundaryLayerName = (
  coreLayerNameFilter?: string,
) =>
  createSelector(
    selectFilteredNetworkInfrastructureData,
    selectFilteredNetworkInfrastructureEndpointData,
    selectFilteredSecurityData,
    (networkDevices, endpoints, securityEvents) => {
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
        const coreLayerName =
          device.coreLayerName || Constant.DEFAULT_VALUES.UNDEFINED_NAME;
        const boundaryLayerName =
          device.boundaryLayerName || Constant.DEFAULT_VALUES.UNDEFINED_NAME;
        if (coreLayerNameFilter && coreLayerName !== coreLayerNameFilter) {
          return; // Bỏ qua nếu không khớp với filter
        }
        const boundaryId = setupIdForNetworkNodes(boundaryLayerName, false);
        const unitName = boundaryLayerName;

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
        if (device.status === false) {
          boundaryLayerStats[boundaryId].totalDisconnectedNetworkDevices +=
            device.total;
        }
      });

      // Tổng hợp dữ liệu cho endpoint theo boundaryLayerName
      endpoints.forEach((endpoint) => {
        const coreLayerName =
          endpoint.coreLayerName || Constant.DEFAULT_VALUES.UNDEFINED_NAME;
        const boundaryLayerName =
          endpoint.boundaryLayerName || Constant.DEFAULT_VALUES.UNDEFINED_NAME;
        if (coreLayerNameFilter && coreLayerName !== coreLayerNameFilter) {
          return; // Bỏ qua nếu không khớp với filter
        }
        const boundaryId = setupIdForNetworkNodes(boundaryLayerName, false);
        const unitName = boundaryLayerName;

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
        const coreLayerName =
          event.coreLayerName || Constant.DEFAULT_VALUES.UNDEFINED_NAME;
        const boundaryLayerName =
          event.boundaryLayerName || Constant.DEFAULT_VALUES.UNDEFINED_NAME;
        if (coreLayerNameFilter && coreLayerName !== coreLayerNameFilter) {
          return; // Bỏ qua nếu không khớp với filter
        }
        const boundaryId = setupIdForNetworkNodes(boundaryLayerName, false);
        const unitName = boundaryLayerName;

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

export const selectStatisticsByUnitPathLevel = (
  level: number,
  coreLayerNameFilter?: string,
  boundaryLayerNameFilter?: string,
  unitPathFilter?: string, // Thêm tùy chọn unitPath
) =>
  createSelector(
    selectNetworkInfrastructureTreeCountData,
    selectNetworkInfrastructureEndpointTreeCountData,
    selectSecurityEventData,
    selectUnitsByPathLevel(level), // Lấy dữ liệu unit tương ứng với level
    (networkDevices, endpoints, securityEvents, units) => {
      const unitPathStats: Record<
        string,
        {
          unitName: string;
          totalNetworkDevices: number;
          totalEndpoints: number;
          totalDisconnectedNetworkDevices: number;
          totalSecurityViolations: number;
        }
      > = {};

      const truncateUnitPath = (path: string, level: number) =>
        path.split('.').slice(0, level).join('.');

      // Tìm unitName tương ứng với unitPath
      const findUnitNameByPath = (unitPath: string) => {
        const unit = units.find((u) => u.path === unitPath);
        return unit
          ? unit.parentName
            ? `${unit.name}\n${unit.parentName}`
            : unit.name
          : Constant.DEFAULT_VALUES.UNDEFINED_NAME;
      };

      // Cộng dồn số liệu từ các unitPath cấp nhỏ hơn
      const aggregateToLevel = (path: string, data: any, level: number) => {
        const truncatedPath = truncateUnitPath(path, level);

        // Kiểm tra nếu có unitPathFilter và không khớp thì bỏ qua
        if (unitPathFilter && !truncatedPath.startsWith(unitPathFilter)) {
          return;
        }

        if (!unitPathStats[truncatedPath]) {
          unitPathStats[truncatedPath] = {
            unitName: findUnitNameByPath(truncatedPath),
            totalNetworkDevices: 0,
            totalEndpoints: 0,
            totalDisconnectedNetworkDevices: 0,
            totalSecurityViolations: 0,
          };
        }

        unitPathStats[truncatedPath].totalNetworkDevices +=
          data.totalNetworkDevices || 0;
        unitPathStats[truncatedPath].totalEndpoints += data.totalEndpoints || 0;
        unitPathStats[truncatedPath].totalDisconnectedNetworkDevices +=
          data.totalDisconnectedNetworkDevices || 0;
        unitPathStats[truncatedPath].totalSecurityViolations +=
          data.totalSecurityViolations || 0;
      };

      // Tổng hợp dữ liệu cho network device theo unitPath với cấp cao nhất
      networkDevices.forEach((device) => {
        if (
          (!coreLayerNameFilter ||
            device.coreLayerName === coreLayerNameFilter) &&
          (!boundaryLayerNameFilter ||
            device.boundaryLayerName === boundaryLayerNameFilter)
        ) {
          aggregateToLevel(
            device.unitPath,
            {
              totalNetworkDevices: device.total,
              totalDisconnectedNetworkDevices:
                device.status === false ? device.total : 0,
            },
            level,
          );
        }
      });

      // Tổng hợp dữ liệu cho endpoint theo unitPath với cấp cao nhất
      endpoints.forEach((endpoint) => {
        if (
          (!coreLayerNameFilter ||
            endpoint.coreLayerName === coreLayerNameFilter) &&
          (!boundaryLayerNameFilter ||
            endpoint.boundaryLayerName === boundaryLayerNameFilter)
        ) {
          aggregateToLevel(
            endpoint.unitPath,
            {
              totalEndpoints: endpoint.total,
            },
            level,
          );
        }
      });

      // Tổng hợp dữ liệu cho security event theo unitPath với cấp cao nhất
      securityEvents.forEach((event) => {
        if (
          (!coreLayerNameFilter ||
            event.coreLayerName === coreLayerNameFilter) &&
          (!boundaryLayerNameFilter ||
            event.boundaryLayerName === boundaryLayerNameFilter)
        ) {
          aggregateToLevel(
            event.unitPath,
            {
              totalSecurityViolations: event.total,
            },
            level,
          );
        }
      });

      // Trả về các unitPath có độ dài đúng với level được truyền vào dạng mảng
      return Object.keys(unitPathStats)
        .filter((path) => path.split('.').length === level)
        .map((path) => ({
          unitPath: path,
          ...unitPathStats[path],
        }));
    },
  );

export const selectStatisticsByUnitPath = (
  unitPath: string,
  coreLayerNameFilter?: string,
  boundaryLayerNameFilter?: string,
) =>
  createSelector(
    selectNetworkInfrastructureTreeCountData,
    selectNetworkInfrastructureEndpointTreeCountData,
    selectSecurityEventData,
    (networkDevices, endpoints, securityEvents) => {
      const unitPathStats = {
        totalNetworkDevices: 0,
        totalEndpoints: 0,
        totalDisconnectedNetworkDevices: 0,
        totalSecurityViolations: 0,
      };

      const startsWithUnitPath = (path: string, unitPath: string) =>
        path.startsWith(unitPath);

      // Cộng dồn dữ liệu cho network device với unitPath và tất cả cấp thấp hơn
      networkDevices.forEach((device) => {
        // Kiểm tra coreLayerName và boundaryLayerName trước khi cộng dồn dữ liệu
        if (
          startsWithUnitPath(device.unitPath, unitPath) &&
          (!coreLayerNameFilter ||
            device.coreLayerName === coreLayerNameFilter) &&
          (!boundaryLayerNameFilter ||
            device.boundaryLayerName === boundaryLayerNameFilter)
        ) {
          unitPathStats.totalNetworkDevices += device.total;
          if (device.status === false) {
            unitPathStats.totalDisconnectedNetworkDevices += device.total;
          }
        }
      });

      // Cộng dồn dữ liệu cho endpoint với unitPath và tất cả cấp thấp hơn
      endpoints.forEach((endpoint) => {
        // Kiểm tra coreLayerName và boundaryLayerName trước khi cộng dồn dữ liệu
        if (
          startsWithUnitPath(endpoint.unitPath, unitPath) &&
          (!coreLayerNameFilter ||
            endpoint.coreLayerName === coreLayerNameFilter) &&
          (!boundaryLayerNameFilter ||
            endpoint.boundaryLayerName === boundaryLayerNameFilter)
        ) {
          unitPathStats.totalEndpoints += endpoint.total;
        }
      });

      // Cộng dồn dữ liệu cho security event với unitPath và tất cả cấp thấp hơn
      securityEvents.forEach((event) => {
        // Kiểm tra coreLayerName và boundaryLayerName trước khi cộng dồn dữ liệu
        if (
          startsWithUnitPath(event.unitPath, unitPath) &&
          (!coreLayerNameFilter ||
            event.coreLayerName === coreLayerNameFilter) &&
          (!boundaryLayerNameFilter ||
            event.boundaryLayerName === boundaryLayerNameFilter)
        ) {
          unitPathStats.totalSecurityViolations += event.total;
        }
      });

      return {
        unitPath,
        ...unitPathStats,
      };
    },
  );

export const selectDeviceStatisticsByUnitPath = (
  unitPath: string,
  coreLayerNameFilter?: string,
  boundaryLayerNameFilter?: string,
) =>
  createSelector(
    selectNetworkInfrastructureTreeCountData,
    selectNetworkInfrastructureEndpointTreeCountData,
    selectSecurityEventData,
    (networkDevices, endpoints, securityEvents) => {
      const deviceStats = {
        router: 0,
        switch: 0,
        firewall: 0,
        server: 0,
        client: 0,
        disconnected: 0,
        infoSec: 0,
      };

      const startsWithUnitPath = (path: string, unitPath: string) =>
        path.startsWith(unitPath);

      // Thống kê cho network device theo unitPath
      networkDevices.forEach((device) => {
        if (
          startsWithUnitPath(device.unitPath, unitPath) &&
          (!coreLayerNameFilter ||
            device.coreLayerName === coreLayerNameFilter) &&
          (!boundaryLayerNameFilter ||
            device.boundaryLayerName === boundaryLayerNameFilter)
        ) {
          // Thống kê router, switch, firewall
          if (device.type === 'ROUTER') {
            deviceStats.router += device.total;
          } else if (device.type === 'SWITCH') {
            deviceStats.switch += device.total;
          } else if (device.type === 'FIREWALL') {
            deviceStats.firewall += device.total;
          }

          // Thống kê thiết bị mất kết nối
          if (device.status === false) {
            deviceStats.disconnected += device.total;
          }
        }
      });

      // Thống kê cho endpoint theo unitPath
      endpoints.forEach((endpoint) => {
        if (
          startsWithUnitPath(endpoint.unitPath, unitPath) &&
          (!coreLayerNameFilter ||
            endpoint.coreLayerName === coreLayerNameFilter) &&
          (!boundaryLayerNameFilter ||
            endpoint.boundaryLayerName === boundaryLayerNameFilter)
        ) {
          // Thống kê server và client
          if (endpoint.type === 'SERVER') {
            deviceStats.server += endpoint.total;
          } else if (endpoint.type === 'CLIENT') {
            deviceStats.client += endpoint.total;
          }
        }
      });

      // Thống kê thiết bị vi phạm an toàn thông tin từ security events
      securityEvents.forEach((event) => {
        if (
          startsWithUnitPath(event.unitPath, unitPath) &&
          (!coreLayerNameFilter ||
            event.coreLayerName === coreLayerNameFilter) &&
          (!boundaryLayerNameFilter ||
            event.boundaryLayerName === boundaryLayerNameFilter)
        ) {
          deviceStats.infoSec += event.total;
        }
      });

      return deviceStats;
    },
  );
