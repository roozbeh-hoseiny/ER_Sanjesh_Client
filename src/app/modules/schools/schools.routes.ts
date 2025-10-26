import { Routes } from '@angular/router';
import { AuthGuard, RoleGuard } from '../../core/guards';
import { UserRole } from '../../core/models';
// import the named route definitions that contain Angular route objects (with loadComponent)
import { schoolsNamedRoutes } from './constants';
import { SchoolsLayoutComponent } from './schools-layout.component';

export const SCHOOLS_ROUTES: Routes = [
  {
    path: '',
    component: SchoolsLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SCHOOLS] },
    children: Object.values(schoolsNamedRoutes),
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/schools-login.component').then((m) => m.SchoolsLoginComponent),
    // meta: {
    //   title: 'لاگین',
    // },
  },
];
