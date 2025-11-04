import { AppLayout } from '@/layout/component/app.layout.component';
import { Routes } from '@angular/router';
import { ROLES } from 'src/assets/constants';
import { AuthGuard, RoleGuard } from '../../core/guards';
import { NamedRoutes } from '../../core/models';

export type GraderRouteNames = 'root' | 'dashboard';

export const graderNamedRoutes: NamedRoutes<GraderRouteNames> = {
  root: {
    path: '',
    component: AppLayout,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [ROLES.GRADER] },
    meta: {
      title: 'داشبورد تصحیح‌کننده',
    },
  },
  dashboard: {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/grader-dashboard.component').then(
        (m) => m.GraderDashboardComponent,
      ),
    meta: {
      title: 'داشبورد تصحیح‌کننده',
    },
  },
};

export const GRADER_ROUTES: Routes = [
  {
    ...graderNamedRoutes.root,
    children: [{ path: '', redirectTo: 'dashboard', pathMatch: 'full' }, graderNamedRoutes.root],
  },
];
