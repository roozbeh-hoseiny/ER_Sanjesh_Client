import { mobileValidator } from '@/core/validators';
import { AuthCaptchaComponent } from '@/modules/auth/components/captcha.component';
import { AuthStore } from '@/modules/auth/state';
import { InputComponent } from '@/shared/components';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-otp-login-mobile-step',
  templateUrl: './mobile-step.component.html',
  imports: [ReactiveFormsModule, InputComponent, Button, AuthCaptchaComponent],
})
export class OtpLoginMobileStepComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(AuthStore);

  selectedRole = this.store.selectedRole;
  loading = this.store.loading;

  form = this.fb.group({
    mobile: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required, mobileValidator()],
    }),
  });

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.store.sendOtp({ mobile: this.form.value.mobile! }).subscribe({
      next: () => {
        this.form.markAsPristine();
      },
      error: () => {
        this.form.markAsUntouched();
      },
    });
  }

  toPasswordLogin() {
    this.store.setLoginType('PASSWORD');
  }
  toSignup() {
    this.store.setAuthStep('signup');
  }
}
