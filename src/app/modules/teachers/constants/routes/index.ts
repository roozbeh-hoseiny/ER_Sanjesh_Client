import { NamedRoutes } from '@/core';

export type TTeachersRouteNames = 'schools';

export const teachersNamedRoutes: NamedRoutes<TTeachersRouteNames> = {
  schools: {
    path: 'schools',
    loadComponent: () =>
      import('../../pages/dashboard/teachers-dashboard.component').then(
        (m) => m.TeachersDashboardComponent,
      ),
    meta: {
      title: 'داشبورد',
    },
  },
};
