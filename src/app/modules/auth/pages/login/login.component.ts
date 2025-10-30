import { AuthService } from '@/core';
import rolesConst from '@/core/constants/roles.const';
import { IAuthResponse, LoginCredentials, TRoles } from '@/core/models';
import { UikitLabelComponent } from '@/uikit';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CaptchaService } from 'src/app/core/services/captcha.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    Password,
    InputText,
    ImageModule,
    ProgressSpinnerModule,
    UikitLabelComponent,
    RadioButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
})
export class LoginComponent {
  @Output() onSuccessfullySubmit = new EventEmitter<IAuthResponse>();

  @Input() redirectUrl!: string;
  @Input() loginApiUrl!: string;
  @Input() defaultRole?: TRoles;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly captchaService = inject(CaptchaService);

  readonly isLoading = this.authService.isLoading();
  readonly errorMessage = signal<string>('');
  readonly hidePassword = signal<boolean>(true);
  readonly isCaptchaExpired = this.captchaService.captchaIsExpired;
  readonly isCaptchaLoading = this.captchaService.loading;
  readonly captchaImageSrc = this.captchaService.captchaImageSrc;
  readonly roles = Object.values(rolesConst);

  readonly loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false],
    captcha: ['', [Validators.required]],
    role: [this.defaultRole || this.roles[0].key, [Validators.required]],
  });

  selectedRole = signal<TRoles>('ADMIN');
  ngOnInit() {
    this.captchaService.requestNewCaptcha();
  }

  togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword());
  }

  resetCaptcha(): void {
    this.fb.control('captcha').setValue('');
    this.captchaService.requestNewCaptcha();
  }

  onRefreshCaptcha(): void {
    this.captchaService.requestNewCaptcha();
  }
  onRefreshCaptchaImage(): void {
    document
      .getElementById('captchaImage')
      ?.setAttribute('src', this.captchaService.captchaImageSrc()! + `&${new Date().getTime()}`);
  }

  submit(): void {
    if (this.loginForm.valid && !!this.captchaService.captchaId()) {
      const credentials: LoginCredentials = this.loginForm.value as LoginCredentials;

      this.authService
        .login(credentials, (this.defaultRole || this.loginForm.value.role)!)
        .subscribe({
          next: (data) => {
            this.errorMessage.set('');
            if (this.redirectUrl) {
              this.router.navigateByUrl(this.redirectUrl.replace(/\/[^/]*$/, ''));
            } else {
              this.onSuccessfullySubmit.emit(data);
            }
          },
          error: (error) => {
            this.resetCaptcha();
            this.errorMessage.set('نام کاربری یا رمز عبور اشتباه است');
            console.error('Login failed:', error);
          },
        });
    }
  }
}
