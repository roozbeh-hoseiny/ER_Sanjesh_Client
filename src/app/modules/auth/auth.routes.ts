import { Routes } from '@angular/router';
import { NamedRoutes } from '../../core';

export type AuthRouteNames = 'auth' | 'login';

export const authNamedRoutes: NamedRoutes<AuthRouteNames> = {
  auth: { path: '' },
  login: {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
};

export const AUTH_ROUTES: Routes = [
  {
    ...authNamedRoutes.auth,
    children: [authNamedRoutes.login],
  },
];
