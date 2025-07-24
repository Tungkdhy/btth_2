import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { passwordMatchValidator } from './password-match.directive';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';
import { UserKeycloakService } from '../../../../keycloak/services/user-keycloak.service';
import { KeycloakUserPasswordModel } from '../../../../keycloak/models/keycloak-user.model';
import { Constant } from '../../../../../core/config/constant';

@Component({
  selector: 'app-user-manager-password',
  templateUrl: './user-manager-password.component.html',
  styleUrls: ['./user-manager-password.component.scss'],
  imports: [ReactiveFormsModule, NgIf],
  standalone: true,
})
export class UserManagerPasswordComponent {
  userId: string;
  passwordFormGroup: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private route: ActivatedRoute,
    private passwordService: UserKeycloakService,
    private toastr: ToastrService,
  ) {
    const parentRoute = route.snapshot.parent;
    if (parentRoute?.params && parentRoute?.params['userId']) {
      this.userId = parentRoute?.params['userId'];
    }
    this.initFormGroup();
  }
  onSubmit() {
    if (this.passwordFormGroup.invalid) return;
    this.resetPassword(
      this.userId,
      this.createPasswordForm(
        this.passwordFormGroup.controls['password'].value,
      ),
    );
    console.log(this.passwordFormGroup.value);
  }

  createPasswordForm(value: string): KeycloakUserPasswordModel {
    return {
      temporary: false,
      type: 'password',
      value: value,
    };
  }

  resetPassword(userId: string, password: KeycloakUserPasswordModel): void {
    this.passwordService.resetPassword(userId, password).subscribe({
      next: () => this.toastr.success(Constant.MESSAGE.SUCCESS_RESET_PASSWORD),
      error: () => this.toastr.error(Constant.MESSAGE.ERROR_ADD),
    });
  }

  initFormGroup(): void {
    this.passwordFormGroup = new FormGroup(
      {
        password: new FormControl(null, Validators.required),
        confirmPassword: new FormControl(null, Validators.required),
      },
      { validators: passwordMatchValidator },
    );
  }
}
