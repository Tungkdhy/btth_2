import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '../data-table/data-table.component';

// Define the interface for endpoint data
interface Endpoint {
  name: string | null;
  mac: string;
  ip: string;
  unitNamePath: string;
  status: boolean;
  miavVersion?: string;
}

@Component({
  selector: 'app-endpoint-list-card',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './endpoint-list-card.component.html',
  styleUrls: ['./endpoint-list-card.component.scss'],
})
export class EndpointListCardComponent {
  // Mock data
  endpoints: Endpoint[] = [
    {
      name: 'Device 1',
      mac: '00:1B:44:11:3A:B7',
      ip: '192.168.1.2',
      unitNamePath: 'HQ/IT',
      status: true,
      miavVersion: 'v1.0',
    },
    {
      name: 'Device 2',
      mac: '00:1B:44:11:3A:B8',
      ip: '192.168.1.3',
      unitNamePath: 'HQ/Security',
      status: false,
    },
    // Add more mock data as needed
  ];

  // Columns configuration
  columns = [
    {
      key: 'name',
      label: 'Tên thiết bị',
      isVisible: true,
      cellRenderer: (data: any) => data.name || 'Chưa quản lý',
    },
    {
      key: 'mac',
      label: 'Địa chỉ MAC/IP',
      isVisible: true,
      cellRenderer: (data: any) =>
        `<div>${data.mac}</div><div class="text-muted">${data.ip}</div>`,
    },
    {
      key: 'unitNamePath',
      label: 'Đơn vị',
      isVisible: true,
      cellRenderer: (data: any) => {
        const unit = this.extractParentAndUnitName(data.unitNamePath);
        return `<div>${unit.unitName}</div><div class="text-muted">${unit.parentUnitName}</div>`;
      },
    },
    {
      key: 'status',
      label: 'Trạng thái',
      isVisible: true,
      cellRenderer: (data: any) =>
        data.status
          ? '<span class="badge badge-primary">Bật</span>'
          : '<span class="badge badge-danger">Tắt</span>',
    },
  ];

  // Method to extract parent and unit names from unitNamePath
  extractParentAndUnitName(unitNamePath: string) {
    const [parentUnitName, unitName] = unitNamePath.split('/');
    return { parentUnitName, unitName };
  }

  handlePageChange(page: number): void {
    console.log('Page changed to:', page);
    // Trigger API request for new data here
  }

  handleSearchQuery(query: string): void {
    console.log('Search query:', query);
    // Trigger API request for filtered data here
  }
}
