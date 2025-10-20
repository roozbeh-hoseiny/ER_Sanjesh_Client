import { LoginComponent } from '@/modules/auth/pages/login/login.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ADMIN_API_ROUTES, ADMIN_ROUTES } from '../../constants';

@Component({
  selector: 'admin-login',
  standalone: true,
  templateUrl: './admin-login.component.html',
  imports: [CommonModule, ReactiveFormsModule, LoginComponent],
})
export class AdminLoginComponent {
  readonly loginApiUrl = ADMIN_API_ROUTES.login();
  readonly redirectUrl = ADMIN_ROUTES.root.path;
}
