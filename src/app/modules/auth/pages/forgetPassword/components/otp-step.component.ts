import { MustMatch, password } from '@/core/validators';
import { AuthStore } from '@/modules/auth/state';
import { UikitFieldComponent } from '@/uikit';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';
import { Password } from 'primeng/password';

@Component({
  selector: 'app-otp-login-otp-step',
  standalone: true,
  imports: [
    CommonModule,
    InputOtpModule,
    FormsModule,
    ButtonDirective,
    UikitFieldComponent,
    Password,
  ],
  templateUrl: './otp-step.component.html',
})
export class OTPLoginOtpStepComponent {
  private readonly store = inject(AuthStore);
  private readonly fb = inject(FormBuilder);
  form = this.fb.group(
    {
      password: this.fb.control('', { validators: [password()], nonNullable: true }),
      confirmPassword: this.fb.control('', { validators: [password()], nonNullable: true }),
    },
    {
      validators: [MustMatch('password', 'confirmPassword')],
    },
  );

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

  submit = () => {
    this.store.loginWithOtp(this.otpCode()).subscribe();
  };
}
