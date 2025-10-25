import { NamedRoutes } from '@/core';

export type TSchoolsRouteNames = 'schools';

export const schoolsNamedRoutes: NamedRoutes<TSchoolsRouteNames> = {
  schools: {
    path: 'schools',
    loadComponent: () =>
      import('../../pages/dashboard/schools-dashboard.component').then(
        (m) => m.SchoolsDashboardComponent,
      ),
    meta: {
      title: 'داشبورد',
    },
  },
};
