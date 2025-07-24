import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown-menu.component.html',
  styles: [
  ]
})
export class DropdownMenuComponent implements OnInit {
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold w-200px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  @Input() allowViewDetail: boolean = false;
  @Input() allowToggleStatus: boolean = false;
  @Input() currentStatus: boolean = true;

  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() view = new EventEmitter();
  @Output() toggleStatus = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
