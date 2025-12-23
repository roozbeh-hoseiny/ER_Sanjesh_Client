import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AuthSelectRolesComponent } from '../../components/select-roles.component';
import { AuthStore } from '../../state';
import { LoginWithPasswordFormComponent } from './components/with-password-form.component';
import { LoginWithOTPFormComponent } from './components/withOTP/with-otp-form.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RadioButtonModule,
    LoginWithPasswordFormComponent,
    LoginWithOTPFormComponent,
    AuthSelectRolesComponent,
  ],
})
export class LoginComponent {
  private readonly store = inject(AuthStore);

  loginType = this.store.loginType;
  canChangeRole = this.store.canChangeRole;
}
