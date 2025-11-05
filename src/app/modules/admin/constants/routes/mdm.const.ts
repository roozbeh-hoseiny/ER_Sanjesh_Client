import { NamedRoutes } from '@/core';

export type TAdminMDMRouteNames =
  | 'mdm'
  | 'mdmEducationalLevels'
  | 'mdmFieldOfStudies'
  | 'mdmRegions';

export const adminMDMNamedRoutes: NamedRoutes<TAdminMDMRouteNames> = {
  mdm: {
    path: 'mdm',
    redirectTo: 'mdm/educational-levels',
    meta: {
      title: 'مدیریت داده‌های مرجع',
    },
  },
  mdmEducationalLevels: {
    path: 'mdm/educational-levels',
    loadComponent: () =>
      import('../../pages/mdm/views/educationalLevels/admin-mdm-educational-levels.component').then(
        (m) => m.AdminMdmEducationalLevelsComponent,
      ),
    meta: {
      title: 'سطوح تحصیلی',
    },
  },
  mdmFieldOfStudies: {
    path: 'mdm/field-of-studies',
    loadComponent: () =>
      import('../../pages/mdm/views/fieldOfStudies/admin-mdm-field-of-studies.component').then(
        (m) => m.AdminMdmFieldOfStudiesComponent,
      ),
    meta: {
      title: 'رشته‌های تحصیلی',
    },
  },
  mdmRegions: {
    path: 'mdm/regions',
    loadComponent: () =>
      import('../../pages/mdm/views/regions/admin-mdm-regions.component').then(
        (m) => m.AdminMdmRegionsComponent,
      ),
    meta: {
      title: 'مناطق',
    },
  },
};
