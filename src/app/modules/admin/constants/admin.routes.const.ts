import { NamedRoutes } from '@/core';
import { adminSchoolNamedRoutes, type TAdminSchoolsRouteNames } from './routes/schools.const';
import { adminMDMNamedRoutes, TAdminMDMRouteNames } from './routes';

export type AdminRouteNames =
  | 'root'
  | 'login'
  | 'users'
  | TAdminSchoolsRouteNames
  | TAdminMDMRouteNames;

export const adminNamedRoutes: NamedRoutes<AdminRouteNames> = {
  login: {
    path: '',
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
