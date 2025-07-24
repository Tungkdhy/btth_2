import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { LayoutType } from '../../../core/configs/config';
import { LayoutInitService } from '../../../core/layout-init.service';
import { LayoutService } from '../../../core/layout.service';
import { KeycloakService } from 'keycloak-angular';
import { TokenService } from '../../../../../modules/keycloak/services/token.service';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Constant } from '../../../../../core/config/constant';
import {
  convertToDash,
  convertToUnsignedAndDash,
  convertToUrl,
} from '../../../core/common/common-utils';
import { Store } from '@ngrx/store';
import { selectCurrentUnitId } from '../../../../../store/unit-tree-view/unit-tree-view.selectors';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit, OnDestroy {
  currentMenu: string;
  subscription: Subscription;
  menu = Constant.MENU;
  convertToUrl = convertToUrl;
  convertToDash = convertToDash;
  convertToUnsignedAndDash = convertToUnsignedAndDash;
  unitId$: Observable<string | null>;

  public typeDevice = {
    router: Constant.TYPE_DEVICE.ROUTER,
    switch: Constant.TYPE_DEVICE.SWITCH,
    firewall: Constant.TYPE_DEVICE.FIREWALL,
    server: Constant.TYPE_DEVICE.SERVER,
    client: Constant.TYPE_DEVICE.CLIENT,
  };

  constructor(
    private router: Router,
    private keycloakService: KeycloakService,
    private tokenService: TokenService,
    private layout: LayoutService,
    private layoutInit: LayoutInitService,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.currentMenu = this.getCurrentMenu(); // First
    this.subscription = this.getUrl().subscribe((url) => {
      // Detection change url
      if (!url) return;
      this.currentMenu = url.split('/').filter(Boolean)[0];
    });
    this.unitId$ = this.store.select(selectCurrentUnitId);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getCurrentMenu(): string {
    return this.router.url.split('/').filter(Boolean)[0];
  }

  getUrl(): Observable<string> {
    return this.router.events.pipe(
      filter((item: any) => item instanceof NavigationStart),
      map((item: NavigationStart) => item.url),
    );
  }

  hasMenuAllow(item: string) {
    return this.keycloakService.isUserInRole(item);
  }

  calculateMenuItemCssClass(url: string): string {
    return checkIsActive(this.router.url, url) ? 'active' : '';
  }

  setBaseLayoutType(layoutType: LayoutType) {
    this.layoutInit.setBaseLayoutType(layoutType);
  }

  setToolbar(
    toolbarLayout: 'classic' | 'accounting' | 'extended' | 'reports' | 'saas',
  ) {
    const currentConfig = { ...this.layout.layoutConfigSubject.value };
    if (currentConfig && currentConfig.app && currentConfig.app.toolbar) {
      currentConfig.app.toolbar.layout = toolbarLayout;
      this.layout.saveBaseConfig(currentConfig);
    }
  }
}

const getCurrentUrl = (pathname: string): string => {
  return pathname.split(/[?#]/)[0];
};

const checkIsActive = (pathname: string, url: string) => {
  const current = getCurrentUrl(pathname);
  if (!current || !url) {
    return false;
  }

  if (current === url) {
    return true;
  }

  if (current.indexOf(url) > -1) {
    return true;
  }

  return false;
};
