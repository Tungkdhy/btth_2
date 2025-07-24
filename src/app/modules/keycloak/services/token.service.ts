import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { UserInfo } from '../models/user-info.model';
import { KeycloakUserInfo } from '../models/keycloak-user-info.model';
import { FieldsModel } from '@syncfusion/ej2-angular-dropdowns';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { deepCopyUseJSON } from '../../../_metronic/layout/core/common/common-utils';
// import { UnitModel } from '../../unit/models/unit.model';
import { Constant } from '../../../core/config/constant';
// import { UserService } from '../../users/services/user.service';
import { ResultAPIModel } from '../../../core/models/api-response.model';
import { Store } from '@ngrx/store';
// import { setUnitTreeView } from '../../../store/unit-tree-view/unit-tree-view.actions';
// import { updateHasChildrenForUnits } from '../../digital-map/services/utils';
// import { UnitDetailIntegrationModel } from '../../unit/models/unit-detail-integration.model';

export type UserInfoType = UserInfo | undefined;

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  public subModulePath: any = [];
  isLoadingSubject: BehaviorSubject<boolean>;

  private authLocalStorageToken = `userInfo`;

  constructor(
    private http: HttpClient,
    private router: Router,
    // private keycloak: KeycloakService,
    // private userService: UserService,
    private store: Store,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
  }

  getUserInfo(): UserInfo {
    const userInfo = localStorage.getItem(this.authLocalStorageToken) || null;
    return userInfo ? JSON.parse(userInfo) : <UserInfo>{};
  }

  getKeycloakUserInfo(): KeycloakUserInfo {
    return new KeycloakUserInfo(
      // this.keycloak.getKeycloakInstance().tokenParsed,
    );
  }

  getDiscriminator(): string {
    return this.getKeycloakUserInfo().discriminator;
  }

  checkDiscriminator(discriminator: string) {
    return this.getDiscriminator() === discriminator;
  }

  private setAuthFromLocalStorage(auth: UserInfo): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): UserInfo | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  // doAfterLogin(): Observable<UserInfoType> {
  //   this.isLoadingSubject.next(true);
  //   return this.userService.getUserInfo().pipe(
  //     map((response: ResultAPIModel) => {
  //       const userInfo = response.data;
  //       updateHasChildrenForUnits(userInfo.units);
  //       this.setAuthFromLocalStorage(userInfo);
  //       const units = userInfo.units;
  //       if (units.length === 0) {
  //         this.router.navigate(['/error/404']).then();
  //       }
  //       this.store.dispatch(setUnitTreeView({ units }));
  //       return userInfo;
  //     }),
  //     catchError((err) => {
  //       console.error('err', err);
  //       this.router.navigate(['/error/404']).then();
  //       return of(undefined);
  //     }),
  //     finalize(() => this.isLoadingSubject.next(false)),
  //   );
  // }

  logout() {
    // this.keycloak.logout().then(() => {
    //   this.keycloak.clearToken();
    //   localStorage.removeItem(this.authLocalStorageToken);
    // });
  }

  // getCurrentRoleName(): string[] | undefined {
  //   return this.getKeycloakUserInfo().realmAccess?.roles;
  // }

  getTimeCheck() {
    return localStorage.getItem('time_check');
  }

  setTimeCheck(timeCheck: any) {
    localStorage.setItem('time_check', timeCheck);
  }
  // getTreeById(id: string): Observable<FieldsModel> {
  //   // return of(this.getUserInfo().units).pipe(
  //   //   map((data: any) => {
  //   //     const selectedUnit = data.find((unit: any) => unit.id === id);
  //   //     let units = deepCopyUseJSON(data);
  //   //     // if (selectedUnit) {
  //   //     //   units = data
  //   //     //     .filter(
  //   //     //       (child: UnitModel) =>
  //   //     //         child.treeLeft >= selectedUnit.treeLeft &&
  //   //     //         child.treeRight <= selectedUnit.treeRight,
  //   //     //     )
  //   //     //     .sort((a: UnitModel, b: UnitModel) => a.treeLeft - b.treeLeft);
  //   //     // }

  //   //     units[0].parentId = null;
  //   //     units[0].selected = true;
  //   //     return {
  //   //       dataSource: units,
  //   //       value: 'id',
  //   //       text: 'name',
  //   //       parentValue: 'parentId',
  //   //       hasChildren: 'hasChildren',
  //   //     };
  //   //   }),
  //   // );
  // }

  // getUnitNamePathByUnitId(unitId: string): string {
  //   const unit = this.getUserInfo().units.find(
  //     (data: UnitDetailIntegrationModel) => data.id === unitId,
  //   );
  //   return unit ? this.normalizeNamePath(unit.namePath) : '';
  // }

  normalizeNamePath(fullName: string): string {
    const nameList = fullName.split('/').splice(1);
    return nameList.reverse().join('/');
  }

  getCurrentRoleName(): string[] | undefined {
    return this.getKeycloakUserInfo().realmAccess?.roles;
  }

  public isViewer(): boolean {
    const roles = this.getCurrentRoleName();
    if (!roles) return false;
    return roles.indexOf(Constant.REALM_ROLES.VIEWER) !== -1;
  }
}
