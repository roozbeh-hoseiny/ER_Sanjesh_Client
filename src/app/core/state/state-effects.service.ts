import { Injectable, inject } from '@angular/core';
import { combineLatest, map, shareReplay, startWith } from 'rxjs';
import { LOCAL_STORAGE_KEYS } from 'src/assets/constants';
import { AuthStore } from '../../modules/auth/state/auth.store';
import { GlobalStore } from './global/global.store';

/**
 * State effects service for handling cross-store interactions
 */
@Injectable({
  providedIn: 'root',
})
export class StateEffects {
  private readonly authStore = inject(AuthStore);
  private readonly globalStore = inject(GlobalStore);

  constructor() {
    this.initializeEffects();
  }

  /**
   * Initialize all effects
   */
  private initializeEffects(): void {
    this.setupAuthEffects();
    this.setupGlobalEffects();
  }

  /**
   * Setup authentication-related effects
   */
  private setupAuthEffects(): void {
    // Update global notifications when auth state changes
    this.authStore.state$.subscribe((authState) => {
      // if (authState.isAuthenticated && authState.user) {
      //   this.globalStore.addNotification({
      //     type: 'success',
      //     title: 'خوش آمدید',
      //     message: `${authState.user.firstName} ${authState.user.lastName} عزیز، خوش آمدید`,
      //   });
      // }
    });

    // Handle session expiry warnings
    this.authStore.state$.subscribe((authState) => {
      if (authState.sessionExpiry) {
        const timeUntilExpiry = authState.sessionExpiry - Date.now();
        const minutesUntilExpiry = Math.floor(timeUntilExpiry / 60000);

        // Show warning when 5 minutes remain
        if (minutesUntilExpiry === 5) {
          this.globalStore.addNotification({
            type: 'warning',
            title: 'هشدار انقضای جلسه',
            message: 'جلسه شما در 5 دقیقه منقضی می‌شود',
            actions: [
              {
                label: 'تمدید جلسه',
                action: () => this.authStore.refreshAuthToken().subscribe(),
                type: 'primary',
              },
            ],
          });
        }
      }
    });
  }

  /**
   * Setup global effects
   */
  private setupGlobalEffects(): void {
    // Auto-save preferences when they change
    this.globalStore.state$.subscribe((globalState) => {
      localStorage.setItem('user_preferences', JSON.stringify(globalState.preferences));
    });

    // Handle theme changes
    this.globalStore.state$.subscribe((globalState) => {
      document.documentElement.setAttribute('data-theme', globalState.theme);
    });

    // Handle language changes
    this.globalStore.state$.subscribe((globalState) => {
      document.documentElement.setAttribute('lang', globalState.language);
      document.documentElement.setAttribute('dir', globalState.language === 'fa' ? 'rtl' : 'ltr');
    });
  }
}

/**
 * State selectors for complex cross-store queries
 */
@Injectable({
  providedIn: 'root',
})
export class StateSelectors {
  private readonly authStore = inject(AuthStore);
  private readonly globalStore = inject(GlobalStore);

  /**
   * Combined application state for UI components
   */
  readonly appState$ = combineLatest([this.authStore.state$, this.globalStore.state$]).pipe(
    map(([authState, globalState]) => ({
      isAuthenticated: authState.isAuthenticated,
      user: authState.user,
      userRole: authState.user?.role,
      loading: authState.loading || globalState.loading,
      sidebarCollapsed: globalState.sidebarCollapsed,
      theme: globalState.theme,
      language: globalState.language,
      notifications: globalState.notifications,
      unreadCount: globalState.notifications.filter((n) => !n.read).length,
      breadcrumbs: globalState.breadcrumbs,
      isOnline: globalState.isOnline,
    })),
    shareReplay(1),
  );

  /**
   * User permissions combined with role-based access
   */
  readonly userAccess$ = this.authStore.state$.pipe(
    map((authState) => ({
      isAuthenticated: authState.isAuthenticated,
      role: authState.user?.role,
      permissions: authState.permissions,
      canAccessAdmin: authState.user?.role === 'ADMIN' || authState.user?.role === 'SUPERADMIN',
      canAccessStudent: authState.user?.role === 'STUDENTS',
      canAccessGrader: authState.user?.role === 'GRADER',
      canAccessSchools: authState.user?.role === 'SCHOOL',
      canAccessSuperAdmin: authState.user?.role === 'SUPERADMIN',
    })),
    shareReplay(1),
  );

  /**
   * Navigation state for header/sidebar components
   */
  readonly navigationState$ = combineLatest([this.authStore.state$, this.globalStore.state$]).pipe(
    map(([authState, globalState]) => ({
      user: authState.user,
      sidebarCollapsed: globalState.sidebarCollapsed,
      breadcrumbs: globalState.breadcrumbs,
      // userInitials: authState.user
      //   ? `${authState.user.firstName[0]}${authState.user.lastName[0]}`
      //   : '',
      // userFullName: authState.user ? `${authState.user.firstName} ${authState.user.lastName}` : '',
    })),
    shareReplay(1),
  );

  /**
   * Notification state for notification components
   */
  readonly notificationState$ = this.globalStore.state$.pipe(
    map((globalState) => ({
      notifications: globalState.notifications,
      unreadCount: globalState.notifications.filter((n) => !n.read).length,
      hasUnread: globalState.notifications.some((n) => !n.read),
      recentNotifications: globalState.notifications
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5),
    })),
    shareReplay(1),
  );

  /**
   * Loading state across all stores
   */
  readonly loadingState$ = combineLatest([this.authStore.state$, this.globalStore.state$]).pipe(
    map(([authState, globalState]) => ({
      isLoading: authState.loading || globalState.loading,
      authLoading: authState.loading,
      globalLoading: globalState.loading,
    })),
    startWith({ isLoading: false, authLoading: false, globalLoading: false }),
    shareReplay(1),
  );
}

/**
 * State utilities for common operations
 */
@Injectable({
  providedIn: 'root',
})
export class StateUtils {
  private readonly authStore = inject(AuthStore);
  private readonly globalStore = inject(GlobalStore);

  /**
   * Check if user can access route
   */
  canAccessRoute(requiredRoles?: string[], requiredPermissions?: string[]): boolean {
    const authState = this.authStore.getCurrentState();

    if (!authState.isAuthenticated) {
      return false;
    }

    if (requiredRoles && requiredRoles.length > 0) {
      const userRole = authState.user?.role;
      if (!userRole || !requiredRoles.includes(userRole)) {
        return false;
      }
    }

    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasAllPermissions = requiredPermissions.every((permission) =>
        authState.permissions.includes(permission),
      );
      if (!hasAllPermissions) {
        return false;
      }
    }

    return true;
  }

  /**
   * Show success message
   */
  showSuccess(title: string, message: string): void {
    this.globalStore.addNotification({
      type: 'success',
      title,
      message,
    });
  }

  /**
   * Show error message
   */
  showError(title: string, message: string): void {
    this.globalStore.addNotification({
      type: 'error',
      title,
      message,
    });
  }

  /**
   * Show warning message
   */
  showWarning(title: string, message: string): void {
    this.globalStore.addNotification({
      type: 'warning',
      title,
      message,
    });
  }

  /**
   * Show info message
   */
  showInfo(title: string, message: string): void {
    this.globalStore.addNotification({
      type: 'info',
      title,
      message,
    });
  }

  /**
   * Update page breadcrumbs
   */
  setBreadcrumbs(breadcrumbs: Array<{ label: string; url?: string; icon?: string }>): void {
    this.globalStore.setBreadcrumbs(breadcrumbs);
  }

  /**
   * Get user display name
   */
  getUserDisplayName(): string {
    const user = this.authStore.getCurrentState().user;
    return '';
    // return user ? `${user.firstName} ${user.lastName}` : '';
  }

  /**
   * Get user initials
   */
  getUserInitials(): string {
    const user = this.authStore.getCurrentState().user;
    return '';
    // return user ? `${user.firstName[0]}${user.lastName[0]}` : '';
  }

  /**
   * Check if user is online
   */
  isOnline(): boolean {
    return this.globalStore.getCurrentState().isOnline;
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): 'light' | 'dark' {
    return this.globalStore.getCurrentState().theme;
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): 'fa' | 'en' {
    return this.globalStore.getCurrentState().language;
  }

  /**
   * Clear all application state (useful for logout)
   */
  clearAllState(): void {
    this.authStore.reset();
    this.globalStore.reset();

    // Clear localStorage
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.LAST_LOGIN_TIME);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.LOGIN_ATTEMPTS);
  }
}
