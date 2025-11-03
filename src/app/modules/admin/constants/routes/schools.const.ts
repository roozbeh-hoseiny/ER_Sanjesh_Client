import { NamedRoutes } from '@/core';

export type TAdminSchoolsRouteNames = 'schools';

export const adminSchoolNamedRoutes: NamedRoutes<TAdminSchoolsRouteNames> = {
  schools: {
    path: 'schools',
    loadComponent: () =>
      import('../../pages/schools/views/admin-schools.component').then(
        (m) => m.AdminSchoolsComponent,
      ),
    meta: {
      title: 'مدارس',
    },
  },
};
