import {
  Component,
  HostBinding,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { TranslationService } from '../../../../../../modules/i18n';
import { UserType } from '../../../../../../modules/auth';
import { KeycloakUserInfo } from '../../../../../../modules/keycloak/models/keycloak-user-info.model';
import { MenuModel } from '@syncfusion/ej2-angular-navigations';
import { KeycloakService } from 'keycloak-angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { ChangePasswordComponent } from '../../../../../../modules/users/components/change-password/change-password.component';
import { selectCurrentUnitId } from '../../../../../../store/unit-tree-view/unit-tree-view.selectors';
import { Constant } from '../../../../../../core/config/constant';
import { convertToUrl } from '../../../../../layout/core/common/common-utils';

@Component({
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html',
})
export class UserInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  language: LanguageFlag;
  user$: Observable<UserType>;
  langs = languages;
  user: KeycloakUserInfo;
  menu = Constant.MENU;

  public modules: MenuModel[];
  private keycloak: KeycloakService = inject(KeycloakService);
  private translationService: TranslationService = inject(TranslationService);
  private modal: NgbModal = inject(NgbModal);

  unitId$: Observable<string | null>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    // this.user$ = this.auth.currentUserSubject.asObservable();
    this.user = new KeycloakUserInfo(
      this.keycloak.getKeycloakInstance().tokenParsed,
    );
    this.setLanguage(this.translationService.getSelectedLanguage());
    this.unitId$ = this.store.select(selectCurrentUnitId);
  }

  // get unitId(): string {
  //   const unitId = sessionStorage.getItem(Constant.STORAGE_KEY.CURRENT_UNIT);
  //   return unitId
  //     ? JSON.parse(unitId).id
  //     : this.token.getUserInfo().units[0].id;
  // }

  hasMenuAllow(item: string) {
    return this.keycloak.isUserInRole(item);
  }

  openDialogChangePassword(): void {
    this.modal.open(ChangePasswordComponent, {
      animation: true,
      centered: true,
      size: 'lg',
    });
  }

  logout() {
    // this.clearParams();
    this.keycloak.logout().then(() => {
      this.keycloak.clearToken();
    });
  }

  // logout() {
  //   this.auth.logout();
  //   document.location.reload();
  // }

  selectLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.setLanguage(lang);
    // document.location.reload();
  }

  setLanguage(lang: string) {
    this.langs.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
  }

  ngOnDestroy() {}

  protected readonly convertToUrl = convertToUrl;
}

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

const languages = [
  {
    lang: 'en',
    name: 'English',
    flag: './assets/media/flags/united-states.svg',
  },
  {
    lang: 'zh',
    name: 'Mandarin',
    flag: './assets/media/flags/china.svg',
  },
  {
    lang: 'es',
    name: 'Spanish',
    flag: './assets/media/flags/spain.svg',
  },
  {
    lang: 'ja',
    name: 'Japanese',
    flag: './assets/media/flags/japan.svg',
  },
  {
    lang: 'de',
    name: 'German',
    flag: './assets/media/flags/germany.svg',
  },
  {
    lang: 'fr',
    name: 'French',
    flag: './assets/media/flags/france.svg',
  },
  {
    lang: 'vi',
    name: 'Tiếng Việt',
    flag: './assets/media/flags/france.svg',
  },
];
