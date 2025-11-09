import { NamedRoutes } from '@/core';

export type TAdminSchoolsRouteNames = 'schools' | 'school' | 'categories';

export const adminSchoolNamedRoutes: NamedRoutes<TAdminSchoolsRouteNames> = {
  schools: {
    path: 'schools',
    loadComponent: () =>
      import('../../pages/schools/views/admin-schools.component').then(
        (m) => m.AdminSchoolsComponent,
      ),
    meta: {
      title: 'مدارس',
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
      title: 'مدرسه',
      pagePath: (id: string) => `/admin/schools/${id}`,
    },
  },
};
