import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-button-widget-add',
  standalone: true,
  imports: [],
  templateUrl: './button-widget-add.component.html',
  styleUrls: ['./button-widget-add.component.scss']
})
export class ButtonWidgetAddComponent implements OnInit {
  @Output() add: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

}
