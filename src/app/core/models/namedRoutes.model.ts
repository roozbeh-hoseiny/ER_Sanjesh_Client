import { Route } from '@angular/router';

/**
 * Generic type for creating strongly typed named routes
 * @template T - Union of string literals representing route names
 * @returns Record<T, Route> - Object with route names as keys and Route objects as values
 *
 * @example
 * ```typescript
 * type AuthRouteNames = 'auth' | 'login';
 * const authRoutes: NamedRoutes<AuthRouteNames> = {
 *   auth: { path: 'auth', component: AuthComponent },
 *   login: { path: 'login', component: LoginComponent }
 * };
 * ```
 */
export type NamedRoutes<T extends string> = Record<T, Route>;
