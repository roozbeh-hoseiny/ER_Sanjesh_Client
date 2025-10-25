import { AppLayout } from '@/layout/component/app.layout.component';
import { Routes } from '@angular/router';
import { AuthGuard, RoleGuard } from '../../core/guards';
import { NamedRoutes, UserRole } from '../../core/models';

export type TSchoolsRouteNames = 'dashboard';

export const SchoolsNamedRoutes: NamedRoutes<TSchoolsRouteNames> = {
  dashboard: {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/schools-dashboard.component').then(
        (m) => m.SchoolsDashboardComponent,
      ),
    meta: {
      title: 'داشبورد مدیر مدرسه',
    },
  },
};

export const SCHOOLS_ROUTES: Routes = [
  {
    path: '',
    component: AppLayout,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SCHOOLS] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      SchoolsNamedRoutes.dashboard,
    ],
  },
];
