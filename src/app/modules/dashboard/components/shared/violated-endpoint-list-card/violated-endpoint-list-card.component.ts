import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '../data-table/data-table.component';

interface Device {
  employeeName: string;
  unitNamePath: string;
  sourceMac: string;
  sourceIp: string;
  detectionDate: Date;
  description: string;
}
@Component({
  selector: 'app-violated-endpoint-list-card',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './violated-endpoint-list-card.component.html',
  styleUrls: ['./violated-endpoint-list-card.component.scss'],
})
export class ViolatedEndpointListCardComponent {
  // Mock data
  devices: Device[] = [
    {
      employeeName: 'John Doe',
      unitNamePath: 'HQ/IT',
      sourceMac: '00:1B:44:11:3A:B7',
      sourceIp: '192.168.1.2',
      detectionDate: new Date(),
      description: 'Unauthorized access attempt detected.',
    },
    {
      employeeName: 'Jane Smith',
      unitNamePath: 'Branch/Security',
      sourceMac: '00:1B:44:11:3A:B8',
      sourceIp: '192.168.1.3',
      detectionDate: new Date(),
      description: 'Suspicious activity from this IP.',
    },
    // Add more mock data as needed
  ];

  // Columns configuration
  columns = [
    {
      key: 'employeeName',
      label: 'Người quản lý',
      isVisible: true,
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
      key: 'sourceMac',
      label: 'MAC/IP',
      isVisible: true,
      cellRenderer: (data: any) =>
        `<div>${data.sourceMac}</div><div class="text-muted">${data.sourceIp}</div>`,
    },
    {
      key: 'detectionDate',
      label: 'Thời gian',
      isVisible: true,
      cellRenderer: (data: any) =>
        new Date(data.detectionDate).toLocaleString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    {
      key: 'description',
      label: 'Mô tả',
      isVisible: true,
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
