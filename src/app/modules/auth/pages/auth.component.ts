import { TRoles } from '@/core';
import { Component, inject, Input, OnInit } from '@angular/core';
import images from 'src/assets/images';
import { AuthStore } from '../state';
import { AuthForgetPasswordComponent } from './forgetPassword/forget-password.component';
import { LoginComponent } from './login/login.component';
import { ModifyLoginInfoComponent } from './modifyLoginInfo/modify-login-info.component';
import { OTPComponent } from './otp/otp.component';
import { SignupComponent } from './signup/signup.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  imports: [
    LoginComponent,
    OTPComponent,
    ModifyLoginInfoComponent,
    SignupComponent,
    AuthForgetPasswordComponent,
  ],
})
export class AuthComponent implements OnInit {
  @Input() redirectUrl?: string;
  @Input() role?: TRoles;

  private readonly store = inject(AuthStore);

  readonly logo = images.logo;
  readonly authVector = images.login;

  ngOnInit(): void {
    if (this.role) {
      this.store.setSelectedRole(this.role);
    }
    if (this.redirectUrl) {
      this.store.setRedirectUrl(this.redirectUrl);
    }
  }

  get selectedRole() {
    return this.store.selectedRole();
  }
  get activeStep() {
    return this.store.authStep();
  }
}
