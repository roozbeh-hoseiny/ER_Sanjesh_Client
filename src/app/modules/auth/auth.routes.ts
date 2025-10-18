import { Routes } from '@angular/router';
import { NamedRoutes } from '@/core';

export type AuthRouteNames = 'auth' | 'login';

export const authNamedRoutes: NamedRoutes<AuthRouteNames> = {
  auth: { path: '', meta: { title: 'احراز هویت' } },
  login: {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
    meta: { title: 'ورود' },
  },
};

export const AUTH_ROUTES: Routes = [
  {
    ...authNamedRoutes.auth,
    children: [authNamedRoutes.login],
  },
];
