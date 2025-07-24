import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import {
  getIpTenMien,
  getLastActive,
  getType,
  getTypeNetwork,
  getValueAlertType,
} from '../../../../utils/table-utils';
import { convertIsoToFormattedDate } from '../../../../../../_metronic/layout/core/common/common-utils';
import { EventDataPayload } from '../../../../models/payload-channel';
import { MapSubType } from '../../../../models/btth.interface';
import { error } from 'ol/console';

interface NetworkInfrastructure {
  // category: string;
  description: string;
  // coor: Coordinate;
  id: string;
  remedy: string | null;
  lastActive: string; // Assuming ISO date string
  boundary: string;
  core: string;
  mainType: string;
  // managementIp: string;
  // model: string | null;
  name: string;
  // serialNumber: string;
  source: string;
  status: boolean;
  sys: string;
  type: string;
  // unitNameFull: string;
  unitPath: string;
  unitPathText: string;
  // vendor: string | null;
}

interface Unit {
  name: string;
  path: string;
  unitNameFull: string;
}

interface SecurityInfo {
  alertType: string;
  employeeName: string;
  remedy: string | null;
  lastActive: string; // Assuming ISO date string
  core: string;
  boundary: string;
  mainType: string;
  message: string;
  sourceIp: string | null;
  sourceMac: string;
  unit: Unit;
}

@Component({
  selector: 'app-alert-list-card',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './alert-list-card.component.html',
  styleUrls: ['./alert-list-card.component.scss'],
})
export class AlertListCardComponent implements OnInit, OnChanges {
  @Input() eventDataPayload: EventDataPayload;
  @Output() moveToFeature: EventEmitter<any> = new EventEmitter();

  networkInfraData: NetworkInfrastructure[];
  secInfoData: SecurityInfo[];

  protected readonly MapSubType = MapSubType;

  // Columns configuration
  networkInfrastructureColumns = [
    {
      key: 'name',
      label: 'Đơn vị',
      isVisible: true,
      cellRenderer: (data: any) => `
              <cite>
                <ins class="status_onl"></ins>
                <div>
                  ${data.name.split('\n')[0] || ''}
                </div>
              </cite>
              <div>
                  ${data.name.split('\n')[1] || ''}
              </div>
      `,
    },
    {
      key: 'mainType',
      label: 'Loại',
      isVisible: true,
      cellRenderer: (data: any) =>
        `
            ${getType(data)}
            <div>
              <em>${getTypeNetwork(data?.mainType)}</em>
            </div>
        `,
    },
    {
      key: 'ip',
      label: 'IP/Tên miền',
      isVisible: true,
      cellRenderer: (data: any) => {
        return `
            ${getIpTenMien(data)}
        `;
      },
    },
    {
      key: 'lastActive',
      label: 'Kết nối gần nhất',
      isVisible: true,
      cellRenderer: (data: any) =>
        `
            <div>${
              convertIsoToFormattedDate(getLastActive(data)).split(' ')[0] ?? ''
            }</div>
            <em>${
              convertIsoToFormattedDate(getLastActive(data)).split(' ')[1] ?? ''
            }</em>
        `,
    },
  ];

  securityInfoColumns = [
    {
      key: 'unitNameFull',
      label: 'Đơn vị',
      isVisible: true,
      cellRenderer: (data: any) => `
              <cite>
                <ins class="status_onl"></ins>
                <div>
                  ${data.unit.unitNameFull.split('\n')[0] || ''}
                </div>
              </cite>
              <div>
                  ${data.unit.unitNameFull.split('\n')[1] || ''}
              </div>
      `,
    },
    {
      key: 'mainType',
      label: 'Loại',
      isVisible: true,
      cellRenderer: (data: any) =>
        `
            ${getValueAlertType(data)}
            <div>
              <em>${getTypeNetwork(data?.mainType)}</em>
            </div>
        `,
    },
    {
      key: 'employeeName',
      label: 'Người quản lý',
      isVisible: true,
      cellRenderer: (data: any) => {
        return `
            ${data.employeeName}
        `;
      },
    },
    {
      key: 'sourceMac',
      label: 'IP/MAC',
      isVisible: true,
      cellRenderer: (data: any) =>
        `
            ${data.sourceIp ?? ''}
            <em> ${data.sourceMac} </em>
        `,
    },
    {
      key: 'lastActive',
      label: 'Thời gian phát hiện',
      isVisible: true,
      cellRenderer: (data: any) =>
        `
            <div>${
              convertIsoToFormattedDate(getLastActive(data)).split(' ')[0] ?? ''
            }</div>
            <em>${
              convertIsoToFormattedDate(getLastActive(data)).split(' ')[1] ?? ''
            }</em>
        `,
    },
  ];

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    const data = changes['eventDataPayload'].currentValue;
    console.log('data', data);
    if (!data) return;
    if (!this.eventDataPayload.actualData) return;
    try {
      if (this.eventDataPayload.subType === MapSubType.INFRASTRUCTURE_ALERT) {
        this.networkInfraData = this.eventDataPayload.actualData.items.map(
          (item: NetworkInfrastructure) =>
            this.mapToNetworkInfrastructure(item),
        );
      } else if (
        this.eventDataPayload.subType === MapSubType.CYBER_SECURITY_ALERT
      ) {
        this.secInfoData = this.getUniqueAlertsBySourceMac(
          this.eventDataPayload.actualData.items.map((item: SecurityInfo) =>
            this.mapToSecurityInfo(item),
          ),
        );
      }
    } catch (Error) {
      console.error(error);
    }
  }

  handlePageChange(page: any): void {
    console.log('Page changed to:', page);
    // Trigger API request for new data here
  }

  handleSearchQuery(query: string): void {
    console.log('Search query:', query);
    // Trigger API request for filtered data here
  }

  handleRowClick(item: any) {
    const unitPath =
      this.eventDataPayload.subType === MapSubType.INFRASTRUCTURE_ALERT
        ? item.unitPath
        : item.unit.path;
    this.moveToFeature.emit(unitPath);
  }

  mapToNetworkInfrastructure(data: any): NetworkInfrastructure {
    return {
      description: data.description,
      id: data.id,
      // category: data.category,
      // coor: {
      //   id: data.coor.id,
      //   serialNumber: data.coor.serial_number,
      //   x: data.coor.x,
      //   y: data.coor.y,
      // },
      remedy: data.khacfuc, // Map to remedy
      lastActive: data.last_active,
      boundary: data.loploi, // Map to boundary
      core: data.lopbien, // Map to core
      mainType: data.main_type,
      // managementIp: data.management_ip,
      // model: data.model,
      name: data.name,
      // serialNumber: data.serial_number,
      source: data.source,
      status: data.status,
      sys: data.sys,
      type: data.type,
      // unitNameFull: data.unit_name_full,
      unitPath: data.unit_path,
      unitPathText: data.unit_path_text,
      // vendor: data.vendor,
    };
  }

  mapToSecurityInfo(rawData: any): SecurityInfo {
    return {
      alertType: rawData.alert_type,
      employeeName: rawData.employee_name,
      remedy: rawData.khacfuc,
      lastActive: rawData.last_active,
      core: rawData.loi,
      boundary: rawData.bien,
      mainType: rawData.main_type,
      message: rawData.message,
      sourceIp: rawData.source_ip,
      sourceMac: rawData.source_mac,
      unit: {
        name: rawData.unit.name,
        path: rawData.unit.path,
        unitNameFull: rawData.unit.unit_name_full,
      },
    };
  }

  /**
   * Filters an array of Alert objects to ensure each sourceMac is unique.
   * @param alerts - The array of Alert objects.
   * @returns An array of unique Alert objects by sourceMac.
   */
  getUniqueAlertsBySourceMac(alerts: SecurityInfo[]): SecurityInfo[] {
    const map = new Map<string, SecurityInfo>();

    alerts.forEach((alert) => {
      // If the map does not already have the sourceMac, add it
      if (!map.has(alert.sourceMac)) {
        map.set(alert.sourceMac, alert);
      }
    });

    // Convert the map values to an array
    return Array.from(map.values());
  }
}
