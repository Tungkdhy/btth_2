import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import {
  forkJoin,
  from,
  groupBy,
  Observable,
  reduce,
  switchMap,
  tap,
} from 'rxjs';
import {
  AdministrativeAreaSuggestionResult,
  AlertListPagination,
  ApiFilter,
  ContactInformation,
  CoreCode,
  GroupedAlerts,
  InfoSecAlertData,
  InfraAlertData,
  InfrastructureCount,
  InfrastructureCountMap,
  LayerIds,
  MainType,
  MapDeviceCount,
  MapStatistics,
  MonitoringSystemType,
  NetworkInfrastructureTreeCount,
  NetworkSystem,
  NewsStats,
  NodeTopology,
  NodeTopologyV2,
  SecurityEventTreeCount,
  Settings,
  Statistics,
  SysTypes,
  TopologyData,
  UnitBtth,
  UnitPath,
  UnitSuggestionResult,
} from '../models/btth.interface';
import { map, mergeMap } from 'rxjs/operators';
import { DeviceType, EndpointType } from '../models/btth.type';
import {
  convertOctetStreamToSvgMime,
  fetchAndMapData,
  getEndOfDay,
  getStartOfDay,
  groupAndSumByLayer,
} from '../../../_metronic/layout/core/common/common-utils';
import { setupIdForNetworkNodes } from '../utils/map-utils';
import { IndexedDBService } from './indexed-db.service';
import { StatsApiFilters } from '../../../store/map-interaction/device-stats/device-stats.models';
import { getRegionNameForCoreLayer } from '../../../store/map-interaction/map-interaction-utils';

@Injectable({
  providedIn: 'root',
})
export class MapSupabaseService extends SupabaseService {
  // private iconService = inject(IconService);
  private indexedDBService = inject(IndexedDBService);

  getUnits(): Observable<UnitBtth[]> {
    return from(this.callPostgresFunction('get_all_units')).pipe(
      map((result: any[]): UnitBtth[] => {
        return result.map(
          (item: any): UnitBtth => ({
            id: item.id,
            name: item.name,
            parentId: item.parent_id,
            parentName: item.parent_name,
            city: item.city,
            district: item.district,
            region: item.region,
            path: item.path,
            intId: item.int_id,
            intIdParent: item.int_id_parent,
            long: item.long,
            lat: item.lat,
            corePlace: item.core_place,
            boundaryPlace: item.boundary_place,
            core: item.core,
            boundary: item.boundary,
            hasChildren: item.has_children,
            sort: item.sort,
          }),
        );
      }),
    );
  }

  // Hàm lấy icon từ IndexedDB hoặc fetch từ URL
  // private async processIcon(item: any): Promise<void> {
  //   if (!item.upath || !item.uicon) return;
  //
  //   const existingIcon = await this.indexedDBService.getIcon(
  //     item.upath.toString(),
  //   );
  //
  //   if (!existingIcon) {
  //     try {
  //       const response = await fetch(item.uicon);
  //
  //       // Handle cases where the response is not OK (e.g., 404 or 500 status)
  //       if (!response.ok) {
  //         throw new Error(`Failed to fetch icon. Status: ${response.status}`);
  //       }
  //
  //       const blob = await response.blob();
  //       const reader = new FileReader();
  //
  //       const svgData = await new Promise<string>((resolve, reject) => {
  //         reader.onloadend = () =>
  //           resolve(convertOctetStreamToSvgMime(reader.result as string));
  //         reader.onerror = () => reject(new Error('Failed to read Blob'));
  //         reader.readAsDataURL(blob);
  //       });
  //
  //       await this.indexedDBService.storeIcon(item.upath.toString(), svgData);
  //     } catch (error) {
  //       console.error(
  //         `Error fetching or processing icon for ${item.upath}:`,
  //         error,
  //       );
  //       return; // Optionally, you can choose to rethrow or handle this differently
  //     }
  //   }
  //
  //   // Replace the icon URL with the base64 data for internal use
  //   item.uicon = await this.indexedDBService.getIcon(item.upath.toString());
  // }

  private async processIcon(item: any): Promise<void> {
    if (!item.upath || !item.uicon) return;

    const existingIcon = await this.indexedDBService.getIcon(
      item.upath.toString(),
    );

    if (!existingIcon) {
      try {
        let unitIconUrl: string =
          location.href.includes('86.194.') ||
          location.href.includes('localhost')
            ? item.uicon.replace('186.1.40.222', '86.194.64.222')
            : item.uicon;

        // if (
        //   location.href.includes('86.194.') ||
        //   location.href.includes('localhost')
        // ) {
        //   rawIconUrl.replace('186.1.40.222', '86.194.64.222');
        // }

        const response = await fetch(unitIconUrl);

        // Handle cases where the response is not OK (e.g., 404 or 500 status)
        if (!response.ok) {
          throw new Error(`Failed to fetch icon. Status: ${response.status}`);
        }

        const blob = await response.blob();

        // Convert Blob to text (SVG string)
        const svgText = await blob.text();

        // Add 'pointer-events: visibleFill;' to the <svg> element
        const modifiedSvgText = this.addPointerEvents(svgText);

        // Convert the modified SVG string back to a data URL
        const svgDataUrl = `data:image/svg+xml;base64,${btoa(modifiedSvgText)}`;

        // Store the updated SVG in IndexedDB
        await this.indexedDBService.storeIcon(
          item.upath.toString(),
          svgDataUrl,
        );
      } catch (error) {
        console.error(
          `Error fetching or processing icon for ${item.upath}:`,
          error,
        );
        return;
      }
    }

    // Replace the icon URL with the base64 data for internal use
    item.uicon = await this.indexedDBService.getIcon(item.upath.toString());
  }

  private addPointerEvents(svgContent: string): string {
    // Use regex to add 'pointer-events' to the <svg> tag if it doesn't already exist
    if (!svgContent.includes('pointer-events')) {
      return svgContent.replace(
        '<svg',
        '<svg style="pointer-events:visibleFill;"',
      );
    }
    return svgContent;
  }

  // Hàm chuyển đổi response thành NetworkSystem[]
  private transformToNetworkSystem(response: any[]): NetworkSystem[] {
    return response.map((item: any) => ({
      core: {
        id: setupIdForNetworkNodes(item.viettatloi),
        name: getRegionNameForCoreLayer(item.tenloi),
        abbr: item.viettatloi,
        longitude: item.longloi,
        latitude: item.latloi,
      },
      boundary: {
        id: setupIdForNetworkNodes(item.viettatbien, false),
        name: item.tenbien,
        path: item.upath,
        coreId: setupIdForNetworkNodes(item.viettatloi),
        coreName: item.viettatloi,
        abbr: item.viettatbien,
        longitude: item.longbien,
        latitude: item.latbien,
        device: item.thietbi,
        wan: item.wan,
        wanTn: item.wantn,
      },
      access: {
        path: item.upath,
        pathParent: item.upathparent,
        coreId: setupIdForNetworkNodes(item.viettatloi),
        coreName: item.viettatloi,
        boundaryId: setupIdForNetworkNodes(item.viettatbien, false),
        boundaryName: item.viettatbien,
        longitude: item.ulong,
        latitude: item.ulat,
        icon: item.uicon,
        name: item.uname,
        sort: item.usort,
      },
    }));
  }

  // Hàm sắp xếp NetworkSystem[] theo access.sort
  private sortNetworkSystems(networkSystems: NetworkSystem[]): NetworkSystem[] {
    return networkSystems.sort((a, b) => {
      const sortA = a.access?.sort ?? 0;
      const sortB = b.access?.sort ?? 0;
      return sortA - sortB;
    });
  }

  // Hàm chính getNetworkSystem
  getNetworkSystem(): Observable<NetworkSystem[]> {
    return from(this.fetchNetworkSystem()).pipe(
      switchMap(async (response: any[]) => {
        // Xử lý tất cả icon trước khi tiếp tục
        await Promise.all(response.map((item) => this.processIcon(item)));

        // Chuyển đổi dữ liệu và sắp xếp kết quả
        const networkSystems = this.transformToNetworkSystem(response);
        return this.sortNetworkSystems(networkSystems);
      }),
    );
  }

  private mapDataToNode(data: any): NodeTopology {
    return {
      id: data.id,
      unitId: data.unit_id,
      mainType: data.main_type,
      type: data.type,
      category: data.category,
      status: data.status,
      nms: {
        uuid: data.nms.uuid,
        serialNumber: data.nms.serial_number,
        name: data.nms.name,
        status: data.nms.status,
        type: data.nms.type,
        category: data.nms.category,
        hostName: data.nms.host_name,
        unitId: data.nms.unit_id,
        osVersion: data.nms.os_version,
        vendor: data.nms.vendor,
        model: data.nms.model,
        isAccessible: data.nms.is_accessible,
        managerName: data.nms.manager_name,
        managementIp: data.nms.management_ip,
        isGeneratedSn: data.nms.is_generated_sn,
        lastSnmp: data.nms.last_snmp,
        systemHealthCpu: data.nms.system_health_cpu,
        systemHealthMemory: data.nms.system_health_memory,
        systemHealthTemperatures: data.nms.system_health_temperatures,
        mainType: data.nms.main_type,
        lastActive: data.nms.last_active,
        lastUpdate: data.nms.last_update,
      },
      nac: data.nac,
      unit: {
        id: data.unit.id,
        name: data.unit.name,
        parentId: data.unit.parent_id,
        description: data.unit.description,
        address: data.unit.address,
        addressNumber: data.unit.address_number,
        city: data.unit.city,
        district: data.unit.district,
        street: data.unit.street,
        ward: data.unit.ward,
        iconId: data.unit.icon_id,
        sort: data.unit.sort,
        region: data.unit.region,
        intId: data.unit.int_id,
        path: data.unit.path,
        intIdParent: data.unit.int_id_parent,
        nameSearch: data.unit.name_search,
        ts: data.unit.ts,
        icondId: data.unit.icond_id,
        long: data.unit.long,
        lat: data.unit.lat,
        ttbien: data.unit.ttbien,
      },
      coor: {
        id: data.coor.id,
        serialNumber: data.coor.serial_number,
        x: data.coor.x,
        y: data.coor.y,
      },
    };
  }

  getTopologyData(
    unitPath: string,
    mainType: MainType,
  ): Observable<TopologyData | null> {
    return from(this.fetchTopologyByUnitPathV2(mainType, unitPath)).pipe(
      map((data) => {
        if (data.length === 0) return null;
        const topology = data[0];
        const nodes = topology.nodes
          ? topology.nodes.map((item: any) => this.mapDataToNodeV2(item))
          : [];
        const connectors = topology.connectors ?? [];
        return {
          nodes,
          connectors,
        };
      }),
    );
  }

  getTopologyDataBySystem(
    systemType: MonitoringSystemType,
    unitPath: string,
    mainType: MainType,
  ): Observable<TopologyData | null> {
    return from(
      this.fetchTopologyByUnitPathAndSystemType(systemType, mainType, unitPath),
    ).pipe(
      map((data) => {
        if (data.length === 0) return null;
        const topology = data[0];
        const nodes = topology.nodes
          ? topology.nodes.map((item: any) => this.mapDataToNodeV2(item))
          : [];
        const connectors = topology.connectors ?? [];
        return {
          nodes,
          connectors,
        };
      }),
    );
  }

  private mapDataToNodeV2(data: any): NodeTopologyV2 {
    return {
      id: data.id,
      name: data.name,
      unitPath: data.unit_path,
      mainType: data.main_type,
      type: data.type,
      category: data.category,
      status: data.status,
      coor: {
        id: data.coor.id,
        serialNumber: data.coor.serial_number,
        x: data.coor.x,
        y: data.coor.y,
      },
    };
  }

  mapToNetworkInfrastructureTreeCount(
    data: any,
  ): NetworkInfrastructureTreeCount[] {
    return data.map(
      (item: any): NetworkInfrastructureTreeCount => ({
        type: item.type ?? null,
        unitPath: item._unit_path ?? null,
        unitNameFull: item.unit_name_full ?? null,
        coreLayerName: item.loploi ?? null,
        boundaryLayerName: item.lopbien ?? null,
        status: item.status ?? false,
        total: item.total ?? null,
      }),
    );
  }

  mapToSecurityEventTreeCount(data: any): SecurityEventTreeCount[] {
    return data.map(
      (item: any): SecurityEventTreeCount => ({
        type: item.type,
        unitPath: item._unit_path,
        unitNameFull: item.unit_name_full,
        coreLayerName: item.loploi,
        boundaryLayerName: item.lopbien,
        total: item.total,
        warningLevel: item.warning_level,
      }),
    );
  }

  getEndpointTreeCount(
    mainType: EndpointType | null = null,
    subType: string | null = null,
    endpointType: string | null = null,
    coreLayerName: string | null = null,
    boundaryLayerName: string | null = null,
    isAuto: boolean = false,
  ): Observable<NetworkInfrastructureTreeCount[]> {
    return fetchAndMapData(
      this.fetchEndpointTreeCountFnc.bind(this),
      this.mapToNetworkInfrastructureTreeCount,
      mainType,
      subType,
      endpointType,
      coreLayerName,
      boundaryLayerName,
      isAuto,
    );
  }

  getDeviceTreeCount(
    mainType: DeviceType | null = null,
    subType: string | null = null,
    endpointType: string | null = null,
    coreLayerName: string | null = null,
    boundaryLayerName: string | null = null,
    isAuto: boolean = true,
  ): Observable<NetworkInfrastructureTreeCount[]> {
    return fetchAndMapData(
      this.fetchDeviceTreeCountFnc.bind(this),
      this.mapToNetworkInfrastructureTreeCount,
      mainType,
      subType,
      endpointType,
      coreLayerName,
      boundaryLayerName,
      isAuto,
    );
  }

  getSecurityEventTreeCount(
    mainType: string | null,
    subType: string | null = UnitPath.ROOT,
    alertType: string | null = null,
    coreLayerName: string | null = null,
    boundaryLayerName: string | null = null,
    isAuto: boolean = false,
    warningLevel: number = 3,
    fromDate?: string,
    toDate?: string,
  ): Observable<SecurityEventTreeCount[]> {
    return fetchAndMapData(
      this.fetchSecurityEventTreeCountFnc.bind(this),
      this.mapToSecurityEventTreeCount,
      mainType,
      subType,
      alertType,
      coreLayerName,
      boundaryLayerName,
      isAuto,
      warningLevel,
      fromDate,
      toDate,
    );
  }

  sumEndpointTotalByCoreLayerName(
    layerId: LayerIds,
    mainType: EndpointType | null = null,
    subType: string | null = null,
    endpointType: string | null = null,
    coreLayerName: string | null = null,
    boundaryLayerName: string | null = null,
    isAuto: boolean = true,
  ): Observable<{ name: string | null; total: number }[]> {
    const endpointData = this.getEndpointTreeCount(
      mainType,
      subType,
      endpointType,
      coreLayerName,
      boundaryLayerName,
      isAuto,
    );

    return groupAndSumByLayer(endpointData, layerId);
  }

  getCountsByLayer(
    layerId: LayerIds,
    mainType: EndpointType | DeviceType | null,
    subType: string | null,
    endpointType: string | null,
    coreLayerName: string | null,
    boundaryLayerName: string | null,
    isAuto: boolean,
    countType: 'device' | 'endpoint',
  ): Observable<InfrastructureCountMap> {
    const dataSource =
      countType === 'endpoint'
        ? this.getEndpointTreeCount(
            mainType as EndpointType,
            subType,
            endpointType,
            coreLayerName,
            boundaryLayerName,
            isAuto,
          )
        : this.getDeviceTreeCount(
            mainType as DeviceType,
            subType,
            endpointType,
            coreLayerName,
            boundaryLayerName,
            isAuto,
          );

    return dataSource.pipe(
      mergeMap((counts) => from(counts)),
      groupBy((item) => {
        let groupKey: string;
        let id: string;
        switch (layerId) {
          case LayerIds.CORE:
            groupKey = item.coreLayerName!;
            id = setupIdForNetworkNodes(item.coreLayerName!);
            break;
          case LayerIds.BOUNDARY:
            groupKey = item.boundaryLayerName!;
            id = setupIdForNetworkNodes(item.boundaryLayerName!, false);
            break;
          default:
            groupKey = item.unitPath;
            id = item.unitPath;
            break;
        }
        return { key: groupKey!, id: id };
      }),
      mergeMap((group$) =>
        group$.pipe(
          reduce(
            (acc, curr) => {
              acc.total += curr.total;
              if (countType === 'device' && !curr.status) {
                acc.disconnectedCount += curr.total;
              }
              return acc;
            },
            { total: 0, disconnectedCount: 0 },
          ),
          map(({ total, disconnectedCount }) => ({
            name: group$.key.key,
            id: group$.key.id,
            total: total,
            disconnectedCount: disconnectedCount,
          })),
        ),
      ),
      reduce(
        (
          acc: InfrastructureCountMap,
          { name, id, total, disconnectedCount },
        ) => {
          if (!acc.has(name)) {
            acc.set(name, {
              id: id,
              name: name,
              unitName: null,
              deviceCount: 0,
              endpointCount: 0,
              disconnectedCount: 0,
              alertCount: 0,
            });
          }
          const count = acc.get(name)!;
          if (countType === 'device') {
            count.deviceCount += total;
            count.disconnectedCount += disconnectedCount;
          } else {
            count.endpointCount += total;
          }
          acc.set(name, count);
          return acc;
        },
        new Map<string, InfrastructureCount>(),
      ),
    );
  }

  getSecurityEventStats(
    layerId: LayerIds,
    mainType: string | null,
    subType: string | null,
    alertType: string | null,
    coreLayerName: string | null,
    boundaryLayerName: string | null,
    isAuto: boolean,
    warningLevel: number,
  ): Observable<InfrastructureCountMap> {
    return this.getSecurityEventTreeCount(
      mainType,
      subType,
      alertType,
      coreLayerName,
      boundaryLayerName,
      isAuto,
      warningLevel,
    ).pipe(
      mergeMap((counts) => from(counts)),
      groupBy((item) => {
        let groupKey: string;
        let id: string;
        switch (layerId) {
          case LayerIds.CORE:
            groupKey = item.coreLayerName!;
            id = setupIdForNetworkNodes(item.coreLayerName!);
            break;
          case LayerIds.BOUNDARY:
            groupKey = item.boundaryLayerName!;
            id = setupIdForNetworkNodes(item.boundaryLayerName!, false);
            break;
          default:
            groupKey = item.unitPath;
            id = item.unitPath;
            break;
        }
        return { key: groupKey!, id: id };
      }),
      mergeMap((group$) =>
        group$.pipe(
          reduce((acc, curr) => acc + curr.total, 0),
          map((total) => ({
            name: group$.key.key,
            id: group$.key.id,
            total: total,
          })),
        ),
      ),
      reduce(
        (acc: InfrastructureCountMap, { name, id, total }) => {
          if (!acc.has(name)) {
            acc.set(name, {
              id: id,
              name: name,
              unitName: null,
              deviceCount: 0,
              endpointCount: 0,
              disconnectedCount: 0,
              alertCount: 0,
            });
          }
          const count = acc.get(name)!;
          count.alertCount += total;
          acc.set(name, count);
          return acc;
        },
        new Map<
          string,
          {
            id: string;
            name: string;
            unitName: string | null;
            deviceCount: number;
            endpointCount: number;
            disconnectedCount: number;
            alertCount: number;
          }
        >(),
      ),
    );
  }

  getCombinedCounts(
    layerId: LayerIds,
    mainType: EndpointType | DeviceType | null = null,
    subType: string | null = null,
    endpointType: string | null = null,
    coreLayerName: string | null = null,
    boundaryLayerName: string | null = null,
    isAuto: boolean = true,
    warningLevel: number = 3,
  ): Observable<InfrastructureCountMap> {
    const deviceCounts$ = this.getCountsByLayer(
      layerId,
      mainType,
      subType,
      endpointType,
      coreLayerName,
      boundaryLayerName,
      isAuto,
      'device',
    );
    const endpointCounts$ = this.getCountsByLayer(
      layerId,
      mainType,
      subType,
      endpointType,
      coreLayerName,
      boundaryLayerName,
      isAuto,
      'endpoint',
    );
    const alertCounts$ = this.getSecurityEventStats(
      layerId,
      mainType,
      subType,
      null, // Assuming alertType is null
      coreLayerName,
      boundaryLayerName,
      isAuto,
      warningLevel,
    );

    return deviceCounts$.pipe(
      mergeMap((deviceCounts) =>
        endpointCounts$.pipe(
          map((endpointCounts) => {
            endpointCounts.forEach((endpointCount, key) => {
              if (deviceCounts.has(key)) {
                const combinedCount = deviceCounts.get(key)!;
                combinedCount.endpointCount = endpointCount.endpointCount;
                deviceCounts.set(key, combinedCount);
              } else {
                deviceCounts.set(key, endpointCount);
              }
            });
            return deviceCounts;
          }),
        ),
      ),
      mergeMap((combinedCounts) =>
        alertCounts$.pipe(
          map((alertCounts) => {
            alertCounts.forEach((alertCount, key) => {
              if (combinedCounts.has(key)) {
                const combinedCount = combinedCounts.get(key)!;
                combinedCount.alertCount = alertCount.alertCount;
                combinedCounts.set(key, combinedCount);
              } else {
                combinedCounts.set(key, alertCount);
              }
            });
            return combinedCounts;
          }),
        ),
      ),
    );
  }

  getInfoWarfareOverview(limit: number): Observable<NewsStats[]> {
    return from(this.fetchInfoWarfareOverview(limit)).pipe(
      map((res: any) => {
        return res.map(
          (item: any): NewsStats => ({
            district: item.tinh,
            total: item.tongso,
            positive: item.tichcuc,
            negative: item.tieucuc,
            neutral: item.trungtinh,
          }),
        );
      }),
    );
  }

  searchLocationSuggestions(
    searchText: string,
  ): Observable<AdministrativeAreaSuggestionResult[]> {
    return from(
      this.callPostgresFunction('search_suggestions', {
        search_text: searchText.toLowerCase().trim(),
      }),
    ).pipe(
      map((response: any[]) => {
        return response.map((item) => ({
          id: item.id,
          cityName: item.city_name,
          districtName: item.district_name,
          geographicCode: item.geographic_code,
          coordinates: JSON.parse(item.coordinates),
          center: JSON.parse(item.center),
        }));
      }),
    );
  }

  searchUnitSuggestions(
    unitSearch: string | null,
    locationSearch: string | null,
  ): Observable<UnitSuggestionResult[]> {
    return from(
      this.callPostgresFunction('unit_search', {
        unitsearch: unitSearch?.toLowerCase().trim() || null,
        diadanh: locationSearch?.toLowerCase().trim() || null,
      }),
    ).pipe(
      map((response: any[]) => {
        return response.map((item) => ({
          id: item.id,
          unitSearch: item.unit_search,
          areaSearch: item.area_search,
          score: item.score,
          unit: item.unit,
          coordinates: item.coordinates,
        }));
      }),
    );
  }

  getDisconnectAlertList(
    params: Partial<ApiFilter>,
  ): Observable<AlertListPagination<InfraAlertData>> {
    return from(
      this.getDanhSachHeThongMatKetNoi(
        params.mainType,
        params.subType,
        params.columnType,
        params.core,
        params.boundary,
        params.searchText,
        null,
        params.page,
        params.limit,
        params.fromDate,
        params.toDate,
      ),
    ).pipe(
      map((response: any[]) =>
        this.mapAlertListPagination(response, this.mapToInfraAlertListData),
      ),
    );
  }

  // Function to map a single data item from snake_case to camelCase
  private mapToInfraAlertListData(rawItem: any): InfraAlertData {
    return {
      id: rawItem.id,
      sys: rawItem.sys,
      name: rawItem.name,
      type: rawItem.type,
      core: rawItem.loploi,
      status: rawItem.status,
      remedy: rawItem.khacfuc,
      boundary: rawItem.lopbien,
      mainType: rawItem.main_type,
      unitPath: rawItem.unit_path,
      description: rawItem.description,
      lastActive: rawItem.last_active,
    };
  }

  // Function to map the entire response from snake_case to camelCase
  private mapAlertListPagination(
    rawResponse: any,
    mappingFnc: Function,
  ): AlertListPagination<any> {
    return {
      total: rawResponse.total,
      page: rawResponse.page_index,
      limit: rawResponse.page_size,
      data: rawResponse.items.map((item: any) => mappingFnc(item)),
    };
  }

  getInfoSecAlertList(
    params: Partial<ApiFilter>,
  ): Observable<AlertListPagination<InfoSecAlertData>> {
    return from(
      this.getDanhSachCanhBao(
        params.sourceMac,
        params.mainType,
        params.subType,
        params.columnType,
        params.core,
        params.boundary,
        params.searchText,
        params.alertSource,
        null,
        params.page,
        params.limit,
        params.from,
        params.to,
      ),
    ).pipe(
      map((response: any[]) =>
        this.mapAlertListPagination(response, this.mapToInfoSecAlertListData),
      ),
    );
  }

  mapToInfoSecAlertListData(rawData: any): InfoSecAlertData {
    return {
      core: rawData.loploi,
      remedy: rawData.khacfuc ?? null,
      boundary: rawData.lopbien,
      message: rawData.message,
      portId: rawData.port_id ?? null,
      unitId: rawData.unit_id,
      deviceSn: rawData.device_sn ?? null,
      mainType: rawData.main_type ?? null,
      sourceIp: rawData.source_ip ?? null,
      unitPath: rawData.unit_path,
      alertName: rawData.alert_name,
      alertType: rawData.alert_type,
      sourceMac: rawData.source_mac,
      lastActive: rawData.last_active,
      alertSource: rawData.alert_source ?? null,
      employeeName: rawData.employee_name,
      warningLevel: rawData.warning_level,
      destinationIp: rawData.destination_ip ?? null,
      destinationMac: rawData.destination_mac ?? null,
      employeePosition: rawData.employee_position,
      destinationDomain: rawData.destination_domain ?? null,
    };
  }

  getContactInformation(unitPath: string): Observable<ContactInformation[]> {
    return from(this.fetchContactInformation(unitPath)).pipe(
      map((response: any[]) =>
        response.map((item) => ({
          id: item.id,
          name: item.ten,
          rank: item.capbac,
          position: item.chucvu,
          phone: item.dienthoai, // Add +84 or 0
          hotline: item.dienthoai_donvi,
        })),
      ),
    );
  }

  setupApiFiltersOnMapCount(
    filters: Partial<StatsApiFilters>,
  ): StatsApiFilters {
    return {
      mainType: filters.mainType ?? MainType.MILITARY,
      subTypeList: filters.subTypeList ?? [UnitPath.QS_QP],
      core: filters.core ?? null,
      coreList: filters.coreList ?? [CoreCode.A40, CoreCode.A91, CoreCode.A99],
      boundary: filters.boundary ?? null,
      boundaryList: filters.boundaryList ?? [],
      fromDate: filters.fromDate ?? getStartOfDay(),
      toDate: filters.toDate ?? getEndOfDay(),
      isFetchCore: filters.isFetchCore ?? true,
      isFetchBoundary: filters.isFetchBoundary ?? false,
      systemType: filters.systemType ?? null,
      alertType: filters.alertType ?? null,
    };
  }

  getMapDeviceCountByLevel(level: LayerIds) {
    switch (level) {
      case LayerIds.CORE:
        break;
      default:
        break;
    }
  }

  getMapDeviceCount(
    filters: Partial<StatsApiFilters>,
  ): Observable<MapStatistics> {
    const apiFilters = this.setupApiFiltersOnMapCount(filters);
    const fnc = apiFilters.isFetchCore
      ? this.fetchMapCoreDeviceCountFnc(apiFilters)
      : this.fetchMapDeviceCountFnc(apiFilters);
    return from(fnc).pipe(
      map((response: any[]) => ({
        rawData: response,
        formattedData: this.mapToDeviceStats(
          response,
          apiFilters.isFetchCore,
          apiFilters.isFetchBoundary,
          apiFilters.systemType,
        ), // Pass sysType to mapToDeviceStats
      })),
    );
  }

  mapToDeviceStats(
    data: any,
    isFetchCore: boolean,
    isFetchBoundary: boolean,
    sysType?: string | null, // Accept sysType as an optional parameter
  ): MapDeviceCount[] {
    return data.map(
      (item: any): MapDeviceCount => ({
        id: isFetchCore
          ? setupIdForNetworkNodes(item.loi, true)
          : isFetchBoundary
          ? setupIdForNetworkNodes(item.bien, false)
          : item.path,
        total: this.calculateTotalForMapDeviceCount(item.data),
        disconnected: this.calculateTotalDisconnected(item.data, sysType), // Pass sysType to calculateTotalDisconnected
      }),
    );
  }

  // Function to calculate total "tong" based on sys types
  calculateTotalForMapDeviceCount(data: any[]): number {
    return data
      .filter(
        (item) =>
          item.sys === SysTypes.FIREWALL ||
          item.sys === SysTypes.ROUTER_BCTT ||
          item.sys === SysTypes.ROUTER_CY ||
          item.sys === SysTypes.SWITCH,
      )
      .reduce((acc, item) => acc + item.tong, 0);
  }

  // Function to calculate total "mkn" based on sys types
  calculateTotalDisconnected(data: any[], sysType?: string | null): number {
    // Filter data based on sysType if provided, otherwise include all
    const filteredData = sysType
      ? data.filter((item) => item.sys === sysType)
      : data;

    // Calculate the total "mkn" for the filtered data
    return filteredData.reduce((acc, item) => acc + item.mkn, 0);
  }

  getMapEndpointCount(
    filters: Partial<StatsApiFilters>,
  ): Observable<MapStatistics> {
    const apiFilters = this.setupApiFiltersOnMapCount(filters);
    const fnc = apiFilters.isFetchCore
      ? this.fetchMapCoreEndpointCountFnc(apiFilters)
      : this.fetchMapEndpointCountFnc(apiFilters);
    return from(fnc).pipe(
      map((response: any[]) => ({
        rawData: response,
        formattedData: this.mapToEndpointStats(
          response,
          apiFilters.isFetchCore,
          apiFilters.isFetchBoundary,
        ), // Pass sysType to mapToDeviceStats
      })),
    );
  }

  mapToEndpointStats(
    data: any,
    isFetchCore: boolean,
    isFetchBoundary: boolean,
  ): MapDeviceCount[] {
    return data.map(
      (item: any): MapDeviceCount => ({
        id: isFetchCore
          ? setupIdForNetworkNodes(item.loi, true)
          : isFetchBoundary
          ? setupIdForNetworkNodes(item.bien, false)
          : item.path,
        total: this.calculateTotalForMapEndpointCount(item.data),
      }),
    );
  }

  calculateTotalForMapEndpointCount(data: any[]): number {
    return data.reduce((acc, item) => acc + item.total, 0);
  }

  getMapAlertCount(
    filters: Partial<StatsApiFilters>,
  ): Observable<MapStatistics> {
    const apiFilters = this.setupApiFiltersOnMapCount(filters);
    const fnc = apiFilters.isFetchCore
      ? this.fetchMapCoreAlertCountFnc(apiFilters)
      : this.fetchMapAlertCountFnc(apiFilters);
    return from(fnc).pipe(
      map((response: any[]) => ({
        rawData: response,
        formattedData: this.mapToAlertStats(
          response,
          apiFilters.isFetchCore,
          apiFilters.isFetchBoundary,
          apiFilters.alertType,
        ),
      })),
    );
  }

  mapToAlertStats(
    data: any,
    isFetchCore: boolean,
    isFetchBoundary: boolean,
    alertType?: string | null, // Accept alertType as an optional parameter
  ): MapDeviceCount[] {
    return data.map(
      (item: any): MapDeviceCount => ({
        id: isFetchCore
          ? setupIdForNetworkNodes(item.loi, true)
          : isFetchBoundary
          ? setupIdForNetworkNodes(item.bien, false)
          : item.path,
        total: this.calculateTotalForMapAlertCount(item.alert, alertType), // Pass alertType to calculateTotalForMapAlertCount
      }),
    );
  }

  calculateTotalForMapAlertCount(
    data: any[],
    alertType?: string | null,
  ): number {
    // Filter data based on alertType if provided, otherwise include all
    const filteredData = alertType
      ? data.filter((item) => item.alert_type === alertType)
      : data;

    // Calculate the total "tong" for the filtered data
    return filteredData.reduce((acc, item) => acc + item.tong, 0);
  }

  getDeviceStatistics(
    filters: Partial<StatsApiFilters>,
  ): Observable<Statistics> {
    const apiFilters = this.setupApiFiltersOnMapCount({
      ...filters,
      isFetchBoundary: false,
      isFetchCore: false,
    });

    // Use forkJoin to call multiple APIs in parallel
    return forkJoin({
      networkDevices: this.getMapDeviceCount(apiFilters),
      endpoints: this.getMapEndpointCount(apiFilters),
      securityEvents: this.getMapAlertCount(apiFilters),
    }).pipe(
      map(({ networkDevices, endpoints, securityEvents }) => {
        const deviceStats: Statistics = {
          router: 0,
          switch: 0,
          firewall: 0,
          server: 0,
          client: 0,
          disconnected: 0,
          infoSec: 0,
        };

        // Calculate statistics for network devices
        networkDevices.rawData.forEach((device) => {
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

        // Calculate statistics for endpoints
        endpoints.rawData.forEach((endpoint) => {
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

        // Calculate statistics for security events
        securityEvents.rawData.forEach((event) => {
          event.alert.forEach((item: any) => {
            deviceStats.infoSec += item.tong;
          });
        });

        return deviceStats;
      }),
    );
  }

  getSettings(): Observable<Settings[]> {
    return from(this.fetchSettings()).pipe(
      map((settings: any[]) => {
        return settings.map((item: any) => ({
          id: item.id,
          name: item.name,
          from: item.from,
          to: item.to,
          createdAt: item.created_at,
        }));
      }),
    );
  }
}
