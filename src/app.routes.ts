import { adminNamedRoutes } from '@/modules/admin/constants';
import { Routes } from '@angular/router';
import { graderNamedRoutes } from 'modules/grader/grader.routes';
import { principalNamedRoutes } from 'modules/principal/principal.routes';
import { studentNamedRoutes } from 'modules/student/student.routes';
import { superadminNamedRoutes } from 'modules/superadmin/superadmin.routes';

export const namedRoutes = {
  student: studentNamedRoutes,
  grader: graderNamedRoutes,
  admin: adminNamedRoutes,
  principal: principalNamedRoutes,
  superadmin: superadminNamedRoutes,
};

export const routes: Routes = [
  // Role-based module routes
  {
    path: 'student',
    loadChildren: () => import('modules/student/student.routes').then((m) => m.STUDENT_ROUTES),
  },
  {
    path: 'grader',
    loadChildren: () => import('modules/grader/grader.routes').then((m) => m.GRADER_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () => import('modules/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'principal',
    loadChildren: () =>
      import('modules/principal/principal.routes').then((m) => m.PRINCIPAL_ROUTES),
  },
  {
    path: 'superadmin',
    loadChildren: () =>
      import('modules/superadmin/superadmin.routes').then((m) => m.SUPERADMIN_ROUTES),
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
