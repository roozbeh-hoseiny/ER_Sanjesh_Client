import { AppLayout } from '@/layout/component/app.layout.component';
import { Routes } from '@angular/router';
import { ROLES } from 'src/assets/constants';
import { AuthGuard, RoleGuard } from '../../core/guards';
import { NamedRoutes } from '../../core/models';

export type StudentRouteNames = 'dashboard' | 'exams' | 'results' | 'profile';

export const studentNamedRoutes: NamedRoutes<StudentRouteNames> = {
  dashboard: {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/student-dashboard.component').then(
        (m) => m.StudentDashboardComponent,
      ),
    meta: {
      title: 'داشبورد دانش‌آموز',
    },
  },
  exams: {
    path: 'exams',
    loadComponent: () =>
      import('./pages/exams/student-exams.component').then((m) => m.StudentExamsComponent),
    meta: {
      title: 'آزمون‌ها',
    },
  },
  results: {
    path: 'results',
    loadComponent: () =>
      import('./pages/results/student-results.component').then((m) => m.StudentResultsComponent),
    meta: {
      title: 'نتایج آزمون‌ها',
    },
  },
  profile: {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/student-profile.component').then((m) => m.StudentProfileComponent),
    meta: {
      title: 'پروفایل من',
    },
  },
};

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    component: AppLayout,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [ROLES.STUDENTS] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      studentNamedRoutes.dashboard,
      studentNamedRoutes.exams,
      studentNamedRoutes.results,
      studentNamedRoutes.profile,
    ],
  },
];
