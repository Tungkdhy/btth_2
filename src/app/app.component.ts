import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { TranslationService } from './modules/i18n';
// language list
import { locale as enLang } from './modules/i18n/vocabs/en';
import { locale as chLang } from './modules/i18n/vocabs/ch';
import { locale as esLang } from './modules/i18n/vocabs/es';
import { locale as jpLang } from './modules/i18n/vocabs/jp';
import { locale as deLang } from './modules/i18n/vocabs/de';
import { locale as frLang } from './modules/i18n/vocabs/fr';
import { ThemeModeService } from './_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from './modules/keycloak/services/token.service';
import { ToastrService } from 'ngx-toastr';
// import { UserService } from './modules/users/services/user.service';
import { KeycloakService } from 'keycloak-angular';
import { Constant } from './core/config/constant';
import {
  getToken,
  getUserInfo,
  setToken,
  setUserInfo,
} from './_metronic/layout/core/common/token-utils';

@Component({
  // tslint:disable-next-line:component-selector
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  @HostListener('window:beforeunload', ['$event'])
  doSomething() {
    if (getToken()) {
      this.tokenService.setTimeCheck(new Date().getTime());
    }
  }
  constructor(
    private translationService: TranslationService,
    private modeService: ThemeModeService,
    private router: Router,
    private tokenService: TokenService,
    private toastr: ToastrService,
    // private userService: UserService,
    private activeRoute: ActivatedRoute,
    // private keycloakAngular: KeycloakService,
  ) {
    // register translations
    this.translationService.loadTranslations(
      enLang,
      chLang,
      esLang,
      jpLang,
      deLang,
      frLang,
    );

    if (
      this.tokenService.getTimeCheck() &&
      this.tokenService.getTimeCheck() != null
    ) {
      const lastTime = Number.parseInt(
        this.tokenService.getTimeCheck() + '',
        10,
      );
      const currentTime = new Date().getTime();
      if (currentTime - lastTime > Constant.SESSION_EXPIRED * 1000) {
        this.refreshToken(null);
      } else {
        this.tokenService.setTimeCheck(new Date().getTime());
      }
    }
  }

  ngOnInit() {}

  private checkRole() {
    // const requiredRoles = this.activeRoute.snapshot.data.roles;
    // for (const requiredRole of requiredRoles) {
    //   if (this.keycloakAngular.isUserInRole(requiredRole)) {
    //     this.navigateDefaultByRole(requiredRole);
    //     break;
    //   }
    // }
  }

  private navigateDefaultByRole(role: string) {
    if (!!this.router.url.split('/').filter(Boolean) && role === '3vp_manager')
      this.router.navigate(['ban-do', 'ban-do-cau-truc-mang']).then();
  }

  refreshToken(idle: any) {
    const userInfor = JSON.parse(getUserInfo() + '');
    if (userInfor && userInfor.active) {
      // this.userService.refreshToken().subscribe((data) => {
      //   if (!data.tokenInfo) {
      //     if (idle) {
      //       console.log('ng-idle :: onTimeout !!!!');
      //       this.toastr.warning(
      //         'Phiên đăng nhập của bạn đã hết hạn',
      //         'Thông báo!',
      //       );
      //       this.tokenService.logout();
      //       idle.stop();
      //     } else {
      //       console.log('session expired :: inactive');
      //       this.toastr.warning(
      //         'Phiên đăng nhập của bạn đã hết hạn!',
      //         'Thông báo!',
      //       );
      //       setTimeout(() => {
      //         this.tokenService.logout();
      //       }, 1000);
      //     }
      //   } else {
      //     setToken(data.tokenInfo.accessToken);
      //     setUserInfo(JSON.stringify(data.userInfo));
      //     // this.tokenService.getCurrentRoleName(getLocalDefaultRole());

      //     this.reset();
      //   }
      // });
    }
    // else {
    //   if (idle) {
    //     console.log('ng-idle :: onTimeout !!!!');
    //     this.toastr.warning('Phiên đăng nhập của bạn đã hết hạn', 'Thông báo!');
    //     this.tokenService.logout(true);
    //     idle.stop();
    //   } else {
    //     console.log('session expired :: inactive');
    //     this.toastr.warning(
    //       'Phiên đăng nhập của bạn đã hết hạn!',
    //       'Thông báo!'
    //     );
    //     setTimeout(() => {
    //       this.tokenService.logout(true);
    //     }, 1000);
    //   }
    // }
  }

  reset() {
    // this.idle.watch();
  }
}
