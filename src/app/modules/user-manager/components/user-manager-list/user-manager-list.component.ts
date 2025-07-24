import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgbModal,
  NgbPagination,
  NgbPaginationEllipsis,
  NgbPaginationNext,
  NgbPaginationPrevious,
} from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KeycloakUserModel } from '../../../keycloak/models/keycloak-user.model';
import { SearchInfoSec } from '../../../../core/models/search';
import { UserKeycloakService } from '../../../keycloak/services/user-keycloak.service';
import { Constant } from '../../../../core/config/constant';
import { DialogConfirmComponent } from '../../../../shared/dialog-confirm/dialog-confirm.component';
import { DropdownMenuComponent } from '../../../../shared/dropdown-menu/dropdown-menu.component';
import { NeunLoadingComponent } from '../../../../shared/neun-loading/neun-loading.component';

@Component({
  selector: 'app-user-manager-list',
  templateUrl: './user-manager-list.component.html',
  styleUrls: ['./user-manager-list.component.scss'],
  imports: [
    InlineSVGModule,
    NgIf,
    AsyncPipe,
    FormsModule,
    NgForOf,
    NgbPagination,
    NgbPaginationPrevious,
    NgbPaginationNext,
    NgbPaginationEllipsis,
    DropdownMenuComponent,
    NeunLoadingComponent,
  ],
  standalone: true,
})
export class UserManagerListComponent implements OnInit {
  users$: Observable<KeycloakUserModel[]>;

  searchModel = new SearchInfoSec();
  sizeList = [20, 50, 100];

  length$: Observable<number>;

  constructor(
    private userKeycloakService: UserKeycloakService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private modal: NgbModal,
  ) {}

  ngOnInit() {
    this.onSearch();
  }

  getUsers(
    search: string = '',
    page: number = 0,
    size: number = 10,
  ): Observable<KeycloakUserModel[]> {
    return this.userKeycloakService.getUsers(
      search,
      page === 0 ? page : page - 1,
      size,
    );
  }

  countUsers(
    search: string = '',
    page: number = 0,
    size: number = 10,
  ): Observable<number> {
    return this.userKeycloakService.countUsers(
      search,
      page === 0 ? page : page - 1,
      size,
    );
  }

  deleteById(userId: string): void {
    this.userKeycloakService.deleteUserById(userId).subscribe({
      next: () => {
        this.toastr.success(Constant.MESSAGE.SUCCESS_DELETE);
      },
      error: () => {
        this.toastr.error(Constant.MESSAGE.ERROR_DELETE);
      },
    });
  }

  onSearch() {
    this.users$ = this.getUsers(
      this.searchModel.text,
      this.searchModel.page,
      this.searchModel.size,
    );

    this.length$ = this.countUsers(
      this.searchModel.text,
      this.searchModel.page,
      this.searchModel.size,
    );
  }

  onChangeSearchKey(search: string) {
    this.searchModel.text = search;
    this.onSearch();
  }

  onCreate() {
    this.router.navigate(['them-moi'], { relativeTo: this.route }).then();
  }
  onEdit(id: string): void {
    this.router.navigate([id, 'chi-tiet'], { relativeTo: this.route }).then();
  }
  onDelete(id: string, name: string): void {
    const deleteModal = this.modal.open(DialogConfirmComponent, {
      animation: true,
      centered: true,
    });

    deleteModal.componentInstance.title = 'Đồng chí có chắc sẽ xóa người dùng ';
    deleteModal.componentInstance.keyword = name;
    deleteModal.componentInstance.description =
      'Người dùng này sẽ bị xóa khỏi danh sách';
    deleteModal.result.then((res: boolean) => {
      if (res) {
        this.deleteById(id);
        setTimeout(() => {
          this.onSearch();
        }, 50);
      }
    });
  }

  onToggleStatus(userId: string, currentStatus: boolean): void {
    this.userKeycloakService
      .toggleUserStatusById(userId, { enabled: !currentStatus })
      .subscribe({
        next: () => {
          this.toastr.success(
            Constant.MESSAGE.SUCCESS_TOGGLE_USER_STATUS(currentStatus),
          );
          this.onSearch();
        },
        error: () =>
          this.toastr.error(
            Constant.MESSAGE.SUCCESS_TOGGLE_USER_STATUS(currentStatus),
          ),
      });
  }

  onChangePage(page: number) {
    this.searchModel.page = page;
    this.onSearch();
  }
}
