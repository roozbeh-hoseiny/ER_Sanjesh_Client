import { Routes } from '@angular/router';
import { AuthGuard, RoleGuard } from '../../core/guards';
// import the named route definitions that contain Angular route objects (with loadComponent)
import { ROLES } from 'src/assets/constants';
import { schoolsNamedRoutes } from './constants';
import { SchoolsLayoutComponent } from './schools-layout.component';

export const SCHOOLS_ROUTES: Routes = [
  {
    path: '',
    component: SchoolsLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [ROLES.SCHOOL] },
    children: Object.values(schoolsNamedRoutes),
  },
];
