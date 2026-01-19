import { AuthStore } from '@/modules/auth/state';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { VoiceOtpLoginMobileStepComponent } from './mobile-step.component';
import { VoiceOTPLoginOtpStepComponent } from './otp-step.component';

@Component({
  selector: 'app-login-with-voice-otp-form',
  templateUrl: './with-otp-form.component.html',
  imports: [ReactiveFormsModule, VoiceOtpLoginMobileStepComponent, VoiceOTPLoginOtpStepComponent],
})
export class LoginWithVoiceOTPFormComponent {
  private readonly store = inject(AuthStore);

  readonly step = this.store.loginStep;
  readonly selectedRole = this.store.selectedRole;

  toPasswordLogin() {
    this.store.setLoginType('PASSWORD');
  }
}
