import { LoginComponent } from '@/modules/auth/pages/login/login.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'admin-login',
  standalone: true,
  template: `<app-login />`,
  imports: [CommonModule, ReactiveFormsModule, LoginComponent],
})
export class AdminLoginComponent {}
