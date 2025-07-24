import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GridModule,
  PageService,
  PageSettingsModel,
  SearchSettingsModel,
  SortService,
  SortSettingsModel,
  ToolbarItems,
  ToolbarService,
} from '@syncfusion/ej2-angular-grids';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CompareHtgsService } from '../../services/compare-htgs.service';
import { map, tap } from 'rxjs/operators';
import { ResultListPaginationModel } from '../../../../core/models/api-response.model';
import { ReferenceFmsModel } from '../../models/reference-fms.model';
import { TypeEndpointModel } from '../../../endpoint/models/endpoint.model';
import { DataTableCommonComponent } from '../../../../shared/data-table-common/data-table-common.component';
import { MainNetworkDeviceTableComponent } from '../../../device/components/main-network-device-table/main-network-device-table.component';
import { OverviewComputerTableComponent } from '../../../topology/components/overview-computer-table/overview-computer-table.component';
import { NeunLoadingComponent } from '../../../../shared/neun-loading/neun-loading.component';
import { SearchInfoSec } from '../../../../core/models/search';
import { EndpointFMSModel } from '../../../fms/models/endpoint-fms.model';
import { EndpointsEsModel } from '../../../endpoint/models/endpoints-es.model';
import { ReferenceEndpointNacModel } from '../../models/reference-nac.model';
import { TokenService } from '../../../keycloak/services/token.service';
import { ReferenceTa21Model } from '../../models/reference-ta21.model';

@Component({
  selector: 'app-list-endpoint-htgs',
  standalone: true,
  providers: [PageService, ToolbarService, SortService],
  imports: [
    CommonModule,
    GridModule,
    DataTableCommonComponent,
    MainNetworkDeviceTableComponent,
    OverviewComputerTableComponent,
    NeunLoadingComponent,
  ],
  templateUrl: './list-endpoint-htgs.component.html',
  styleUrls: ['./list-endpoint-htgs.component.scss'],
})
export class ListEndpointHtgsComponent implements OnInit {
  pageSettings: PageSettingsModel;
  searchSettings: SearchSettingsModel;
  toolbarOptions: ToolbarItems[];
  sortOptions: SortSettingsModel;
  device$: Observable<EndpointFMSModel[]>;

  system: string = '';
  type: TypeEndpointModel;
  id: string;
  public search: SearchInfoSec = new SearchInfoSec();

  private tokenService = inject(TokenService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private compareHtgsService = inject(CompareHtgsService);

  constructor() {
    this.initialGrid();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const { id, type, system } = params;
      this.id = id;
      if (id && type && system) {
        this.search = new SearchInfoSec();
        this.id = id;
        this.system = system.toUpperCase();
        this.type = type.toUpperCase();
        this.getDeviceOnSystem(id, this.type, this.system);
      } else {
        this.close();
      }
    });
  }

  initialGrid() {
    this.pageSettings = {
      pageSize: 10,
      pageSizes: [10, 20, 50],
    };

    this.searchSettings = {
      fields: ['hostName', 'managementIp', 'category'],
      operator: 'contains',
      ignoreCase: true,
    };

    this.toolbarOptions = ['Search'];

    this.sortOptions = {
      columns: [
        // { field: 'hostName', direction: 'Descending' },
        // { field: 'model', direction: 'Descending' },
        { field: 'managementIp', direction: 'Ascending' },
      ],
    };
  }

  getDeviceOnSystem(parentId: string, type: TypeEndpointModel, system: string) {
    switch (system) {
      case 'FMS':
        this.device$ = this.compareHtgsService
          .getEndpointRefFms(parentId, type, this.search.size, this.search.page)
          .pipe(
            tap(
              (res: ResultListPaginationModel<ReferenceFmsModel>) =>
                (this.search.length = res.data.totalElements),
            ),
            map(
              (result: ResultListPaginationModel<ReferenceFmsModel>) =>
                result.data.content,
            ),
            map((content: ReferenceFmsModel[]) => {
              return content.map((item: ReferenceFmsModel) =>
                this.mapEndpointsEsToFmsModel(item.main),
              );
            }),
          );
        break;
      case 'TA21':
        this.device$ = this.compareHtgsService
          .getEndpointRefTa21(
            parentId,
            type,
            this.search.size,
            this.search.page,
          )
          .pipe(
            tap(
              (res: ResultListPaginationModel<ReferenceTa21Model>) =>
                (this.search.length = res.data.totalElements),
            ),
            map(
              (result: ResultListPaginationModel<ReferenceTa21Model>) =>
                result.data.content,
            ),
            map((content: ReferenceTa21Model[]) => {
              return content.map((item: ReferenceTa21Model) =>
                this.mapReferenceTa21ToEndpointFMS(item),
              );
            }),
          );
        break;
      case 'NACS':
        this.device$ = this.compareHtgsService
          .getEndpointRefNac(parentId, type, this.search.size, this.search.page)
          .pipe(
            tap(
              (res: ResultListPaginationModel<ReferenceEndpointNacModel>) =>
                (this.search.length = res.data.totalElements),
            ),
            map(
              (result: ResultListPaginationModel<ReferenceEndpointNacModel>) =>
                result.data.content,
            ),
            map((content: ReferenceEndpointNacModel[]) => {
              console.log(content);
              console.log(
                content.map((item: ReferenceEndpointNacModel) =>
                  this.mapRefNacToFmsModel(item),
                ),
              );
              return content.map((item: ReferenceEndpointNacModel) =>
                this.mapRefNacToFmsModel(item),
              );
            }),
          );
        break;
    }
  }

  close() {
    this.router
      .navigate(['../'], {
        relativeTo: this.route,
        queryParams: { id: this.id },
      })
      .then();
  }

  changePageSize(page: number) {
    this.search.page = page;
    this.getDeviceOnSystem(this.id, this.type, this.system);
  }

  changeSize(size: number) {
    this.search.size = size;
    this.getDeviceOnSystem(this.id, this.type, this.system);
  }

  mapEndpointsEsToFmsModel(esModel: EndpointsEsModel): EndpointFMSModel {
    return {
      lastUpdate: esModel.lastUpdate,
      ram: esModel.ram,
      name: esModel.name,
      nacIp: esModel.nacIp,
      // Convert string status to boolean (or handle according to your logic)
      status: esModel.status === 'active',
      destinationDeviceHostName: esModel.destinationDeviceHostName,
      // Assuming version refers to software version
      version: esModel.miavVersion || '',
      software: esModel.software,
      updatedDate: esModel.updatedDate,
      unitName: esModel.unitName,
      serialDisk: esModel.serialDisk,
      miavVersion: esModel.miavVersion,
      unitParentId: esModel.unitParentId,
      ip: esModel.ip,
      hasTa21: esModel.hasTa21,
      id: esModel.id,
      type: esModel.type,
      freeSpaceDrive: esModel.freeSpaceDrive,
      employeePhone: esModel.employeePhone,
      os: esModel.os,
      diskFree: esModel.diskFree,
      hotfix: esModel.hotfix,
      ethernetTraffic1: esModel.ethernetTraffic1,
      cpu: esModel.cpu,
      employeeRank: esModel.employeeRank,
      computerName: esModel.computerName,
      unitId: esModel.unitId,
      physicalMemory: esModel.physicalMemory,
      employeeName: esModel.employeeName,
      unitNamePath: esModel.unitNamePath,
      ethernetTraffic0: esModel.ethernetTraffic0,
      employeePosition: esModel.employeePosition,
      serialNumber: esModel.serialNumber,
      timestamp: new Date().toISOString(), // Current timestamp
      destinationDevicePortName: esModel.destinationDevicePortName,
      destinationDeviceSn: esModel.destinationDeviceSn,
      cpuLoad: esModel.cpuLoad,
      mac: esModel.mac,
      belong: null,

      // Initialize if needed
      checked: false,
    };
  }

  mapRefNacToFmsModel(nacModel: ReferenceEndpointNacModel): EndpointFMSModel {
    return {
      // Assuming null for fields not present in the ReferenceEndpointNacModel
      lastUpdate: null,
      ram: null,
      // Use the ReferenceEndpointNacModel properties directly:
      name: '', // Assuming 'name' refers to MAC address
      nacIp: nacModel.ip,
      status: nacModel.status,
      destinationDeviceHostName: null, // Not present in nacModel
      version: '', // Not present in nacModel
      software: null,
      updatedDate: new Date(nacModel.orderDate).toISOString(),
      unitName: '', // Not present in nacModel
      serialDisk: null,
      miavVersion: null,
      unitParentId: nacModel.unitId,
      ip: nacModel.ip,
      hasTa21: null,
      id: nacModel.uuid,
      type: 'NAC', // Or set a default type if applicable
      freeSpaceDrive: null,
      employeePhone: '',
      os: null,
      diskFree: null,
      hotfix: null,
      ethernetTraffic1: null,
      cpu: null,
      employeeRank: '',
      computerName: null,
      unitId: nacModel.unitId,
      physicalMemory: null,
      employeeName: '',
      unitNamePath: this.tokenService.getUnitNamePathByUnitId(nacModel.unitId),
      ethernetTraffic0: null,
      employeePosition: '',
      serialNumber: null,
      timestamp: new Date().toISOString(),
      destinationDevicePortName: nacModel.destinationDevicePortName,
      destinationDeviceSn: nacModel.destinationDeviceSn,
      cpuLoad: null,
      mac: nacModel.mac,
      belong: null,

      // Initialize if needed
      checked: false,
    };
  }

  mapReferenceTa21ToEndpointFMS(
    ta21Model: ReferenceTa21Model,
  ): EndpointFMSModel {
    return {
      lastUpdate: null, // Assuming no direct mapping exists; set to null
      ram: null,
      name: ta21Model.employeeName || 'Chưa quản lý', // Map to 'computerName', otherwise null
      nacIp: null,
      status: null,
      destinationDeviceHostName: null,
      version: ta21Model.ta21Version, // Assuming versions align
      software: ta21Model.software,
      updatedDate: new Date(ta21Model.updatedDate).toISOString(), // Convert to ISO date string
      unitName: '', // Assuming no direct mapping
      serialDisk: null,
      miavVersion: null,
      unitParentId: ta21Model.unitId, // Mapping 'unitId'
      ip: ta21Model.ip,
      hasTa21: 'true', // Assuming TA21 existence implies 'true'
      id: ta21Model.id,
      type: 'CLIENT', // Assuming no direct mapping
      freeSpaceDrive: null,
      employeePhone: '', // Assuming no direct mapping
      os: ta21Model.os,
      diskFree: null,
      hotfix: null,
      ethernetTraffic1: null,
      cpu: null,
      employeeRank: '', // Assuming no direct mapping
      computerName: null, // Already used in 'name'
      unitId: ta21Model.unitId,
      physicalMemory: null,
      employeeName: ta21Model.employeeName,
      unitNamePath: this.tokenService.getUnitNamePathByUnitId(ta21Model.unitId), // Assuming no direct mapping
      ethernetTraffic0: null,
      employeePosition: '', // Assuming no direct mapping
      serialNumber: null,
      timestamp: new Date().toISOString(), // Set timestamp to current time
      destinationDevicePortName: null,
      destinationDeviceSn: null,
      cpuLoad: null,
      mac: ta21Model.mac,
      belong: null,

      checked: false, // Add default 'checked' property
    };
  }
}
