import { NamedRoutes } from '@/core';

export type TAdminExamsRouteNames = 'exams' | 'exam';

export const adminExamsNamedRoutes: NamedRoutes<TAdminExamsRouteNames> = {
  exams: {
    path: 'exams',
    loadComponent: () =>
      import('../../pages/exams/views/exams.component').then((m) => m.AdminExamsComponent),
    meta: {
      title: 'امتحانات',
    },
  },
  exam: {
    path: 'exams/:examId',
    loadComponent: () =>
      import('../../pages/exams/views/exams.component').then((m) => m.AdminExamsComponent),
    meta: {
      title: 'امتحانات',
    },
  },
};
