import { NamedRoutes } from '@/core';

export type TAdminSchoolsRouteNames = 'schools';

export const adminSchoolNamedRoutes: NamedRoutes<TAdminSchoolsRouteNames> = {
  schools: {
    path: 'schools',
    loadComponent: () =>
      import('../../pages/mdm/educationalLevels/admin-mdm-educational-levels.component').then(
        (m) => m.AdminMdmEducationalLevelsComponent,
      ),
    meta: {
      title: 'مدارس',
    },
  },
};
