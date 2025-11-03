import { NamedRoutes } from '@/core';

export type TAdminTeachersRouteNames = 'teachers';

export const adminTeachersNamedRoutes: NamedRoutes<TAdminTeachersRouteNames> = {
  teachers: {
    path: 'teachers',
    loadComponent: () =>
      import('../../pages/teachers/views/admin-teachers.component').then(
        (m) => m.AdminTeachersComponent,
      ),
    meta: {
      title: 'دبیران',
    },
  },
};
