import { ToastService } from '@/core/services/toast.service';
import { MustMatch, password } from '@/core/validators';
import { AuthCaptchaComponent } from '@/modules/auth/components/captcha.component';
import { AuthStore } from '@/modules/auth/state';
import { UikitFieldComponent } from '@/uikit';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';
import { Password } from 'primeng/password';

@Component({
  selector: 'app-otp-forget-password-otp-step',
  standalone: true,
  imports: [
    CommonModule,
    InputOtpModule,
    FormsModule,
    ButtonDirective,
    UikitFieldComponent,
    Password,
    AuthCaptchaComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './otp-step.component.html',
})
export class OTPForgetPasswordOtpStepComponent {
  private readonly store = inject(AuthStore);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

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
  countdown = signal<number>(60 * 2); // 2 minutes

  readonly pendingUserInfo = this.store.pendingUserInfo;
  readonly loading = this.store.loading;

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
    this.store.resendForgetPasswordOtp().subscribe({
      next: () => {
        this.otpCode.set('');
        this.countdown.set(120);
        this.startCountdown();
      },
    });
  }

  toLogin() {
    this.store.setAuthStep('login');
  }

  submit = () => {
    if (this.otpCode().length !== 6) {
      this.toast.error({ text: 'کد را به صورت کامل وارد کنید' });
      return;
    }
    this.store
      .resetPasswordWithOtp({
        otp: this.otpCode(),
        password: this.form.value.password!,
      })
      .subscribe();
    // this.store.loginWithOtp(this.otpCode()).subscribe();
  };
}
