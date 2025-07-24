import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, formatNumber } from '@angular/common';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import {
  HotSpotStatistics,
  NuanceStats,
} from '../../../../models/btth.interface';

@Component({
  selector: 'app-iw-hotspot-table',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './iw-hotspot-table.component.html',
  styleUrls: ['./iw-hotspot-table.component.scss'],
})
export class IwHotspotTableComponent {
  @Input() hotspotStats: HotSpotStatistics[] | null = null;

  // Columns configuration
  columns = [
    {
      key: 'unit',
      label: 'Đơn vị',
      isVisible: true,
      cellRenderer: (data: HotSpotStatistics) => `
              <div>
                  ${data.unit}
              </div>
      `,
    },
    {
      key: 'totalIndustrialParks',
      label: 'Khu công nghiệp',
      isVisible: true,
      cellRenderer: (data: HotSpotStatistics) =>
        `
            <div>
              ${formatNumber(data.totalIndustrialParks, 'vi-VN')}
            </div>
        `,
    },
    {
      key: 'totalParishes',
      label: 'Giáo xứ',
      isVisible: true,
      cellRenderer: (data: HotSpotStatistics) =>
        `
            <div>
              ${formatNumber(data.totalParishes, 'vi-VN')}
            </div>
        `,
    },
    {
      key: 'totalBots',
      label: 'BOT',
      isVisible: true,
      cellRenderer: (data: HotSpotStatistics) =>
        `
            <div>
              ${formatNumber(data.totalBots, 'vi-VN')}
            </div>
        `,
    },
  ];

  handlePageChange(page: number): void {
    console.log('Page changed to:', page);
    // Trigger API request for new data here
  }

  handleSearchQuery(query: string): void {
    console.log('Search query:', query);
    // Trigger API request for filtered data here
  }
}
