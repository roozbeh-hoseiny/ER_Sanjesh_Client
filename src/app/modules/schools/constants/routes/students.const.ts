import { NamedRoutes } from '@/core';

export type TSchoolStudentsRouteNames = 'students';

export const schoolsStudentsNamedRoutes: NamedRoutes<TSchoolStudentsRouteNames> = {
  students: {
    path: 'students',
    loadComponent: () =>
      import('../../pages/students/views/students.component').then(
        (m) => m.SchoolStudentsComponent,
      ),
    meta: {
      title: 'دانش‌آموزان',
      pagePath: () => '/schools/students',
    },
  },
};
