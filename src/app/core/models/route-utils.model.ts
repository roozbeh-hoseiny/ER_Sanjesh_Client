import { Routes } from '@angular/router';
import { NamedRoutes } from './namedRoutes.model';

/**
 * Utility function to convert NamedRoutes to Routes array
 * @param namedRoutes - Object containing named routes
 * @returns Array of Route objects suitable for Angular router
 *
 * @example
 * ```typescript
 * const routes = routesToArray(studentNamedRoutes);
 * // Returns: [Route, Route, Route, ...]
 * ```
 */
export function routesToArray<T extends string>(namedRoutes: NamedRoutes<T>): Routes {
  return Object.values(namedRoutes);
}

/**
 * Utility function to get route path by name with type safety
 * @param namedRoutes - Object containing named routes
 * @param routeName - Name of the route to get path for
 * @returns The path string for the specified route
 *
 * @example
 * ```typescript
 * const dashboardPath = getRoutePath(studentNamedRoutes, 'dashboard');
 * // Returns: 'dashboard'
 * ```
 */
export function getRoutePath<T extends string>(namedRoutes: NamedRoutes<T>, routeName: T): string {
  return namedRoutes[routeName].path || '';
}

/**
 * Utility function to build full route path with prefix
 * @param prefix - Route prefix (e.g., '/student')
 * @param namedRoutes - Object containing named routes
 * @param routeName - Name of the route to build path for
 * @returns Full route path
 *
 * @example
 * ```typescript
 * const fullPath = buildRoutePath('/student', studentNamedRoutes, 'dashboard');
 * // Returns: '/student/dashboard'
 * ```
 */
export function buildRoutePath<T extends string>(
  prefix: string,
  namedRoutes: NamedRoutes<T>,
  routeName: T
): string {
  const basePath = prefix.endsWith('/') ? prefix.slice(0, -1) : prefix;
  const routePath = getRoutePath(namedRoutes, routeName);
  return `${basePath}/${routePath}`;
}
