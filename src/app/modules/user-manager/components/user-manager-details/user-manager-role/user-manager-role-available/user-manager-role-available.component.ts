import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { KeycloakRoleModel } from '../../../../../keycloak/models/keycloak-role.model';
import { SearchInfoSec } from '../../../../../../core/models/search';
import { UserKeycloakService } from '../../../../../keycloak/services/user-keycloak.service';
import { Constant } from '../../../../../../core/config/constant';
import { NeunLoadingComponent } from '../../../../../../shared/neun-loading/neun-loading.component';

@Component({
  selector: 'app-user-manager-role-available',
  templateUrl: './user-manager-role-available.component.html',
  styles: [],
  imports: [NgIf, AsyncPipe, NgForOf, NeunLoadingComponent],
  standalone: true,
})
export class UserManagerRoleAvailableComponent {
  @Input() userId: string;
  roles$: Observable<KeycloakRoleModel[]>;

  searchModel = new SearchInfoSec();

  constructor(
    private userKeycloakService: UserKeycloakService,
    private toastr: ToastrService,
    private modal: NgbActiveModal,
  ) {}

  ngOnInit() {
    this.onSearch();
  }

  getRoleAvailable(userId: string): Observable<KeycloakRoleModel[]> {
    return this.userKeycloakService.getRealmRolesAvailableInUser(userId).pipe(
      map((data: KeycloakRoleModel[]) => {
        data = data.filter(
          (role) => role.name.indexOf(this.searchModel.text) > -1,
        );
        return data;
      }),
    );
  }

  onSearch() {
    this.roles$ = this.getRoleAvailable(this.userId);
  }

  onChangeSearchKey(search: string) {
    this.searchModel.text = search;
    this.onSearch();
  }

  onAssign(role: KeycloakRoleModel) {
    this.userKeycloakService
      .updateRealmRoleInUser(this.userId, [role])
      .subscribe({
        next: () => {
          this.toastr.success(Constant.MESSAGE.SUCCESS_ASSIGN);
          this.onClose();
        },
        error: () => {
          this.toastr.error(Constant.MESSAGE.ERROR_ASSIGN);
          this.onClose();
        },
      });
  }

  onClose(): void {
    this.modal.close();
  }
}
