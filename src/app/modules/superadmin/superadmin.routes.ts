import { AppLayout } from '@/layout/component/app.layout.component';
import { Routes } from '@angular/router';
import { ROLES } from 'src/assets/constants';
import { AuthGuard, RoleGuard } from '../../core/guards';
import { NamedRoutes } from '../../core/models';

export type SuperadminRouteNames = 'dashboard';

export const superadminNamedRoutes: NamedRoutes<SuperadminRouteNames> = {
  dashboard: {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/superadmin-dashboard.component').then(
        (m) => m.SuperadminDashboardComponent,
      ),

    meta: {
      title: 'داشبورد سوپرادمین',
    },
  },
};

export const SUPERADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AppLayout,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [ROLES.SUPERADMIN] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      superadminNamedRoutes.dashboard,
    ],
  },
];
