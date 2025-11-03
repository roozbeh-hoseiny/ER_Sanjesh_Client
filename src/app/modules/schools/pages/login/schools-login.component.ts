import { AuthComponent } from '@/modules/auth/pages/auth.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SCHOOLS_API_ROUTES, SCHOOLS_ROUTES } from '../../constants';

@Component({
  selector: 'schools-login',
  standalone: true,
  templateUrl: './schools-login.component.html',
  imports: [CommonModule, ReactiveFormsModule, AuthComponent],
})
export class SchoolsLoginComponent {
  readonly loginApiUrl = SCHOOLS_API_ROUTES.login();
  readonly redirectUrl = SCHOOLS_ROUTES.root.path;
}
