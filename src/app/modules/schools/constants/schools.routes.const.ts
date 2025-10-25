import { NamedRoutes } from '@/core';

export type TSchoolsRouteNames = 'root';

export const schoolsNamedRoutes: NamedRoutes<TSchoolsRouteNames> = {
  root: {
    path: '',
    pathMatch: 'full',
    meta: {
      title: 'داشبورد',
    },
  },
};

export const ADMIN_ROUTES = Object.entries(schoolsNamedRoutes).reduce(
  (acc, [name, route]) => {
    const { path, meta } = route;
    return {
      ...acc,
      [name]: {
        path: `/schools/${path}`,
        meta,
      },
    };
  },
  {} as Record<TSchoolsRouteNames, { path: string; meta: any }>,
);
