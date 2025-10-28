import { Routes } from '@angular/router';
import { AuthGuard, RoleGuard } from '../../core/guards';
import { UserRole } from '../../core/models';
// import the named route definitions that contain Angular route objects (with loadComponent)
import { teachersNamedRoutes } from './constants';
import { TeachersLayoutComponent } from './teachers-layout.component';

export const TEACHERS_ROUTES: Routes = [
  {
    path: '',
    component: TeachersLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.TEACHERS] },
    children: Object.values(teachersNamedRoutes),
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/teachers-login.component').then((m) => m.TeachersLoginComponent),
    // meta: {
    //   title: 'لاگین',
    // },
  },
];
