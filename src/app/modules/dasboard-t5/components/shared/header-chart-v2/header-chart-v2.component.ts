import { CommonModule } from '@angular/common';
import { Component, Input,Output,EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header-chart-v2',
  templateUrl: './header-chart-v2.component.html',
  styleUrls: ['./header-chart-v2.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class HeaderChartV2Component {
  @Input() title?: string;
  @Input() subTitle?: string;

  @Input() sourceOptions?: { label: string; color: string }[] = [];
  @Input() radioOptions?: { label: string; value: string; color?: string }[] = [];
  @Input() selectedValue?: string;

  @Output() change = new EventEmitter<string>();

  onRadioChange(value: string) {
    this.selectedValue = value;
    this.change.emit(value);
  }
  // @Input() isShowHeader: boolean = true;
}
