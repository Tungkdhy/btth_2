import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Breadcrumb,
  BreadcrumbIds,
  BreadcrumbService,
} from '../../modules/dashboard/services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  // Event emitter to emit the id of the clicked breadcrumb
  @Output() breadcrumbClicked = new EventEmitter<string>();

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbs$.subscribe((breadcrumbs) => {
      this.breadcrumbs = breadcrumbs;
    });
  }

  onBreadcrumbClick(id: string) {
    this.breadcrumbClicked.emit(id);
    this.breadcrumbService.clearBreadcrumbsAfter(id);
  }

  protected readonly BreadcrumbIds = BreadcrumbIds;
}
