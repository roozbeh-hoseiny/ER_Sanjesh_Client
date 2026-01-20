import { LoginCredentials } from '@/core';
import { CaptchaService } from '@/core/services/captcha.service';
import { AuthCaptchaComponent } from '@/modules/auth/components/captcha.component';
import { CENTRAL_AUTH_ROLES } from '@/modules/auth/constants/central-auth-roles.const';
import { AuthStore } from '@/modules/auth/state';
import { InputComponent } from '@/shared/components';
import { UikitFieldComponent } from '@/uikit';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { Password } from 'primeng/password';
import { ChangeLoginTypeActionsComponent } from './change-login-type-actions.component';

@Component({
  selector: 'app-login-with-password-form',
  templateUrl: './with-password-form.component.html',
  imports: [
    ReactiveFormsModule,
    UikitFieldComponent,
    InputComponent,
    Password,
    Button,
    AuthCaptchaComponent,
    ChangeLoginTypeActionsComponent,
  ],
})
export class LoginWithPasswordFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(AuthStore);

  // readonly isLoading = computed(() => this.store.isLoading());
  readonly errorMessage = signal<string>('');
  readonly hidePassword = signal<boolean>(true);
  readonly centralAuthRoles = CENTRAL_AUTH_ROLES;

  readonly loginForm = this.fb.group({
    username: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    password: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    rememberMe: this.fb.control(false),
  });

  constructor(private readonly captchaService: CaptchaService) {}

  selectedRole = this.store.selectedRole;
  submitLoading = this.store.loading;

  togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword());
  }

  resetCaptcha(): void {
    this.fb.control('captcha').setValue('');
    this.captchaService.renewCaptcha();
  }

  toSignup() {
    this.store.setAuthStep('signup');
  }

  toOTPLogin() {
    this.store.setLoginType('OTP');
  }
  toVoiceOTPLogin() {
    this.store.setLoginType('VOICE_OTP');
  }
  toForgetPassword() {
    this.store.setAuthStep('forgetPassword');
  }

  submit(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    const credentials = this.loginForm.value as LoginCredentials;

    this.store.login(credentials).subscribe({
      next: (data) => {
        this.errorMessage.set('');
        this.loginForm.markAsPristine();
      },
      error: (error) => {
        this.resetCaptcha();
        this.loginForm.markAsPristine();
        this.errorMessage.set('نام کاربری یا رمز عبور اشتباه است');
      },
    });
  }
}
