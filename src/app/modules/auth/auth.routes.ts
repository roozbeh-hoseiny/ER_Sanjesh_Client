import { NamedRoutes } from '@/core';
import { Routes } from '@angular/router';

export type AuthRouteNames = 'auth';

export const authNamedRoutes: NamedRoutes<AuthRouteNames> = {
  auth: {
    path: '',
    loadComponent: () => import('./pages/auth.component').then((m) => m.AuthComponent),
    meta: { title: 'احراز هویت' },
  },
};

export const AUTH_ROUTES: Routes = [
  {
    ...authNamedRoutes.auth,
    // children: [authNamedRoutes.login],
  },
];
