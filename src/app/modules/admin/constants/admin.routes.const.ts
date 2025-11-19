import { NamedRoutes } from '@/core';
import {
  adminExamsNamedRoutes,
  adminMDMNamedRoutes,
  adminSchoolNamedRoutes,
  adminTeachersNamedRoutes,
  TAdminExamsRouteNames,
  TAdminMDMRouteNames,
  TAdminSchoolsRouteNames,
  TAdminTeachersRouteNames,
} from './routes';

export type AdminRouteNames =
  | 'root'
  | TAdminSchoolsRouteNames
  | TAdminMDMRouteNames
  | TAdminTeachersRouteNames
  | TAdminExamsRouteNames;

export const adminNamedRoutes: NamedRoutes<AdminRouteNames> = {
  root: {
    path: '',
    redirectTo: adminSchoolNamedRoutes.schools.path,
    pathMatch: 'full',
    meta: {
      title: 'داشبورد',
    },
  },
  ...adminMDMNamedRoutes,
  ...adminSchoolNamedRoutes,
  ...adminTeachersNamedRoutes,
  ...adminExamsNamedRoutes,
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
