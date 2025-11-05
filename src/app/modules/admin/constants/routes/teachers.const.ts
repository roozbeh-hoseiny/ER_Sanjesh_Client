import { NamedRoutes } from '@/core';

export type TAdminTeachersRouteNames = 'teachers' | 'teacher';

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
  teacher: {
    path: 'teachers/:teacherId',
    loadComponent: () =>
      import('../../pages/teachers/views/admin-teacher.component').then(
        (m) => m.AdminTeacherComponent,
      ),
    meta: {
      title: 'دبیر',
      pagePath: (id: string) => `/admin/teachers/${id}`,
    },
  },
};
