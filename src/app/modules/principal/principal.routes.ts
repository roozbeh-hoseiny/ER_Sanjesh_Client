import { AppLayout } from '@/layout/component/app.layout.component';
import { Routes } from '@angular/router';
import { AuthGuard, RoleGuard } from '../../core/guards';
import { NamedRoutes, UserRole } from '../../core/models';

export type PrincipalRouteNames = 'dashboard';

export const principalNamedRoutes: NamedRoutes<PrincipalRouteNames> = {
  dashboard: {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/principal-dashboard.component').then(
        (m) => m.PrincipalDashboardComponent,
      ),
    meta: {
      title: 'داشبورد مدیر مدرسه',
    },
  },
};

export const PRINCIPAL_ROUTES: Routes = [
  {
    path: '',
    component: AppLayout,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.PRINCIPAL] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      principalNamedRoutes.dashboard,
    ],
  },
];
