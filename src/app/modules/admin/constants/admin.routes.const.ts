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
    loadComponent: () =>
      import('../pages/login/admin-login.component').then((m) => m.AdminLoginComponent),
  },
  root: {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  dashboard: {
    path: 'dashboard',
    loadComponent: () =>
      import('../pages/root/admin-root.component').then((m) => m.AdminDashboardComponent),
  },
  users: {
    path: 'users',
    loadComponent: () =>
      import('../pages/root/admin-root.component').then((m) => m.AdminDashboardComponent),
  },
  mdm: {
    path: 'mdm',
    redirectTo: 'mdm/educational-levels',
  },
  mdmEducationalLevels: {
    path: 'mdm/educational-levels',
    loadComponent: () =>
      import('../pages/mdm/educationalLevels/admin-mdm-educational-levels.component').then(
        (m) => m.AdminMdmEducationalLevelsComponent,
      ),
  },
  mdmFieldOfStudies: {
    path: 'mdm/field-of-studies',
    loadComponent: () =>
      import('../pages/mdm/fieldOfStudies/admin-mdm-field-of-studies.component').then(
        (m) => m.AdminMdmFieldOfStudiesComponent,
      ),
  },
};
