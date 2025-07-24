import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';
import { KeycloakUserModel } from '../../../keycloak/models/keycloak-user.model';
import { UserKeycloakService } from '../../../keycloak/services/user-keycloak.service';
import { Constant } from '../../../../core/config/constant';

@Component({
  selector: 'app-user-manager-form',
  templateUrl: './user-manager-form.component.html',
  styles: [],
  imports: [ReactiveFormsModule, NgIf],
  standalone: true,
})
export class UserManagerFormComponent implements OnInit {
  @Output() done: EventEmitter<void> = new EventEmitter<void>();
  userId: string;
  userFormGroup: FormGroup;
  user: KeycloakUserModel;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private userKeycloakService: UserKeycloakService,
    private formBuilder: FormBuilder,
  ) {
    const parentRoute = route.snapshot.parent;
    if (parentRoute?.params && parentRoute?.params['userId']) {
      this.userId = parentRoute?.params['userId'];
    }
    this.initFormGroup();
  }

  ngOnInit() {
    if (this.userId) {
      this.getUserById(this.userId);
    }
  }

  initFormGroup(): void {
    this.userFormGroup = this.formBuilder.group({
      id: [''],
      username: [
        {
          value: '',
          disabled: this.userId,
        },
        Validators.required,
      ],
      lastName: [''],
      firstName: [''],
      enabled: [true],
    });
  }

  onSubmit(): void {
    if (this.userFormGroup.invalid) return;

    this.userId
      ? this.updateUser(this.userFormGroup.value)
      : this.createUser(this.userFormGroup.value);
  }

  createUser(user: KeycloakUserModel): void {
    this.userKeycloakService.createUser(user).subscribe({
      next: () => {
        this.toastr.success(Constant.MESSAGE.SUCCESS_ADD);
        this.done.emit();
      },
      error: (error: Error) => {
        this.toastr.error(error.message);
        this.done.emit();
      },
    });
  }

  getUserById(userId: string): void {
    this.userKeycloakService.getUserById(userId).subscribe({
      next: (user: KeycloakUserModel) => {
        this.user = user;
        this.userFormGroup.patchValue(user);
      },
      error: (error: Error) => {
        console.error(error.message);
        this.toastr.error(Constant.MESSAGE.ERROR_GET);
      },
    });
  }

  updateUser(updatedUser: KeycloakUserModel): void {
    this.userKeycloakService
      .updateUserById(updatedUser.id, updatedUser)
      .subscribe({
        next: () => {
          this.toastr.success(Constant.MESSAGE.SUCCESS_UPDATE);
        },
        error: (error: Error) => {
          this.toastr.error(Constant.MESSAGE.ERROR_UPDATE);
          console.error(error.message);
        },
      });
  }
}
