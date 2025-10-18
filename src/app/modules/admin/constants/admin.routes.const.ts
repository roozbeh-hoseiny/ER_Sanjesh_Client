import { NamedRoutes } from '@/core';

export type AdminRouteNames =
  | 'root'
  | 'login'
  | 'dashboard'
  | 'users'
  | 'mdm'
  | 'mdmEducationalLevels'
  | 'mdmFieldOfStudies';

export const adminNamedRoutes: NamedRoutes<AdminRouteNames> = {
  login: {
    path: 'login',
    meta: {
      title: 'لاگین',
    },
    loadComponent: () =>
      import('../pages/login/admin-login.component').then((m) => m.AdminLoginComponent),
  },
  root: {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
    meta: {
      title: 'داشبورد',
    },
  },
  dashboard: {
    path: 'dashboard',
    loadComponent: () =>
      import('../pages/root/admin-root.component').then((m) => m.AdminDashboardComponent),
    meta: {
      title: 'داشبورد',
    },
  },
  users: {
    path: 'users',
    loadComponent: () =>
      import('../pages/root/admin-root.component').then((m) => m.AdminDashboardComponent),
    meta: {
      title: 'کاربران',
    },
  },
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
      import('../pages/mdm/educationalLevels/admin-mdm-educational-levels.component').then(
        (m) => m.AdminMdmEducationalLevelsComponent,
      ),
    meta: {
      title: 'سطوح تحصیلی',
    },
  },
  mdmFieldOfStudies: {
    path: 'mdm/field-of-studies',
    loadComponent: () =>
      import('../pages/mdm/fieldOfStudies/admin-mdm-field-of-studies.component').then(
        (m) => m.AdminMdmFieldOfStudiesComponent,
      ),
    meta: {
      title: 'رشته‌های تحصیلی',
    },
  },
};
