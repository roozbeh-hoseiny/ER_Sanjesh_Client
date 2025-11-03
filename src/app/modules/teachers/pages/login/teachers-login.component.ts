import { LoginComponent } from '@/modules/auth/pages/login/login.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TEACHERS_API_ROUTES, TEACHERS_ROUTES } from '../../constants';

@Component({
  selector: 'teachers-login',
  standalone: true,
  templateUrl: './teachers-login.component.html',
  imports: [CommonModule, ReactiveFormsModule, LoginComponent],
})
export class TeachersLoginComponent {
  readonly loginApiUrl = TEACHERS_API_ROUTES.login();
  readonly redirectUrl = TEACHERS_ROUTES.root.path;
}
