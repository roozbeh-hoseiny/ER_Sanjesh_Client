import { NamedRoutes } from '@/core';

export type TTeachersRouteNames = 'root';

export const teachersNamedRoutes: NamedRoutes<TTeachersRouteNames> = {
  root: {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('../pages/dashboard/dashboard.component').then((m) => m.TeachersDashboardComponent),
    meta: {
      title: 'داشبورد',
    },
  },
};

export const TEACHERS_ROUTES = Object.entries(teachersNamedRoutes).reduce(
  (acc, [name, route]) => {
    const { path, meta } = route;
    return {
      ...acc,
      [name]: {
        path: `/teachers/${path}`,
        meta,
      },
    };
  },
  {} as Record<TTeachersRouteNames, { path: string; meta: any }>,
);
