import { AppLayout } from '@/layout/component/app.layout';
import { Routes } from '@angular/router';
import { AuthGuard, RoleGuard } from '../../core/guards';
import { NamedRoutes, UserRole } from '../../core/models';

export type SuperadminRouteNames = 'dashboard';

export const superadminNamedRoutes: NamedRoutes<SuperadminRouteNames> = {
  dashboard: {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/superadmin-dashboard.component').then(
        (m) => m.SuperadminDashboardComponent
      ),
  },
};

export const SUPERADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AppLayout,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SUPERADMIN] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      superadminNamedRoutes.dashboard,
    ],
  },
];
