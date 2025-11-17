import { NamedRoutes } from '@/core';

export type TSchoolTeachersRouteNames = 'teachers';

export const schoolsTeachersNamedRoutes: NamedRoutes<TSchoolTeachersRouteNames> = {
  teachers: {
    path: 'teachers',
    loadComponent: () =>
      import('../../pages/teachers/views/school-teachers.component').then(
        (m) => m.SchoolTeachersComponent,
      ),
    meta: {
      title: 'دبیران',
      pagePath: () => '/schools/teachers',
    },
  },
};
