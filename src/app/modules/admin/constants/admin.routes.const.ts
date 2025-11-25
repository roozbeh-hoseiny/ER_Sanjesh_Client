import { NamedRoutes } from '@/core';
import {
  adminExamsNamedRoutes,
  adminMDMNamedRoutes,
  adminSchoolNamedRoutes,
  adminTeachersNamedRoutes,
  TAdminAgentsRouteNames,
  TAdminExamsRouteNames,
  TAdminMDMRouteNames,
  TAdminSchoolsRouteNames,
  TAdminTeachersRouteNames,
} from './routes';
import { adminAgentsNamedRoutes } from './routes/agents.const';

export type AdminRouteNames =
  | 'root'
  | TAdminSchoolsRouteNames
  | TAdminMDMRouteNames
  | TAdminTeachersRouteNames
  | TAdminExamsRouteNames
  | TAdminAgentsRouteNames;

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
  ...adminAgentsNamedRoutes,
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
