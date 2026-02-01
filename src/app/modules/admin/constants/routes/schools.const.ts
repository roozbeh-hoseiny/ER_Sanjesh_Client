import { NamedRoutes } from '@/core';

export type TAdminSchoolsRouteNames =
  | 'schools'
  | 'school'
  | 'categories'
  | 'schoolTeachers'
  | 'schoolStudents';

export const adminSchoolNamedRoutes: NamedRoutes<TAdminSchoolsRouteNames> = {
  schools: {
    path: 'schools',
    loadComponent: () =>
      import('../../pages/schools/views/admin-schools.component').then(
        (m) => m.AdminSchoolsComponent,
      ),
    meta: {
      title: 'مراکز آموزشی',
    },
  },
  categories: {
    path: 'schools/categories',
    loadComponent: () =>
      import('../../pages/schools/views/admin-school-categories.component').then(
        (m) => m.AdminSchoolCategoriesComponent,
      ),
    meta: {
      title: 'دسته‌بندی‌ها',
      pagePath: (id: string) => `/admin/categories`,
    },
  },
  school: {
    path: 'schools/:schoolId',
    loadComponent: () =>
      import('../../pages/schools/views/admin-school.component').then(
        (m) => m.AdminSchoolComponent,
      ),
    meta: {
      title: 'مرکز آموزشی',
      pagePath: (schoolId: string) => `/admin/schools/${schoolId}`,
    },
  },
  schoolTeachers: {
    path: 'schools/:schoolId/teachers',
    loadComponent: () =>
      import('../../pages/schools/views/admin-school-teachers.component').then(
        (m) => m.AdminSchoolTeachersComponent,
      ),
    meta: {
      title: 'دبیران مرکز آموزشی',
      pagePath: (schoolId: string) => `/admin/schools/${schoolId}/teachers`,
    },
  },
  schoolStudents: {
    path: 'schools/:schoolId/students',
    loadComponent: () =>
      import('../../pages/schools/views/students/list.component').then(
        (m) => m.AdminSchoolStudentsComponent,
      ),
    meta: {
      title: 'دانش‌آموزان مرکز آموزشی',
      pagePath: (schoolId: string) => `/admin/schools/${schoolId}/students`,
    },
  },
};
