import { ToastService } from '@/core/services/toast.service';
import { AuthCaptchaComponent } from '@/modules/auth/components/captcha.component';
import { AuthStore } from '@/modules/auth/state';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';

@Component({
  selector: 'app-otp-login-otp-step',
  standalone: true,
  imports: [CommonModule, InputOtpModule, FormsModule, ButtonDirective, AuthCaptchaComponent],
  templateUrl: './otp-step.component.html',
})
export class OTPLoginOtpStepComponent {
  private readonly store = inject(AuthStore);
  private readonly toast = inject(ToastService);

  otpCode = signal<string>('');
  submitLoading = this.store.loading;
  countdown = signal<number>(60 * 2); // 2 minutes

  readonly pendingUserInfo = this.store.pendingUserInfo;

  constructor() {
    this.startCountdown();
  }

  startCountdown() {
    const interval = setInterval(() => {
      if (this.countdown() > 0) {
        this.countdown.set(this.countdown() - 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  resendOtp() {
    this.store.resendOtp().subscribe({
      next: () => {
        this.otpCode.set('');
        this.countdown.set(120);
        this.startCountdown();
      },
    });
  }

  modifyPhone() {
    this.store.setLoginStep('SEND_OTP');
  }

  submit = () => {
    if (this.otpCode().length !== 6) {
      this.toast.error({ text: 'کد را به صورت کامل وارد کنید' });
    } else {
      this.store.loginWithOtp({ otp: this.otpCode() }).subscribe({});
    }
  };
}
