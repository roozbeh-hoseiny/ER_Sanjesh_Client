import { Routes } from '@angular/router';
import { AuthGuard, RoleGuard } from '../../core/guards';
import { UserRole } from '../../core/models';
import { AdminLayoutComponent } from './admin-layout.component';
import { adminNamedRoutes } from './constants';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    children: [adminNamedRoutes.login],
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN] },
    children: Object.values(adminNamedRoutes),
  },
];
