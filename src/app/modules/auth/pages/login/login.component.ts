import { AuthService } from '@/core';
import { CaptchaService } from 'src/app/core/services/captcha.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { ImageModule } from 'primeng/image';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import images from 'src/assets/images';
import { LoginCredentials } from '@/core/models';
import { UikitLabelComponent } from '@/uikit';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    Checkbox,
    Password,
    InputText,
    ImageModule,
    ProgressSpinnerModule,
    UikitLabelComponent,
  ],
})
export class LoginComponent {
  @Output() submit = new EventEmitter<Promise<boolean>>();

  @Input() redirectUrl!: string;
  @Input() loginApiUrl!: string;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly captchaService = inject(CaptchaService);

  readonly isLoading = this.authService.isLoading;
  readonly errorMessage = signal<string>('');
  readonly hidePassword = signal<boolean>(true);
  readonly isCaptchaExpired = this.captchaService.captchaIsExpired;
  readonly isCaptchaLoading = this.captchaService.loading;
  readonly captchaImageSrc = this.captchaService.captchaImageSrc;

  readonly logo = images.logo;

  readonly loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false],
    captcha: ['', [Validators.required]],
  });

  ngOnInit() {
    this.captchaService.requestNewCaptcha();
  }

  togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword());
  }

  resetCaptcha(): void {
    this.captchaService.requestNewCaptcha();
  }

  onRefreshCaptcha(): void {
    this.captchaService.requestNewCaptcha();
  }

  onSubmit(): void {
    if (this.loginForm.valid && !!this.captchaService.captchaId()) {
      const credentials: LoginCredentials = this.loginForm.value as LoginCredentials;

      this.authService.login(credentials, this.loginApiUrl).subscribe({
        next: () => {
          this.errorMessage.set('');
          this.router.navigateByUrl(this.redirectUrl);
        },
        error: (error) => {
          this.errorMessage.set('نام کاربری یا رمز عبور اشتباه است');
          console.error('Login failed:', error);
        },
      });
    }
  }
}
