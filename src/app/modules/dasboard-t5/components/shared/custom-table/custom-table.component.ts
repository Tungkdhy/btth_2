import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CustomTableComponent {
  @Input() columns: string[]  // Table headers passed from parent
  @Input() data: any[] // Table data
  @Input() isShowHeader: boolean // Table title

}
