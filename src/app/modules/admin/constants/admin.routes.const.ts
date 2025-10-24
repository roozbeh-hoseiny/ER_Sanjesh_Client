import { NamedRoutes } from '@/core';
import { adminMDMNamedRoutes, TAdminMDMRouteNames } from './routes';
import { adminSchoolNamedRoutes, type TAdminSchoolsRouteNames } from './routes/schools.const';

export type AdminRouteNames = 'root' | 'users' | TAdminSchoolsRouteNames | TAdminMDMRouteNames;

export const adminNamedRoutes: NamedRoutes<AdminRouteNames> = {
  root: {
    path: '',
    redirectTo: adminSchoolNamedRoutes.schools.path,
    pathMatch: 'full',
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
  ...adminMDMNamedRoutes,
  ...adminSchoolNamedRoutes,
};

export const ADMIN_ROUTES = Object.entries(adminNamedRoutes).reduce(
  (acc, [name, route]) => {
    const { path, meta } = route;
    return {
      ...acc,
      [name]: {
        path: `/admin/${path}`,
        meta,
      },
    };
  },
  {} as Record<AdminRouteNames, { path: string; meta: any }>,
);
