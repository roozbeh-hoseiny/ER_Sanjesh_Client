import { AppLayout } from '@/layout/component/app.layout.component';
import { Routes } from '@angular/router';
import { AuthGuard, RoleGuard } from '../../core/guards';
import { NamedRoutes, UserRole } from '../../core/models';

export type GraderRouteNames = 'root' | 'dashboard';

export const graderNamedRoutes: NamedRoutes<GraderRouteNames> = {
  root: {
    path: '',
    component: AppLayout,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.GRADER] },
  },
  dashboard: {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/grader-dashboard.component').then(
        (m) => m.GraderDashboardComponent,
      ),
  },
};

export const GRADER_ROUTES: Routes = [
  {
    ...graderNamedRoutes.root,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      graderNamedRoutes.dashboard,
    ],
  },
];
