import { Component } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgbModal,
  NgbPagination,
  NgbPaginationEllipsis,
  NgbPaginationNext,
  NgbPaginationPrevious,
} from '@ng-bootstrap/ng-bootstrap';
import { filter, map } from 'rxjs/operators';
import { UserManagerRoleAvailableComponent } from './user-manager-role-available/user-manager-role-available.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KeycloakMappingModel } from '../../../../keycloak/models/keycloak-mapping.model';
import { SearchInfoSec } from '../../../../../core/models/search';
import { UserKeycloakService } from '../../../../keycloak/services/user-keycloak.service';
import { KeycloakRoleModel } from '../../../../keycloak/models/keycloak-role.model';
import { Constant } from '../../../../../core/config/constant';
import { DialogConfirmComponent } from '../../../../../shared/dialog-confirm/dialog-confirm.component';
import { NeunLoadingComponent } from '../../../../../shared/neun-loading/neun-loading.component';
@Component({
  selector: 'app-user-manager-role',
  templateUrl: './user-manager-role.component.html',
  styleUrls: ['./user-manager-role.component.scss'],
  imports: [
    InlineSVGModule,
    NgIf,
    AsyncPipe,
    NgForOf,
    FormsModule,
    NgbPagination,
    NgbPaginationPrevious,
    NgbPaginationNext,
    NgbPaginationEllipsis,
    NeunLoadingComponent,
  ],
  standalone: true,
})
export class UserManagerRoleComponent {
  userId: string;
  roles$: Observable<KeycloakMappingModel>;

  searchModel = new SearchInfoSec();
  sizeList = [20, 50, 100];

  constructor(
    private userKeycloakService: UserKeycloakService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private modal: NgbModal,
  ) {
    const parentRoute = route.snapshot.parent;
    if (parentRoute?.params && parentRoute?.params['userId']) {
      this.userId = parentRoute?.params['userId'];
    }
  }

  ngOnInit() {
    this.onSearch();
  }

  getRoles(userId: string): Observable<KeycloakMappingModel> {
    return this.userKeycloakService.getRoleMappingsInUser(userId).pipe(
      map((data: KeycloakMappingModel) => {
        data.realmMappings = data.realmMappings.filter(
          (role) => role.name.indexOf(this.searchModel.text) > -1,
        );
        return data;
      }),
      tap((data) => {
        this.searchModel.length = data.realmMappings.length;
      }),
    );
  }

  deleteByUserIdAndRoles(userId: string, roles: KeycloakRoleModel[]): void {
    this.userKeycloakService.deleteRealmRoleInUser(userId, roles).subscribe({
      next: () => {
        this.toastr.success(Constant.MESSAGE.SUCCESS_DELETE);
      },
      error: () => {
        this.toastr.error(Constant.MESSAGE.ERROR_DELETE);
      },
    });
  }

  onSearch() {
    this.roles$ = this.getRoles(this.userId);
  }

  onChangeSearchKey(search: string) {
    this.searchModel.text = search;
    this.onSearch();
  }

  onAssignRole() {
    const roleModal = this.modal.open(UserManagerRoleAvailableComponent, {
      size: 'xl',
    });
    roleModal.componentInstance.userId = this.userId;
    roleModal.closed.subscribe({
      next: () => {
        setTimeout(() => {
          this.onSearch();
        }, 50);
      },
    });
  }

  onDelete(name: string, role: KeycloakRoleModel): void {
    const deleteModal = this.modal.open(DialogConfirmComponent, {
      animation: true,
      centered: true,
    });

    deleteModal.componentInstance.title = 'Đồng chí có chắc sẽ xóa quyền ';
    deleteModal.componentInstance.keyword = name;
    deleteModal.componentInstance.description =
      'Quyền này sẽ bị xóa khỏi danh sách';
    deleteModal.result.then((res: boolean) => {
      if (res) {
        this.deleteByUserIdAndRoles(this.userId, [role]);
        setTimeout(() => {
          this.onSearch();
        }, 50);
      }
    });
  }

  onChangePage(page: number) {
    this.searchModel.page = page;
    this.onSearch();
  }
}
