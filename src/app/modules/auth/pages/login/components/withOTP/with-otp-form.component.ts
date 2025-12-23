import { AuthStore } from '@/modules/auth/state';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { OtpLoginMobileStepComponent } from './mobile-step.component';
import { OTPLoginOtpStepComponent } from './otp-step.component';

@Component({
  selector: 'app-login-with-otp-form',
  templateUrl: './with-otp-form.component.html',
  imports: [ReactiveFormsModule, OtpLoginMobileStepComponent, OTPLoginOtpStepComponent],
})
export class LoginWithOTPFormComponent {
  private readonly store = inject(AuthStore);

  readonly step = this.store.loginStep;
  readonly selectedRole = this.store.selectedRole;

  toPasswordLogin() {
    this.store.setLoginType('PASSWORD');
  }
}
