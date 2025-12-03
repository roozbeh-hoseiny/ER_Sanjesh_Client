import { NamedRoutes } from '@/core';

export type TSchoolStudentsRouteNames = 'students' | 'bulkAdd';

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
  bulkAdd: {
    path: 'students/bulk-add',
    loadComponent: () =>
      import('../../pages/students/views/students-bulk-add.component').then(
        (m) => m.SchoolStudentsBulkAddComponent,
      ),
    meta: {
      title: 'دانش‌آموزان',
      pagePath: () => '/schools/students/bulk-add',
    },
  },
};
