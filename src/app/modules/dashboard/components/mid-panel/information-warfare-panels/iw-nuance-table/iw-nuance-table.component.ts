import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, formatNumber } from '@angular/common';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { NumberFormatPipe } from '../../../../../../core/pipes/number-format/number-format.pipe';
import { NuanceStats } from '../../../../models/btth.interface';

@Component({
  selector: 'app-iw-nuance-table',
  standalone: true,
  imports: [CommonModule, DataTableComponent, NumberFormatPipe],
  templateUrl: './iw-nuance-table.component.html',
  styleUrls: ['./iw-nuance-table.component.scss'],
})
export class IwNuanceTableComponent implements OnChanges {
  @Input() nuanceStats: NuanceStats[] | null = null;

  // Columns configuration
  columns = [
    {
      key: 'name',
      label: 'Tên',
      isVisible: true,
      cellRenderer: (data: NuanceStats) => `
              <div>
                  ${data.name}
              </div>
      `,
    },
    {
      key: 'positiveCount',
      label: 'Tích cực',
      isVisible: true,
      cellRenderer: (data: NuanceStats) =>
        `
            <div>
              ${formatNumber(data.positiveCount, 'vi-VN')}
            </div>
        `,
    },
    {
      key: 'neutralCount',
      label: 'Trung lập',
      isVisible: true,
      cellRenderer: (data: NuanceStats) =>
        `
            <div>
              ${formatNumber(data.neutralCount, 'vi-VN')}
            </div>
        `,
    },
    {
      key: 'negativeCount',
      // label: 'Tiêu cực',
      label: 'Cần xác minh',
      isVisible: true,
      cellRenderer: (data: NuanceStats) =>
        `
            <div>
              ${formatNumber(data.negativeCount, 'vi-VN')}
            </div>
        `,
    },
  ];

  ngOnChanges(changes: SimpleChanges) {
    const data = changes['nuanceStats'].currentValue;
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
