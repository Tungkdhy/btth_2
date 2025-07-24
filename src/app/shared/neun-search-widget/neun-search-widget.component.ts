import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-neun-search-widget',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './neun-search-widget.component.html',
  styleUrls: ['./neun-search-widget.component.scss']
})
export class NeunSearchWidgetComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter<string>();
  @Input() loading: boolean = false;
  query: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
