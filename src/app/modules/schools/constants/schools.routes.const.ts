import { NamedRoutes } from '@/core';
import { schoolsTeachersNamedRoutes, TSchoolTeachersRouteNames } from './routes';

export type TSchoolsRouteNames = 'root' | TSchoolTeachersRouteNames;

export const schoolsNamedRoutes: NamedRoutes<TSchoolsRouteNames> = {
  root: {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('../pages/dashboard/schools-dashboard.component').then(
        (m) => m.SchoolsDashboardComponent,
      ),
    meta: {
      title: 'داشبورد',
      pagePath: () => '/schools',
    },
  },
  ...schoolsTeachersNamedRoutes,
};

export const SCHOOLS_ROUTES = Object.entries(schoolsNamedRoutes).reduce(
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
