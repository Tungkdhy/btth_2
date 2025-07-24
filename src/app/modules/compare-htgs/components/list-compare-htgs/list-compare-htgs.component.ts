import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CompareHtgsService } from '../../services/compare-htgs.service';
import { IDevice, TypeDevice } from '../../../device/models/device.model';
import { Observable } from 'rxjs';
import { ResultListPaginationModel } from '../../../../core/models/api-response.model';
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
import { map } from 'rxjs/operators';
import { ReferenceDeviceNacModel } from '../../models/reference-nac.model';
import { TokenService } from '../../../keycloak/services/token.service';
import { extractParentAndUnitName } from '../../../../_metronic/layout/core/common/common-utils';

@Component({
  selector: 'app-list-compare-htgs',
  standalone: true,
  providers: [PageService, ToolbarService, SortService],
  imports: [CommonModule, GridModule],
  templateUrl: './list-compare-htgs.component.html',
  styleUrls: ['./list-compare-htgs.component.scss'],
})
export class ListCompareHtgsComponent implements OnInit {
  pageSettings: PageSettingsModel;
  searchSettings: SearchSettingsModel;
  toolbarOptions: ToolbarItems[];
  sortOptions: SortSettingsModel;
  device$: Observable<IDevice[]>;
  system: string = '';
  type: TypeDevice;
  id: string;

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

  getUnitNamePathByUnitId(unitId: string): string {
    return this.tokenService.getUnitNamePathByUnitId(unitId);
  }

  getDeviceOnSystem(parentId: string, type: TypeDevice, system: string) {
    switch (system) {
      case 'PRTG':
        this.device$ = this.compareHtgsService
          .getDeviceRefPrtg(parentId, type, 9999, 1)
          .pipe(
            map((result: ResultListPaginationModel<IDevice>) => {
              return result.data.content.sort(this.sortByIp);
            }),
          );
        break;
      case 'NACS':
        this.device$ = this.compareHtgsService
          .getDeviceRefNac(parentId, type, 9999, 1)
          .pipe(
            map(
              (result: ResultListPaginationModel<ReferenceDeviceNacModel>) =>
                result.data.content,
            ),
            map((devices: ReferenceDeviceNacModel[]) => {
              return devices
                .map((device: ReferenceDeviceNacModel) =>
                  this.mapRefDeviceNacToIDevice(device),
                )
                .sort(this.sortByIp);
            }),
          );
        break;
    }
  }

  sortByIp = (firstElem: IDevice, secondElem: IDevice) => {
    // Helper function to check null/empty IP
    const hasIp = (ip: string) => ip !== null && ip !== '';

    // 1. If both have IPs, compare alphabetically
    if (hasIp(firstElem.managementIp) && hasIp(secondElem.managementIp)) {
      return firstElem.managementIp.localeCompare(secondElem.managementIp);
    }

    // 2. If only 'a' has IP, it comes first
    if (hasIp(firstElem.managementIp)) {
      return -1;
    }

    // 3. If only 'b' has IP, it comes first
    if (hasIp(secondElem.managementIp)) {
      return 1;
    }

    // 4. Both have no IP, order doesn't matter
    return 0;
  };

  mapRefDeviceNacToIDevice(nacModel: ReferenceDeviceNacModel): IDevice {
    return {
      category: '',
      managerName: '',
      organizationId: '',
      osVersion: '',
      uuid: nacModel.uuid,
      orderDate: nacModel.orderDate,
      code: null, // Assuming not available in the nacModel
      name: nacModel.hostName, // Assuming 'name' refers to the host name
      unitNamePath: '', // Assuming not available in the nacModel
      status: nacModel.status,
      type: nacModel.type as TypeDevice, // Determine how to set the DeviceType
      unitId: nacModel.unitId,
      vendor: nacModel.vendor,
      model: nacModel.model,
      serialNumber: nacModel.serialNumber,
      isGeneratedSn: null, //  Assuming not available in the nacModel
      managementIp: null, //  Assuming not available in the nacModel
      mac: null, //  Assuming not available in the nacModel
      description: '', //  Assuming not available in the nacModel
      room: '', //  Assuming not available in the nacModel
      floor: '', //  Assuming not available in the nacModel
      building: '', //  Assuming not available in the nacModel
      updateDate: 0,
      lastAuthentication: nacModel.lastAuthentication,

      // SNMP (set to undefined initially)
      systemHealthCpu: undefined,
      systemHealthMemory: undefined,
      systemHealthTemperatures: undefined,
    };
  }

  close() {
    this.router
      .navigate(['../'], {
        relativeTo: this.route,
        queryParams: { id: this.id },
      })
      .then();
  }

  protected readonly extractParentAndUnitName = extractParentAndUnitName;
}
