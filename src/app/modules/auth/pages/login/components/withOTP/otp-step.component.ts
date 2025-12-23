import { AuthStore } from '@/modules/auth/state';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';

@Component({
  selector: 'app-otp-login-otp-step',
  standalone: true,
  imports: [CommonModule, InputOtpModule, FormsModule, ButtonDirective],
  templateUrl: './otp-step.component.html',
})
export class OTPLoginOtpStepComponent {
  private readonly store = inject(AuthStore);

  otpCode = signal<string>('');
  submitLoading = signal<boolean>(false);

  countdown = signal<number>(60 * 2); // 2 minutes

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
    // this.store.sendOtp()
    this.countdown.set(120);
    this.startCountdown();
  }

  submit = () => {};
}
