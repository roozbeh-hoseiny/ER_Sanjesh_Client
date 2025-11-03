import { NamedRoutes } from '@/core';

export type TAdminSchoolsRouteNames = 'schools' | 'school';

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
  school: {
    path: 'schools/:schoolId',
    loadComponent: () =>
      import('../../pages/schools/views/admin-school.component').then(
        (m) => m.AdminSchoolComponent,
      ),
    meta: {
      title: 'مدرسه',
      pagePath: (id: string) => `/admin/schools/${id}`,
    },
  },
};
