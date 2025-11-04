import { adminNamedRoutes } from '@/modules/admin/constants';
import { schoolsNamedRoutes } from '@/modules/schools/constants';
import { teachersNamedRoutes } from '@/modules/teachers/constants';
import { Routes } from '@angular/router';

export const namedRoutes = {
  admin: adminNamedRoutes,
  schools: schoolsNamedRoutes,
  teachers: teachersNamedRoutes,
};

export const routes: Routes = [
  // Role-based module routes

  {
    path: '',
    loadComponent: () => import('@/root.component').then((m) => m.RootComponent),
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('@/modules/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () => import('modules/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'schools',
    loadChildren: () => import('@/modules/schools/schools.routes').then((m) => m.SCHOOLS_ROUTES),
  },
  {
    path: 'teachers',
    loadChildren: () => import('@/modules/teachers/teachers.routes').then((m) => m.TEACHERS_ROUTES),
  },

  // Unauthorized page (legacy - redirects to 403)
  {
    path: 'unauthorized',
    redirectTo: '/403',
  },

  // Wildcard route - must be last (404 Not Found)
  // Displays 404 component at the current URL without redirecting
  {
    path: '**',
    loadComponent: () =>
      import('./app/modules/errors/notfound/notfound.component').then((m) => m.Notfound),
    data: {
      breadcrumb: 'صفحه یافت نشد',
      breadcrumbIcon: 'error_outline',
    },
  },
];
