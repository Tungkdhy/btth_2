import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ILayout, LayoutType } from '../../core/configs/config';
import { LayoutService } from '../../core/layout.service';
import { UnitService } from 'src/app/modules/unit/services/unit.service';
import { Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StatisticalModalComponent } from 'src/app/shared/statistical-modal/statistical-modal.component';
import { selectCurrentUnitId } from '../../../../store/unit-tree-view/unit-tree-view.selectors';
import { selectDate } from '../../../../store/date-time-range/date-time-range.selectors';
import { switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  // Public props
  @Input() currentLayoutType: LayoutType | null;
  @Input() appToolbarLayout:
    | 'classic'
    | 'accounting'
    | 'extended'
    | 'reports'
    | 'saas';

  // toolbar
  appToolbarDisplay: boolean;
  appToolbarContainer: 'fixed' | 'fluid';
  appToolbarContainerCSSClass: string = '';
  appToolbarFixedDesktop: boolean;
  appToolbarFixedMobile: boolean;
  appPageTitleDisplay: boolean;

  // page title
  appPageTitleDirection: string = '';
  appPageTitleCSSClass: string = '';
  appPageTitleBreadcrumb: boolean;
  appPageTitleDescription: boolean;
  unitId$: Observable<string | null>;

  exportWordLoading: boolean = false;

  private unitService: UnitService = inject(UnitService);
  private modal: NgbModal = inject(NgbModal);
  private cdr = inject(ChangeDetectorRef);

  constructor(
    private layout: LayoutService,
    private store: Store,
  ) {}

  ngOnInit(): void {
    const subscr = this.layout.layoutConfigSubject
      .asObservable()
      .subscribe((config: ILayout) => {
        this.updateProps(config);
      });
    this.unsubscribe.push(subscr);
    this.unitId$ = this.store.select(selectCurrentUnitId);
  }

  updateProps(config: ILayout) {
    this.appToolbarDisplay = this.layout.getProp(
      'app.toolbar.display',
      config,
    ) as boolean;
    if (!this.appToolbarDisplay) {
      return;
    }

    this.appPageTitleDisplay = this.layout.getProp(
      'app.pageTitle.display',
      config,
    ) as boolean;
    this.appToolbarContainer = this.layout.getProp(
      'app.toolbar.container',
      config,
    ) as 'fluid' | 'fixed';
    this.appToolbarContainerCSSClass =
      this.appToolbarContainer === 'fixed'
        ? 'container-xxl'
        : 'container-fluid';
    const containerClass = this.layout.getProp(
      'app.toolbar.containerClass',
      config,
    ) as string;
    if (containerClass) {
      this.appToolbarContainerCSSClass += ` ${containerClass}`;
    }

    this.appToolbarFixedDesktop = this.layout.getProp(
      'app.toolbar.fixed.desktop',
      config,
    ) as boolean;
    if (this.appToolbarFixedDesktop) {
      document.body.setAttribute('data-kt-app-toolbar-fixed', 'true');
    }

    this.appToolbarFixedMobile = this.layout.getProp(
      'app.toolbar.fixed.mobile',
      config,
    ) as boolean;
    if (this.appToolbarFixedMobile) {
      document.body.setAttribute('data-kt-app-toolbar-fixed-mobile', 'true');
    }

    // toolbar
    this.appPageTitleDirection = this.layout.getProp(
      'app.pageTitle.direction',
      config,
    ) as string;
    this.appPageTitleCSSClass = this.layout.getProp(
      'app.pageTitle.class',
      config,
    ) as string;
    this.appPageTitleBreadcrumb = this.layout.getProp(
      'app.pageTitle.breadCrumb',
      config,
    ) as boolean;
    this.appPageTitleDescription = this.layout.getProp(
      'app.pageTitle.description',
      config,
    ) as boolean;

    document.body.setAttribute('data-kt-app-toolbar-enabled', 'true');
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  showPageTitle() {
    const viewsWithPageTitles = ['classic', 'reports', 'saas'];
    return (
      this.appPageTitleDisplay &&
      viewsWithPageTitles.some((t) => t === this.appToolbarLayout)
    );
  }

  exportWord(unitId: string) {
    if (!unitId) return;

    this.exportWordLoading = true;
    this.store
      .select(selectDate)
      .pipe(
        take(1),
        switchMap((date) =>
          this.unitService.exportWord(unitId, date.startDate, date.endDate),
        ),
      )
      .subscribe({
        next: () => {
          this.exportWordLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.exportWordLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  async showStatistics(unitId: string) {
    const statistical = this.modal.open(StatisticalModalComponent, {
      windowClass: 'custom-modal',
    });

    statistical.componentInstance.unitId = unitId;
  }
}
