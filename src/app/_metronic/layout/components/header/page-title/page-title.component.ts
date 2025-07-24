import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PageInfoService, PageLink } from '../../../core/page-info.service';
import { Store } from '@ngrx/store';
import {
  selectReverseFullUnitPath,
  selectRootUnitId,
} from '../../../../../store/unit-tree-view/unit-tree-view.selectors';
import { UtilsService } from '../../../../../core/services/utils.service';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
})
export class PageTitleComponent implements OnInit, OnDestroy {
  //private unsubscribe: Subscription[] = [];

  @Input() appPageTitleDirection: string = '';
  @Input() appPageTitleBreadcrumb: boolean;
  @Input() appPageTitleDescription: boolean;

  title$: Observable<string>;
  description$: Observable<string>;
  bc$: Observable<Array<PageLink>>;

  unitPath$: Observable<{ id: string | null; level: number; name: string }[]>;
  rootUnitId$: Observable<string | null>;

  private utils: UtilsService = inject(UtilsService);

  constructor(
    private pageInfo: PageInfoService,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.title$ = this.pageInfo.title.asObservable();
    this.description$ = this.pageInfo.description.asObservable();
    this.bc$ = this.pageInfo.breadcrumbs.asObservable();

    this.rootUnitId$ = this.store.select(selectRootUnitId);
    this.unitPath$ = this.store.select(selectReverseFullUnitPath);
  }

  navigateUnit(unitId: string | null) {
    if (!unitId) return;
    this.utils.updateQueryParams(unitId).then();
  }

  ngOnDestroy() {
    // this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
