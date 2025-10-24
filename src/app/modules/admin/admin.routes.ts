import { Routes } from '@angular/router';
import { AuthGuard, RoleGuard } from '../../core/guards';
import { UserRole } from '../../core/models';
import { AdminLayoutComponent } from './admin-layout.component';
import { adminNamedRoutes } from './constants';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN] },
    children: Object.values(adminNamedRoutes),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/admin-login.component').then((m) => m.AdminLoginComponent),
    // meta: {
    //   title: 'لاگین',
    // },
  },
];
