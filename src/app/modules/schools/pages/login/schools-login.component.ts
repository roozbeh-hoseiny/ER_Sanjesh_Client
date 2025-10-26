import { LoginComponent } from '@/modules/auth/pages/login/login.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SCHOOLS_API_ROUTES, SCHOOLS_ROUTES } from '../../constants';

@Component({
  selector: 'schools-login',
  standalone: true,
  templateUrl: './schools-login.component.html',
  imports: [CommonModule, ReactiveFormsModule, LoginComponent],
})
export class SchoolsLoginComponent {
  readonly loginApiUrl = SCHOOLS_API_ROUTES.login();
  readonly redirectUrl = SCHOOLS_ROUTES.root.path;
}
