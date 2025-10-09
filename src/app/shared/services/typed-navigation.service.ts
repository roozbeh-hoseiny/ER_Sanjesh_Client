import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { buildRoutePath } from '../../core/models';

// Import the strongly typed route definitions
import { AdminRouteNames, adminNamedRoutes } from '../../modules/admin/admin.routes';
import { AuthRouteNames, authNamedRoutes } from '../../modules/auth/auth.routes';
import { StudentRouteNames, studentNamedRoutes } from '../../modules/student/student.routes';

/**
 * Strongly Typed Navigation Service
 *
 * This service demonstrates how to use the NamedRoutes system for type-safe navigation.
 * It provides methods to navigate to different module routes with compile-time type checking.
 */
@Injectable({
  providedIn: 'root',
})
export class TypedNavigationService {
  private readonly router = inject(Router);

  /**
   * Navigate to an authentication route with type safety
   * @param routeName - The name of the auth route to navigate to
   *
   * @example
   * ```typescript
   * // ✅ Valid - TypeScript provides autocomplete
   * this.typedNavigation.navigateToAuth('login');
   *
   * // ❌ Invalid - TypeScript will show error
   * this.typedNavigation.navigateToAuth('invalid');
   * ```
   */
  navigateToAuth(routeName: AuthRouteNames): Promise<boolean> {
    const path = buildRoutePath('/auth', authNamedRoutes, routeName);
    return this.router.navigate([path]);
  }

  /**
   * Navigate to a student route with type safety
   * @param routeName - The name of the student route to navigate to
   *
   * @example
   * ```typescript
   * // ✅ Valid - TypeScript knows all available routes
   * this.typedNavigation.navigateToStudent('dashboard');
   * this.typedNavigation.navigateToStudent('exams');
   * this.typedNavigation.navigateToStudent('results');
   * this.typedNavigation.navigateToStudent('profile');
   *
   * // ❌ Invalid - Compile-time error prevention
   * this.typedNavigation.navigateToStudent('nonexistent');
   * ```
   */
  navigateToStudent(routeName: StudentRouteNames): Promise<boolean> {
    const path = buildRoutePath('/student', studentNamedRoutes, routeName);
    return this.router.navigate([path]);
  }

  /**
   * Navigate to an admin route with type safety
   * @param routeName - The name of the admin route to navigate to
   */
  navigateToAdmin(routeName: AdminRouteNames): Promise<boolean> {
    const path = buildRoutePath('/admin', adminNamedRoutes, routeName);
    return this.router.navigate([path]);
  }

  /**
   * Get the full path for a route without navigating
   * Useful for link generation, conditional navigation, etc.
   */
  getAuthPath(routeName: AuthRouteNames): string {
    return buildRoutePath('/auth', authNamedRoutes, routeName);
  }

  getStudentPath(routeName: StudentRouteNames): string {
    return buildRoutePath('/student', studentNamedRoutes, routeName);
  }

  getAdminPath(routeName: AdminRouteNames): string {
    return buildRoutePath('/admin', adminNamedRoutes, routeName);
  }

  /**
   * Navigate with additional query parameters
   * @param routeName - The route name
   * @param queryParams - Query parameters to add
   *
   * @example
   * ```typescript
   * this.typedNavigation.navigateToStudentWithParams('exams', { filter: 'pending' });
   * // Navigates to: /student/exams?filter=pending
   * ```
   */
  navigateToStudentWithParams(
    routeName: StudentRouteNames,
    queryParams?: Record<string, any>
  ): Promise<boolean> {
    const path = buildRoutePath('/student', studentNamedRoutes, routeName);
    return this.router.navigate([path], { queryParams });
  }

  /**
   * Navigate with state data
   * @param routeName - The route name
   * @param state - State data to pass to the route
   */
  navigateToStudentWithState(routeName: StudentRouteNames, state?: any): Promise<boolean> {
    const path = buildRoutePath('/student', studentNamedRoutes, routeName);
    return this.router.navigate([path], { state });
  }
}

/**
 * Usage Examples in Components:
 *
 * @Component({...})
 * export class ExampleComponent {
 *   private readonly typedNavigation = inject(TypedNavigationService);
 *
 *   onLogin() {
 *     // Type-safe navigation with autocomplete
 *     this.typedNavigation.navigateToAuth('login');
 *   }
 *
 *   onDashboard() {
 *     // TypeScript validates route names
 *     this.typedNavigation.navigateToStudent('dashboard');
 *   }
 *
 *   onExamsWithFilter() {
 *     // Navigate with query parameters
 *     this.typedNavigation.navigateToStudentWithParams('exams', {
 *       filter: 'active',
 *       page: 1
 *     });
 *   }
 *
 *   generateLink() {
 *     // Get path without navigating
 *     const profileLink = this.typedNavigation.getStudentPath('profile');
 *     return profileLink; // '/student/profile'
 *   }
 * }
 */
