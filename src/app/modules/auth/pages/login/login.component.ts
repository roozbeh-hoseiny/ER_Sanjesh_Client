import { AuthService } from '@/core';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import images from 'src/assets/images';
import { LoginCredentials } from '../../../../core/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule, ReactiveFormsModule, Button, Checkbox, Password, InputText],
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = this.authService.isLoading;
  readonly errorMessage = signal<string>('');
  readonly hidePassword = signal<boolean>(true);

  readonly logo = images.logo;

  readonly loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword());
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials: LoginCredentials = this.loginForm.value as LoginCredentials;

      this.authService.login(credentials).subscribe({
        next: () => {
          this.errorMessage.set('');
        },
        error: (error) => {
          this.errorMessage.set('نام کاربری یا رمز عبور اشتباه است');
          console.error('Login failed:', error);
        },
      });
    }
  }
}
