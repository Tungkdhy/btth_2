import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownMenuComponent } from '../../../../shared/dropdown-menu/dropdown-menu.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompareHtgsService } from '../../services/compare-htgs.service';
import { Observable, Subscription } from 'rxjs';
import { ResultListPaginationModel } from '../../../../core/models/api-response.model';
import {
  ReferenceDeviceNacModel,
  ReferenceEndpointNacModel,
} from '../../models/reference-nac.model';
import { IDevice, TypeDevice } from '../../../device/models/device.model';
import {
  ActivatedRoute,
  Params,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import {
  TypeComputerModel,
  TypeEndpointModel,
} from '../../../endpoint/models/endpoint.model';
import { first, map } from 'rxjs/operators';
import { ReferenceFmsModel } from '../../models/reference-fms.model';
import { NumberFormatPipe } from '../../../../core/pipes/number-format/number-format.pipe';
import { ReferenceTa21Model } from '../../models/reference-ta21.model';

type Device = {
  parentId: string;
  type: TypeDevice;
  size: number;
  page: number;
};

@Component({
  selector: 'app-statistic-compare-htgs',
  standalone: true,
  imports: [
    CommonModule,
    DropdownMenuComponent,
    NumberFormatPipe,
    RouterOutlet,
    RouterLinkActive,
    RouterLink,
  ],
  templateUrl: './statistic-compare-htgs.component.html',
  styleUrls: ['./statistic-compare-htgs.component.scss'],
})
export class StatisticCompareHtgsComponent implements OnInit, OnDestroy {
  numberRouterNac$: Observable<number>;
  numberSwitchNac$: Observable<number>;
  numberFirewallNac$: Observable<number>;
  numberClientNac$: Observable<number>;
  numberServerNac$: Observable<number>;

  numberClientFms$: Observable<number>;
  numberServerFms$: Observable<number>;

  numberClientTa21$: Observable<number>;
  numberServerTa21$: Observable<number>;

  numberRouterPrtg$: Observable<number>;
  numberSwitchPrtg$: Observable<number>;
  numberFirewallPrtg$: Observable<number>;

  subscription$: Subscription;

  search: Device = <Device>{};
  parentId: string = '';

  private compareHtgsService = inject(CompareHtgsService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    this.subscription$ = this.route.queryParams.subscribe({
      next: (params: Params) => {
        const id = params.id;
        if (!id || this.parentId === id) return;
        this.parentId = id;
        this.getNumberDevicePerSystem(id);
        this.getNumberEndpointPerSystem(id);
      },
    });
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  getNumberDevicePerSystem(parentId: string) {
    this.numberRouterNac$ = this.getNumberStatisticalDeviceNac(
      parentId,
      'ROUTER',
    );
    this.numberSwitchNac$ = this.getNumberStatisticalDeviceNac(
      parentId,
      'SWITCH',
    );
    this.numberFirewallNac$ = this.getNumberStatisticalDeviceNac(
      parentId,
      'FIREWALL',
    );
    this.numberRouterPrtg$ = this.getNumberStatisticalDevicePrtg(
      parentId,
      'ROUTER',
    );
    this.numberSwitchPrtg$ = this.getNumberStatisticalDevicePrtg(
      parentId,
      'SWITCH',
    );
    this.numberFirewallPrtg$ = this.getNumberStatisticalDevicePrtg(
      parentId,
      'FIREWALL',
    );
  }

  getNumberEndpointPerSystem(parentId: string) {
    this.numberClientNac$ = this.getNumberStatisticalEndpointNac(
      parentId,
      'CLIENT',
    );
    this.numberServerNac$ = this.getNumberStatisticalEndpointNac(
      parentId,
      'SERVER',
    );
    this.numberClientFms$ = this.getNumberStatisticalEndpointFms(
      parentId,
      'CLIENT',
    );
    this.numberServerFms$ = this.getNumberStatisticalEndpointFms(
      parentId,
      'SERVER',
    );
    this.numberClientTa21$ = this.getNumberStatisticalEndpointTa21(
      parentId,
      'CLIENT',
    );
    this.numberServerTa21$ = this.getNumberStatisticalEndpointTa21(
      parentId,
      'SERVER',
    );
  }

  getDeviceNac(
    parentId: string,
    type: TypeDevice,
    size: number = 1,
    page: number = 1,
  ): Observable<ResultListPaginationModel<ReferenceDeviceNacModel>> {
    return this.compareHtgsService.getDeviceRefNac(parentId, type, size, page);
  }

  getDevicePrtg(
    parentId: string,
    type: TypeDevice,
    size: number = 1,
    page: number = 1,
  ): Observable<ResultListPaginationModel<IDevice>> {
    return this.compareHtgsService.getDeviceRefPrtg(parentId, type, size, page);
  }

  getEndpointNac(
    parentId: string,
    type: TypeEndpointModel,
    size: number = 1,
    page: number = 1,
  ): Observable<ResultListPaginationModel<ReferenceEndpointNacModel>> {
    return this.compareHtgsService.getEndpointRefNac(
      parentId,
      type,
      size,
      page,
    );
  }

  getEndpointFms(
    parentId: string,
    type: TypeEndpointModel,
    size: number = 1,
    page: number = 1,
  ): Observable<ResultListPaginationModel<ReferenceFmsModel>> {
    return this.compareHtgsService.getEndpointRefFms(
      parentId,
      type,
      size,
      page,
    );
  }

  getEndpointTa21(
    parentId: string,
    type: TypeEndpointModel,
    size: number = 1,
    page: number = 1,
  ): Observable<ResultListPaginationModel<ReferenceTa21Model>> {
    return this.compareHtgsService.getEndpointRefTa21(
      parentId,
      type,
      size,
      page,
    );
  }

  getNumberStatisticalDeviceNac(
    parentId: string,
    type: TypeDevice,
  ): Observable<number> {
    return this.getDeviceNac(parentId, type).pipe(
      map(
        (result: ResultListPaginationModel<ReferenceDeviceNacModel>) =>
          result.data.totalElements,
      ),
    );
  }
  getNumberStatisticalDevicePrtg(
    parentId: string,
    type: TypeDevice,
  ): Observable<number> {
    return this.getDevicePrtg(parentId, type).pipe(
      map(
        (result: ResultListPaginationModel<IDevice>) =>
          result.data.totalElements,
      ),
    );
  }

  getNumberStatisticalEndpointNac(
    parentId: string,
    type: TypeEndpointModel,
  ): Observable<number> {
    return this.getEndpointNac(parentId, type).pipe(
      map(
        (result: ResultListPaginationModel<ReferenceEndpointNacModel>) =>
          result.data.totalElements,
      ),
    );
  }

  getNumberStatisticalEndpointFms(
    parentId: string,
    type: TypeEndpointModel,
  ): Observable<number> {
    return this.getEndpointFms(parentId, type).pipe(
      map(
        (result: ResultListPaginationModel<ReferenceFmsModel>) =>
          result.data.totalElements,
      ),
    );
  }

  getNumberStatisticalEndpointTa21(
    parentId: string,
    type: TypeEndpointModel,
  ): Observable<number> {
    return this.getEndpointTa21(parentId, type).pipe(
      map(
        (result: ResultListPaginationModel<ReferenceTa21Model>) =>
          result.data.totalElements,
      ),
    );
  }
}
