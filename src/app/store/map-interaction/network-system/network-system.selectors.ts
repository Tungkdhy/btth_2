import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './network-system.reducer';
import {
  AccessLayer,
  BoundaryLayer,
  CoreLayer,
  LayerIds,
  NetworkSystem,
} from '../../../modules/dashboard/models/btth.interface';

// Feature selector for networkSystems state
export const selectNetworkSystemsState =
  createFeatureSelector<State>('networkSystems');

// Selector to get all network systems
export const selectAllNetworkSystems = createSelector(
  selectNetworkSystemsState,
  (state: State) => state.networkSystems,
);

// Helper function to remove duplicate objects based on a key
function removeDuplicates<T>(array: T[], key: keyof T): T[] {
  const uniqueItems = new Map(array.map((item) => [item[key], item]));
  return Array.from(uniqueItems.values()).filter((item) => item[key] !== null);
}

// Selector to get CoreLayer array without duplicates
// export const selectCoreLayers = createSelector(
//   selectAllNetworkSystems,
//   (networkSystems: NetworkSystem[]) => {
//     const coreLayers = networkSystems
//       .map((system) => system.core)
//       .filter((item) => item.longitude && item.latitude);
//     return removeDuplicates(coreLayers, 'id');
//   },
// );

export const selectCoreLayers = (abbr?: string) =>
  createSelector(selectAllNetworkSystems, (networkSystems: NetworkSystem[]) => {
    const coreLayers = networkSystems
      .map((system) => system.core)
      .filter((item) => item.longitude && item.latitude);

    if (abbr) {
      return removeDuplicates(
        coreLayers.filter((layer) => layer.abbr === abbr),
        'id',
      );
    }

    return removeDuplicates(coreLayers, 'id');
  });

// Selector to get BoundaryLayer array without duplicates
export const selectBoundaryLayers = (coreCode?: string) =>
  createSelector(selectAllNetworkSystems, (networkSystems: NetworkSystem[]) => {
    let boundaryLayers = networkSystems
      .map((system) => system.boundary)
      .filter((item) => item.longitude && item.latitude);

    if (coreCode) {
      boundaryLayers = boundaryLayers.filter((layer) =>
        networkSystems.some(
          (system) => system.core && system.core.abbr === coreCode,
        ),
      );
    }

    return removeDuplicates(boundaryLayers, 'id');
  });

// Selector to get AccessLayer array without duplicates
export const selectAccessLayers = (coreCode?: string) =>
  createSelector(selectAllNetworkSystems, (networkSystems: NetworkSystem[]) => {
    let accessLayers = networkSystems
      .map((system) => system.access)
      .filter(
        (item) => item.longitude && item.latitude && item.path && item.icon,
      );

    if (coreCode) {
      accessLayers = accessLayers.filter((layer) =>
        networkSystems.some(
          (system) => system.core && system.core.abbr === coreCode,
        ),
      );
    }

    return removeDuplicates(accessLayers, 'path');
  });
// Selector to get CoreLayer map keyed by name
export const selectCoreLayersMap = (coreCode?: string) =>
  createSelector(
    selectAllNetworkSystems,
    (networkSystems: NetworkSystem[]): Map<string, CoreLayer> => {
      const coreLayersMap = new Map<string, CoreLayer>();

      networkSystems.forEach((system) => {
        if (system.core && system.core.abbr) {
          if (!coreCode || system.core.abbr === coreCode) {
            coreLayersMap.set(system.core.id, system.core);
          }
        }
      });

      return coreLayersMap;
    },
  );
// Selector to get BoundaryLayer map keyed by name
export const selectBoundaryLayersMap = (coreCode?: string) =>
  createSelector(
    selectAllNetworkSystems,
    (networkSystems: NetworkSystem[]): Map<string, BoundaryLayer> => {
      const boundaryLayersMap = new Map<string, BoundaryLayer>();

      networkSystems.forEach((system) => {
        if (system.boundary && system.boundary.abbr) {
          if (!coreCode || (system.core && system.core.abbr === coreCode)) {
            boundaryLayersMap.set(system.boundary.id, system.boundary);
          }
        }
      });

      return boundaryLayersMap;
    },
  );

// Selector to get AccessLayer map keyed by path
export const selectAccessLayersMap = (coreCode?: string) =>
  createSelector(
    selectAllNetworkSystems,
    (networkSystems: NetworkSystem[]): Map<string, AccessLayer> => {
      const accessLayersMap = new Map<string, AccessLayer>();

      networkSystems.forEach((system) => {
        if (
          system.access &&
          system.access.path &&
          system.access.longitude &&
          system.access.latitude &&
          system.access.icon
        ) {
          if (!coreCode || (system.core && system.core.abbr === coreCode)) {
            accessLayersMap.set(system.access.path, system.access);
          }
        }
      });

      return accessLayersMap;
    },
  );

// Selector to get AccessLayer map keyed by path
export const selectAccessLayersMapByBoundaryCodeAndLevel = (
  level: number,
  boundaryCode?: string,
  unitPath?: string,
) =>
  createSelector(
    selectAllNetworkSystems,
    (networkSystems: NetworkSystem[]): Map<string, AccessLayer> => {
      const accessLayersMap = new Map<string, AccessLayer>();

      networkSystems.forEach((system) => {
        // Điều kiện kiểm tra level
        if (
          system.access &&
          system.access.path &&
          system.access.path.split('.').length !== level
        )
          return;

        // Điều kiện kiểm tra boundaryCode và unitPath
        if (
          system.access &&
          system.access.path &&
          system.access.longitude &&
          system.access.latitude &&
          system.access.icon
        ) {
          if (
            (!boundaryCode ||
              (system.boundary && system.boundary.abbr === boundaryCode)) &&
            (!unitPath || system.access.path.startsWith(unitPath))
          ) {
            accessLayersMap.set(system.access.path, system.access);
          }
        }
      });

      return accessLayersMap;
    },
  );

// Selector to get AccessLayer map keyed by path level
export const selectAccessLayersByLevel = createSelector(
  selectAllNetworkSystems,
  (networkSystems: NetworkSystem[]): Map<number, AccessLayer[]> => {
    const accessLayersByLevel = new Map<number, AccessLayer[]>();

    networkSystems.forEach((system) => {
      if (system.access && system.access.path) {
        // Determine the level of the path (assuming path levels are separated by '.')
        const level = system.access.path.split('.').length;

        if (level >= 3) {
          if (!accessLayersByLevel.has(level)) {
            accessLayersByLevel.set(level, []);
          }
          accessLayersByLevel.get(level)!.push(system.access);
        }
      }
    });

    return accessLayersByLevel;
  },
);

export const selectDeviceInfoByNameAndLayerId = (
  code: string,
  layerId: LayerIds,
) =>
  createSelector(selectAllNetworkSystems, (networkSystems: NetworkSystem[]) => {
    const networkSystem = networkSystems.find((ns) => {
      if (layerId === LayerIds.CORE) return ns.core.abbr === code;
      else if (layerId === LayerIds.BOUNDARY) return ns.boundary.abbr === code;
    });
    if (networkSystem && layerId === LayerIds.BOUNDARY) {
      return {
        device: networkSystem.boundary.device,
        wan: networkSystem.boundary.wan,
        wanTn: networkSystem.boundary.wanTn,
      };
    }
    return null;
  });

// Selector to get AccessLayer by pathLevel
export const selectAccessLayersByPathLevel = (pathLevel: number) =>
  createSelector(selectAllNetworkSystems, (networkSystems: NetworkSystem[]) => {
    return networkSystems
      .map((system) => system.access)
      .filter(
        (access) =>
          access &&
          access.path &&
          access.path.split('.').length === pathLevel &&
          access.longitude !== null &&
          access.latitude !== null,
      );
  });

// Selector to get BoundaryLayer by coreId
export const selectBoundaryLayersByCoreId = (coreId: string | number) =>
  createSelector(selectAllNetworkSystems, (networkSystems: NetworkSystem[]) => {
    return networkSystems
      .map((system) => system.boundary)
      .filter((boundary) => boundary && boundary.coreId === coreId);
  });

// Selector to get AccessLayer by boundaryId
export const selectAccessLayersByBoundaryId = (boundaryId: string) =>
  createSelector(selectAllNetworkSystems, (networkSystems: NetworkSystem[]) => {
    return networkSystems
      .map((system) => system.access)
      .filter(
        (access) =>
          access &&
          access.boundaryId === boundaryId &&
          access.longitude !== null &&
          access.latitude !== null,
      );
  });

// Selector to get AccessLayer by boundaryCode
export const selectAccessLayersByBoundaryCode = (boundaryCode?: string) =>
  createSelector(selectAllNetworkSystems, (networkSystems: NetworkSystem[]) => {
    return networkSystems
      .map((system) => system.access)
      .filter(
        (access) =>
          access &&
          (!boundaryCode || access.boundaryName === boundaryCode) &&
          access.longitude !== null &&
          access.latitude !== null,
      );
  });

export const selectAccessLayersByBoundaryIdAndLevel = (
  boundaryId: string,
  pathLevel: number,
) =>
  createSelector(
    selectAccessLayersByPathLevel(pathLevel),
    (accessLayers: AccessLayer[]) => {
      return accessLayers.filter(
        (access) =>
          access &&
          access.boundaryId === boundaryId &&
          access.longitude !== null &&
          access.latitude !== null,
      );
    },
  );

// export const selectAccessLayersByBoundaryIdListAndLevel = (
//   boundaryIdList: string[],
//   pathLevel: number,
// ) =>
//   createSelector(
//     selectAccessLayersByPathLevel(pathLevel),
//     (accessLayers: AccessLayer[]) => {
//       return accessLayers.filter(
//         (access) =>
//           access &&
//           boundaryIdList.includes(access.boundaryId) &&
//           access.longitude !== null &&
//           access.latitude !== null,
//       );
//     },
//   );
//
// export const selectAccessIdsByBoundaryIdListAndLevel = (
//   boundaryIdList: string[],
//   pathLevel: number,
// ) =>
//   createSelector(
//     selectAccessLayersByBoundaryIdListAndLevel(boundaryIdList, pathLevel),
//     (accessLayers: AccessLayer[]) => {
//       return accessLayers.map((access) => access.path);
//     },
//   );

export const selectAccessIdsByBoundaryIdAndLevel = (
  boundaryId: string,
  pathLevel: number,
) =>
  createSelector(
    selectAccessLayersByBoundaryIdAndLevel(boundaryId, pathLevel),
    (accessLayers: AccessLayer[]) => {
      return accessLayers.map((access) => access.path);
    },
  );

export const selectAccessIdsByBoundaryId = (boundaryId: string) =>
  createSelector(
    selectAccessLayersByBoundaryId(boundaryId),
    (accessLayers: AccessLayer[]) => {
      return accessLayers.map((access) => access.path);
    },
  );

// Selector to get AccessLayer array with closest level path based on boundaryCode
export const selectNearestAccessLayersByBoundaryCode = (
  boundaryCode?: string,
) =>
  createSelector(
    selectAllNetworkSystems,
    (networkSystems: NetworkSystem[]): AccessLayer[] => {
      // Lọc tất cả các AccessLayer, nếu boundaryCode được cung cấp thì lọc theo boundaryCode
      const accessLayers = networkSystems
        .map((system) => system.access)
        .filter(
          (access) =>
            (!boundaryCode || access.boundaryName === boundaryCode) &&
            access.longitude !== null &&
            access.latitude !== null,
        );

      // Tạo một Set để lưu trữ tất cả các path đầy đủ đã tìm thấy
      const allPaths = new Set<string>(
        accessLayers.map((access) => access.path),
      );

      // Lọc các path mà không có path "cha" của nó trong danh sách
      const filteredAccessLayers = accessLayers.filter((access) => {
        const pathSegments = access.path.split('.');

        // Kiểm tra tất cả các cấp cha của path, ví dụ: từ 1.2.3.4 thì kiểm tra 1.2.3
        for (let i = 1; i < pathSegments.length; i++) {
          const parentPath = pathSegments.slice(0, i).join('.');
          if (allPaths.has(parentPath)) {
            // Nếu tìm thấy path cha, không giữ lại path này
            return false;
          }
        }

        // Nếu không có path cha nào tồn tại, giữ lại path này
        return true;
      });

      return filteredAccessLayers;
    },
  );

// Selector to get AccessLayer by unitPath and 1 level deeper
export const selectAccessLayersMapByUnitPathAndOneLevelDeeper = (
  unitPath: string,
) =>
  createSelector(
    selectAllNetworkSystems,
    (networkSystems: NetworkSystem[]): Map<string, AccessLayer> => {
      // Tính số cấp của unitPath (số dấu '.')
      const unitPathLevel = unitPath.split('.').length;

      // Tạo Map để lưu trữ các AccessLayer với unitPath là key
      const accessLayersMap = new Map<string, AccessLayer>();

      networkSystems
        .map((system) => system.access)
        .filter(
          (access) =>
            access &&
            access.path &&
            access.path.startsWith(unitPath) && // Kiểm tra path bắt đầu với unitPath
            access.path.split('.').length === unitPathLevel + 1 && // Level phải lớn hơn unitPath 1 cấp
            access.longitude !== null &&
            access.latitude !== null,
        )
        .forEach((access) => {
          // Thêm access vào map với unitPath là key
          accessLayersMap.set(access.path, access);
        });

      return accessLayersMap;
    },
  );
