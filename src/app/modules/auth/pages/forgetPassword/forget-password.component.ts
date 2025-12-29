import { AuthStore } from '@/modules/auth/state';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { OtpForgetPasswordMobileStepComponent } from './components/mobile-step.component';
import { OTPForgetPasswordOtpStepComponent } from './components/otp-step.component';

@Component({
  selector: 'app-auth-forget-password',
  templateUrl: './forget-password.component.html',
  imports: [
    ReactiveFormsModule,
    OtpForgetPasswordMobileStepComponent,
    OTPForgetPasswordOtpStepComponent,
  ],
})
export class AuthForgetPasswordComponent {
  private readonly store = inject(AuthStore);

  readonly step = this.store.loginStep;
  readonly selectedRole = this.store.selectedRole;

  toLogin() {
    this.store.setAuthStep('login');
  }
}
