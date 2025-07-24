import { CommonModule } from '@angular/common';
import { Component, Input,Output,EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header-chart',
  templateUrl: './header-chart.component.html',
  styleUrls: ['./header-chart.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class HeaderChartComponent {
  @Input() title?: string = '';
  @Input() subTitle?: string = '';
  @Input() sourceOptions?: { label: string; value: string }[] = [];
  @Output() selectedSourceChange = new EventEmitter<string>();

  @Input() selectedSource: string = '';
  
  // @Input() isShowHeader: boolean = true;
}
