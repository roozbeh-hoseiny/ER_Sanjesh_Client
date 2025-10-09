import { AppLayout } from '@/layout/component/app.layout';
import { Routes } from '@angular/router';
import { AuthGuard, RoleGuard } from '../../core/guards';
import { NamedRoutes, UserRole } from '../../core/models';

export type AdminRouteNames = 'dashboard';

export const adminNamedRoutes: NamedRoutes<AdminRouteNames> = {
  dashboard: {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
  },
};

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AppLayout,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      adminNamedRoutes.dashboard,
    ],
  },
];
