import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KeycloakGroupsModel } from '../../groups-manager/models/keycloak-groups.model';
import { catchError, map } from 'rxjs/operators';
import {
  KeycloakUserModel,
  KeycloakUserPasswordModel,
} from '../models/keycloak-user.model';
import { HttpParams } from '@angular/common/http';
import {ApiHelper} from "../../../core/services/api-helper.service";
import {ErrorHandlerService} from "../../../core/services/error-handler.service";
import {Constant} from "../../../core/config/constant";
import {KeycloakMappingModel} from "../models/keycloak-mapping.model";
import {KeycloakRoleModel} from "../models/keycloak-role.model";

@Injectable({
  providedIn: 'root',
})
export class UserKeycloakService {
  constructor(
    private apiHelper: ApiHelper,
    private errorHandler: ErrorHandlerService
  ) {}

  private createHttpParams(
    search: string,
    page: number,
    size: number
  ): HttpParams {
    return new HttpParams()
      .append('search', search)
      .append('page', (page === 0 ? page : page - 1).toString())
      .append('size', size.toString());
  }

  getUsers(
    search: string = '',
    page: number = Constant.DEFAULT.PAGING.PAGE,
    size: number = Constant.DEFAULT.PAGING.SIZE
  ): Observable<KeycloakUserModel[]> {
    const params = this.createHttpParams(search, page, size);
    const url = Constant.URLS.KEYCLOAK.USER.GET_USERS;
    return this.apiHelper.get(url, { params: params }).pipe(
      map((value) => value.data),
      catchError((error) => this.errorHandler.handleError(error))
    );
  }

  countUsers(
    search: string = '',
    page: number = Constant.DEFAULT.PAGING.PAGE,
    size: number = Constant.DEFAULT.PAGING.SIZE
  ): Observable<number> {
    const params = this.createHttpParams(search, page, size);
    const url = Constant.URLS.KEYCLOAK.USER.COUNT_USERS;
    return this.apiHelper.get(url, { params: params }).pipe(
      map((value) => value.data),
      catchError((error) => this.errorHandler.handleError(error))
    );
  }

  getUserById(userID: string): Observable<KeycloakUserModel> {
    return this.apiHelper
      .get(Constant.URLS.KEYCLOAK.USER.GET_USER_BY_ID(userID))
      .pipe(
        map((value) => value.data),
        catchError((error) => this.errorHandler.handleError(error))
      );
  }

  updateUserById(userID: string, user: KeycloakUserModel): Observable<void> {
    return this.apiHelper
      .put(Constant.URLS.KEYCLOAK.USER.GET_USER_BY_ID(userID), user)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  toggleUserStatusById(
    userID: string,
    status: { enabled: boolean }
  ): Observable<void> {
    return this.apiHelper
      .put(Constant.URLS.KEYCLOAK.USER.GET_USER_BY_ID(userID), status)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  createUser(user: KeycloakUserModel): Observable<void> {
    return this.apiHelper
      .post(Constant.URLS.KEYCLOAK.USER.GET_USERS, user)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  deleteUserById(userID: string): Observable<void> {
    return this.apiHelper
      .delete(Constant.URLS.KEYCLOAK.USER.GET_USER_BY_ID(userID))
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  resetPassword(
    userID: string,
    password: KeycloakUserPasswordModel
  ): Observable<void> {
    return this.apiHelper
      .put(Constant.URLS.KEYCLOAK.USER.RESET_PASSWORD(userID), password)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  getGroupsInUser(
    userId: string,
    search: string = '',
    page: number = Constant.DEFAULT.PAGING.PAGE,
    size: number = Constant.DEFAULT.PAGING.SIZE
  ): Observable<KeycloakGroupsModel[]> {
    const params = this.createHttpParams(search, page, size);
    const url = Constant.URLS.KEYCLOAK.USER.GET_GROUPS_IN_USER(userId);
    return this.apiHelper.get(url, { params: params }).pipe(
      map((value) => value.data),
      catchError((error) => this.errorHandler.handleError(error))
    );
  }

  updateGroupInUser(userID: string, groupID: string): Observable<void> {
    return this.apiHelper
      .put(
        Constant.URLS.KEYCLOAK.USER.UPDATE_GROUP_IN_USER(userID, groupID),
        {}
      )
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  deleteGroupInUser(userID: string, groupID: string): Observable<void> {
    return this.apiHelper
      .delete(Constant.URLS.KEYCLOAK.USER.UPDATE_GROUP_IN_USER(userID, groupID))
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  getRoleMappingsInUser(userID: string): Observable<KeycloakMappingModel> {
    return this.apiHelper
      .get(Constant.URLS.KEYCLOAK.USER.GET_ROLE_MAPPINGS_IN_USER(userID))
      .pipe(
        map((value) => value.data),
        catchError((error) => this.errorHandler.handleError(error))
      );
  }

  getRealmRolesAvailableInUser(
    userID: string
  ): Observable<KeycloakRoleModel[]> {
    const url =
      Constant.URLS.KEYCLOAK.USER.GET_REALM_ROLES_AVAILABLE_IN_USER(userID);
    return this.apiHelper.get(url).pipe(
      map((value) => value.data),
      catchError((error) => this.errorHandler.handleError(error))
    );
  }

  updateRealmRoleInUser(
    userID: string,
    roles: KeycloakRoleModel[]
  ): Observable<void> {
    return this.apiHelper
      .post(
        Constant.URLS.KEYCLOAK.USER.UPDATE_REALM_ROLE_IN_USER(userID),
        roles
      )
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  deleteRealmRoleInUser(
    userID: string,
    roles: KeycloakRoleModel[]
  ): Observable<void> {
    return this.apiHelper
      .delete(Constant.URLS.KEYCLOAK.USER.UPDATE_REALM_ROLE_IN_USER(userID), {
        body: roles,
      })
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }
}
