import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FeatureDetailPanelComponent } from '../../../shared/feature-detail-panel/feature-detail-panel.component';
import { AccessStatsPanelComponent } from '../access-stats-panel/access-stats-panel.component';
import { NavTabsComponent } from '../../../shared/nav-tabs/nav-tabs.component';
import { NumberFormatPipe } from '../../../../../../core/pipes/number-format/number-format.pipe';
import { TopologyWrapperCardComponent } from '../topology-wrapper-card/topology-wrapper-card.component';
import { Observable, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { MapSupabaseService } from '../../../../services/map-supabase.service';
import {
  AlertListPagination,
  CoreCode,
  InfoSecAlertData,
  InfraAlertData,
  FeatureDisplayData,
} from '../../../../models/btth.interface';
import { AlertDetailCardComponent } from '../alert-detail-card/alert-detail-card.component';
import { DataTableExpandComponent } from '../../../shared/data-table-expand/data-table-expand.component';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { UnitStrengthPanelComponent } from '../unit-strength-panel/unit-strength-panel.component';
import { selectDateV2 } from '../../../../../../store/date-time-range-v2/date-time-range-v2.selectors';
import { filter } from 'rxjs/operators';
import {
  convertSecurityAlert,
  convertSystemAlert,
} from '../../../../utils/table-utils';
import { UnitStrengthWrapperComponent } from '../../unit-strength-wrapper/unit-strength-wrapper.component';

interface Statistics {
  router: number;
  switch: number;
  firewall: number;
  server: number;
  client: number;
  disconnected: number;
  infoSec: number;
}

@Component({
  selector: 'app-unit-detail-panel',
  standalone: true,
  imports: [
    CommonModule,
    FeatureDetailPanelComponent,
    AccessStatsPanelComponent,
    NavTabsComponent,
    NumberFormatPipe,
    TopologyWrapperCardComponent,
    AlertDetailCardComponent,
    DataTableExpandComponent,
    DataTableComponent,
    UnitStrengthPanelComponent,
    UnitStrengthWrapperComponent,
  ],
  templateUrl: './unit-detail-panel.component.html',
  styleUrls: ['./unit-detail-panel.component.scss'],
})
export class UnitDetailPanelComponent implements OnChanges {
  @ViewChild('nameTemplate') nameTemplate!: TemplateRef<any>; // Sử dụng ViewChild để lấy template từ HTML
  @ViewChild('descriptionTemplate') descriptionTemplate!: TemplateRef<any>;

  @Input() selectedFeature?: FeatureDisplayData;

  tabs = [
    { label: 'Cảnh báo', value: 'alert' },
    { label: 'Thực lực', value: 'strength' },
    { label: 'Cấu trúc mạng', value: 'topology' },
  ];

  selectedTab: 'alert' | 'topology' | 'strength' = 'alert';

  unitPath: string | null = null;
  boundaryCode?: string;
  coreCode?: string;

  infraAlerts$: Observable<AlertListPagination<InfraAlertData>>;
  infoSecAlerts$: Observable<AlertListPagination<InfoSecAlertData>>;
  infraColumns = [
    {
      key: 'sys',
      header: 'Loại',
      format: (value: any) => convertSystemAlert(value) || '',
    },
    { key: 'description', header: 'IP/ Tên miền' },
    {
      key: 'lastActive',
      header: 'Kết nối gần nhất',
      format: (value: any) => formatDate(value, 'dd-MM-yyyy HH:mm:ss', 'en-US'),
    },
  ];

  infoSecColumns = [
    {
      key: 'alertType',
      header: 'Loại',
      format: (value: any) => convertSecurityAlert(value) || '',
    },
    { key: 'sourceMac', header: 'MAC' },
    { key: 'sourceIp', header: 'IP' },
    {
      key: 'lastActive',
      header: 'Kết nối gần nhất',
      format: (value: any) => formatDate(value, 'dd-MM-yyyy HH:mm:ss', 'en-US'),
    },
  ];

  private store = inject(Store);
  private supabase = inject(MapSupabaseService);

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.selectedFeature || !this.selectedFeature.unitPath) return;

    this.unitPath = this.selectedFeature.unitPath;
    this.boundaryCode = this.selectedFeature.code;
    this.coreCode = this.selectedFeature.foreignCode;

    if (this.unitPath && this.boundaryCode && this.coreCode) {
      this.fetchInfraAlerts(this.unitPath, this.coreCode, this.boundaryCode);
      this.fetchInfoSecAlerts(this.unitPath, this.coreCode, this.boundaryCode);
    }
  }

  private fetchInfraAlerts(
    unitPath: string,
    core: string,
    boundary: string,
    page: number = 1,
  ) {
    this.infraAlerts$ = this.store.select(selectDateV2).pipe(
      filter((date) => !!(date && date.startDate && date.endDate)),
      switchMap((date) =>
        this.supabase.getDisconnectAlertList({
          subType: unitPath,
          // columnType: 'server_monitor',
          core: core,
          boundary: boundary,
          page: page,
          fromDate: date.startDate,
          toDate: date.endDate,
          limit: 99999,
        }),
      ),
    );
  }

  private fetchInfoSecAlerts(
    unitPath: string,
    core: string,
    boundary: string,
    page: number = 1,
  ) {
    this.infoSecAlerts$ = this.store.select(selectDateV2).pipe(
      filter((date) => !!(date && date.startDate && date.endDate)),
      switchMap((date) =>
        this.supabase.getInfoSecAlertList({
          subType: unitPath,
          core: core,
          boundary: boundary,
          page: page,
          limit: 99999,
          from: formatDate(date.startDate!, 'yyyy-MM-dd HH:mm:ss', 'en-US'),
          to: formatDate(date.endDate!, 'yyyy-MM-dd HH:mm:ss', 'en-US'),
          // columnType: 'server_monitor',
        }),
      ),
    );
  }

  onTabChange(tab: any) {
    this.selectedTab = tab;
  }

  onInfraNetworkPageChanged(page: number): void {
    // if (this.unitPath) this.fetchInfraAlerts(this.unitPath, page);
  }

  onInfoSecPageChanged(page: number): void {
    // if (this.unitPath) this.fetchInfoSecAlerts(this.unitPath, page);
  }
}
