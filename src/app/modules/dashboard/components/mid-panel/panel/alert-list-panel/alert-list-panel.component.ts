import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import {
  getIpTenMien,
  getLastActive,
  getType,
  getTypeNetwork,
  getValueAlertType,
} from '../../../../utils/table-utils';
import { convertIsoToFormattedDate } from '../../../../../../_metronic/layout/core/common/common-utils';
import { EventDataPayload } from '../../../../models/payload-channel';
import { GroupedAlerts, MapSubType } from '../../../../models/btth.interface';
import { error } from 'ol/console';
import { FeatureDetailPanelComponent } from '../../../shared/feature-detail-panel/feature-detail-panel.component';
import { NavTabsComponent } from '../../../shared/nav-tabs/nav-tabs.component';
import { TopologyWrapperCardComponent } from '../topology-wrapper-card/topology-wrapper-card.component';
import { UnitStrengthPanelComponent } from '../unit-strength-panel/unit-strength-panel.component';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import * as AlertDisconnectedSelectors from '../../../../../../store/alert/alert-disconnected/alert-disconnected.selectors';
import * as AlertDisconnectedActions from '../../../../../../store/alert/alert-disconnected/alert-disconnected.actions';
import * as AlertSecuritySelectors from '../../../../../../store/alert/alert-security/alert-security.selectors';
import * as AlertSecurityActions from '../../../../../../store/alert/alert-security/alert-security.actions';

interface Unit {
  name: string;
  path: string;
  unitNameFull: string;
}

@Component({
  selector: 'app-alert-list-panel',
  standalone: true,
  imports: [
    CommonModule,
    DataTableComponent,
    FeatureDetailPanelComponent,
    NavTabsComponent,
    TopologyWrapperCardComponent,
    UnitStrengthPanelComponent,
  ],
  templateUrl: './alert-list-panel.component.html',
  styleUrls: ['./alert-list-panel.component.scss'],
})
export class AlertListPanelComponent implements OnInit {
  @Input() eventDataPayload: EventDataPayload;
  @Output() moveToFeature: EventEmitter<any> = new EventEmitter();

  tabs = [
    {
      label: 'Kết nối',
      value: 'alert-disconnected',
    },
    { label: 'An toàn thông tin', value: 'alert-security' },
  ];
  selectedTab: 'alert-disconnected' | 'alert-security' = 'alert-disconnected';

  alertDisconnected$: Observable<GroupedAlerts[]>;
  alertDisconnectedTotal$: Observable<number>;

  alertSecurity$: Observable<GroupedAlerts[]>;
  alertSecurityTotal$: Observable<number>;

  protected readonly MapSubType = MapSubType;

  private store = inject(Store);

  // Columns configuration
  alertColumns = [
    {
      key: 'name',
      label: 'Đơn vị',
      isVisible: true,
      cellRenderer: (data: GroupedAlerts) => `
              <cite>
                <div>
                  ${data.name.split('\n')[0] || ''}
                </div>
              </cite>
              <div>
                  ${data.name.split('\n')[1] || ''}
              </div>
      `,
    },
    {
      key: 'core',
      label: 'Lõi',
      isVisible: true,
      cellRenderer: (data: GroupedAlerts) => `${data.core}`,
    },
    {
      key: 'boundary',
      label: 'Biên',
      isVisible: true,
      cellRenderer: (data: GroupedAlerts) => `${data.boundary}`,
    },
    {
      key: 'status',
      label: 'Trạng thái',
      isVisible: true,
      cellRenderer: (data: GroupedAlerts) => `${data.remedyStatus}`,
    },
    {
      key: 'count',
      label: 'Số lượng',
      isVisible: true,
      cellRenderer: (data: GroupedAlerts) =>
        `
            <span class="badge badge-orange">${data.count}</span>
        `,
    },
  ];

  // Columns configuration
  secColumns = [
    {
      key: 'name',
      label: 'Đơn vị',
      isVisible: true,
      cellRenderer: (data: GroupedAlerts) => `
              <cite>
                <div>
                  ${data.name.split('\n')[0] || ''}
                </div>
              </cite>
              <div>
                  ${data.name.split('\n')[1] || ''}
              </div>
      `,
    },
    {
      key: 'core',
      label: 'Lõi',
      isVisible: true,
      cellRenderer: (data: GroupedAlerts) => `${data.core}`,
    },
    {
      key: 'boundary',
      label: 'Biên',
      isVisible: true,
      cellRenderer: (data: GroupedAlerts) => `${data.boundary}`,
    },
    {
      key: 'status',
      label: 'Trạng thái',
      isVisible: true,
      cellRenderer: (data: GroupedAlerts) => `${data.remedyStatus}`,
    },
    {
      key: 'count',
      label: 'Số lượng',
      isVisible: true,
      cellRenderer: (data: GroupedAlerts) =>
        `
            <span class="badge badge-red">${data.count}</span>
        `,
    },
  ];

  ngOnInit() {
    // this.store.dispatch(AlertDisconnectedActions.loadDisconnectedAlerts());
    this.alertDisconnected$ = this.store.select(
      AlertDisconnectedSelectors.selectAlertDisconnectedStats,
    );
    this.alertDisconnectedTotal$ = this.store.select(
      AlertDisconnectedSelectors.selectAlertDisconnectedTotal,
    );

    // this.store.dispatch(AlertSecurityActions.loadSecurityAlerts());
    this.alertSecurity$ = this.store
      .select(AlertSecuritySelectors.selectAlertSecurityStats)
    this.alertSecurityTotal$ = this.store.select(
      AlertSecuritySelectors.selectAlertSecurityTotal,
    );
  }

  handleRowClick(item: GroupedAlerts) {
    const unitPath = item.unitPath;
    this.moveToFeature.emit(unitPath);
  }

  onTabChange(tab: any) {
    this.selectedTab = tab;
  }
}
