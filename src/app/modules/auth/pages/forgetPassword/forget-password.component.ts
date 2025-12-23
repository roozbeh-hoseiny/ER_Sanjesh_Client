import { AuthStore } from '@/modules/auth/state';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { OtpLoginMobileStepComponent } from './components/mobile-step.component';
import { OTPLoginOtpStepComponent } from './components/otp-step.component';

@Component({
  selector: 'app-auth-forget-password',
  templateUrl: './forget-password.component.html',
  imports: [ReactiveFormsModule, OtpLoginMobileStepComponent, OTPLoginOtpStepComponent],
})
export class AuthForgetPasswordComponent {
  private readonly store = inject(AuthStore);

  readonly selectedRole = this.store.selectedRole;

  toLogin() {
    this.store.setAuthStep('login');
  }
}
