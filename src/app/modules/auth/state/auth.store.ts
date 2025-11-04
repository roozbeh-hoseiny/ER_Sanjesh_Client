import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { LOCAL_STORAGE_KEYS, ROLES } from 'src/assets/constants';
import { IAuthResponse, LoginCredentials, Maybe, TRoles, User } from '../../../core/models';
import { BaseState, BaseStore } from '../../../core/state/base-store';

/**
 * Authentication state
 */
export interface AuthState extends BaseState {
  user: Maybe<User>;
  token: Maybe<string>;
  refreshToken: Maybe<string>;
  isAuthenticated: boolean;
  permissions: string[];
  loginAttempts: number;
  lastLoginTime: Maybe<number>;
  sessionExpiry: Maybe<number>;
}

/**
 * Login state for UI feedback
 */
export interface LoginState {
  isLoggingIn: boolean;
  isRefreshing: boolean;
  loginError: Maybe<string>;
}

/**
 * Authentication state store
 */
@Injectable({
  providedIn: 'root',
})
export class AuthStore extends BaseStore<AuthState> {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Login-specific state
  private readonly _loginState = {
    isLoggingIn: false,
    isRefreshing: false,
    loginError: null as Maybe<string>,
  };

  constructor() {
    super({
      loading: false,
      error: null,
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      permissions: [],
      loginAttempts: 0,
      lastLoginTime: null,
      sessionExpiry: null,
    });

    this.initializeAuth();
  }

  // Computed selectors
  readonly user = computed(() => this._state().user);
  readonly token = computed(() => this._state().token);
  readonly refreshToken = computed(() => this._state().refreshToken);
  readonly isAuthenticated = computed(() => this._state().isAuthenticated);
  readonly userRole = computed(() => this._state().user?.role);
  readonly permissions = computed(() => this._state().permissions);
  readonly loginAttempts = computed(() => this._state().loginAttempts);
  readonly lastLoginTime = computed(() => this._state().lastLoginTime);
  readonly sessionExpiry = computed(() => this._state().sessionExpiry);

  // Login state selectors
  readonly isLoggingIn = computed(() => this._loginState.isLoggingIn);
  readonly isRefreshing = computed(() => this._loginState.isRefreshing);
  readonly loginError = computed(() => this._loginState.loginError);

  /**
   * Initialize authentication from stored data
   */
  private initializeAuth(): void {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
    const userData = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);
    const loginAttempts = parseInt(localStorage.getItem(LOCAL_STORAGE_KEYS.LOGIN_ATTEMPTS) || '0');
    const lastLoginTime = parseInt(localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_LOGIN_TIME) || '0');

    if (token && refreshToken && userData) {
      try {
        const user = JSON.parse(userData) as User;
        const sessionExpiry = this.getTokenExpiry(token);

        this.patchState({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          permissions: [],
          // permissions: user.permissions?.map((p) => `${p.resource}:${p.action}`) || [],
          loginAttempts,
          lastLoginTime: lastLoginTime || null,
          sessionExpiry,
        });

        // Check if token is expired
        if (this.isTokenExpired()) {
          this.refreshAuthToken().subscribe();
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.logout();
      }
    }
  }

  /**
   * Login with credentials
   */
  login(credentials: LoginCredentials) {
    this._loginState.isLoggingIn = true;
    this._loginState.loginError = null;
    this.setLoading(true);

    return this.http.post<IAuthResponse>('/api/auth/login', credentials).pipe(
      tap((response) => {
        this.handleAuthSuccess(response);
        this._loginState.isLoggingIn = false;
      }),
      catchError((error) => {
        this.handleAuthError(error);
        return of(null);
      }),
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    // Clear stored data
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.LAST_LOGIN_TIME);

    // Reset state
    this.patchState({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      permissions: [],
      lastLoginTime: null,
      sessionExpiry: null,
      loading: false,
      error: null,
    });

    // Reset login state
    this._loginState.isLoggingIn = false;
    this._loginState.isRefreshing = false;
    this._loginState.loginError = null;

    // Navigate to login
    this.router.navigate(['/auth']);
  }

  /**
   * Refresh authentication token
   */
  refreshAuthToken() {
    const refreshToken = this._state().refreshToken;
    if (!refreshToken) {
      this.logout();
      return of(null);
    }

    this._loginState.isRefreshing = true;
    this.setLoading(true);

    return this.http.post<IAuthResponse>('/api/auth/refresh', { refreshToken }).pipe(
      tap((response) => {
        this.handleAuthSuccess(response);
        this._loginState.isRefreshing = false;
      }),
      catchError((error) => {
        console.error('Token refresh failed:', error);
        this.logout();
        return of(null);
      }),
    );
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: TRoles): boolean {
    return this._state().user?.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: TRoles[]): boolean {
    const userRole = this._state().user?.role;
    return userRole ? roles.includes(userRole) : false;
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    const permissions = this._state().permissions;
    return permissions.includes(permission);
  }

  /**
   * Check if user has all specified permissions
   */
  hasAllPermissions(permissions: string[]): boolean {
    const userPermissions = this._state().permissions;
    return permissions.every((permission) => userPermissions.includes(permission));
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(permissions: string[]): boolean {
    const userPermissions = this._state().permissions;
    return permissions.some((permission) => userPermissions.includes(permission));
  }

  /**
   * Check if user can access resource
   */
  canAccess(requiredRoles?: TRoles[], requiredPermissions?: string[]): boolean {
    if (!this._state().isAuthenticated) return false;

    if (requiredRoles && !this.hasAnyRole(requiredRoles)) {
      return false;
    }

    if (requiredPermissions && !this.hasAllPermissions(requiredPermissions)) {
      return false;
    }

    return true;
  }

  /**
   * Get current access token
   */
  getToken(): string | null {
    return this._state().token;
  }

  /**
   * Get current refresh token
   */
  getRefreshToken(): string | null {
    return this._state().refreshToken;
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const sessionExpiry = this._state().sessionExpiry;
    if (!sessionExpiry) return true;

    return Date.now() > sessionExpiry;
  }

  /**
   * Get time until token expires (in minutes)
   */
  getTimeUntilExpiry(): number {
    const sessionExpiry = this._state().sessionExpiry;
    if (!sessionExpiry) return 0;

    return Math.max(0, Math.floor((sessionExpiry - Date.now()) / 60000));
  }

  /**
   * Update user profile
   */
  updateUserProfile(updates: Partial<User>): void {
    const currentUser = this._state().user;
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updates };

    this.patchState({ user: updatedUser });
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(response: IAuthResponse): void {
    const sessionExpiry = this.getTokenExpiry(response.token);
    const currentTime = Date.now();

    // Store in localStorage
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, response.token);
    localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
    // localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
    localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_LOGIN_TIME, currentTime.toString());

    // Update state
    this.patchState({
      user: { fullName: response.fullName, role: response.role as TRoles },
      token: response.token,
      refreshToken: response.refreshToken,
      isAuthenticated: true,
      // permissions: response.user.permissions?.map((p) => `${p.resource}:${p.action}`) || [],
      lastLoginTime: currentTime,
      sessionExpiry,
      loading: false,
      error: null,
    });

    // Reset login attempts on successful login
    localStorage.removeItem(LOCAL_STORAGE_KEYS.LOGIN_ATTEMPTS);

    // Navigate based on user role
    // this.navigateByRole(response.user.role);
  }

  /**
   * Handle authentication error
   */
  private handleAuthError(error: any): void {
    console.error('Authentication error:', error);

    // Increment login attempts
    const attempts = this._state().loginAttempts + 1;
    this.patchState({ loginAttempts: attempts });
    localStorage.setItem(LOCAL_STORAGE_KEYS.LOGIN_ATTEMPTS, attempts.toString());

    // Set login error
    this._loginState.isLoggingIn = false;
    this._loginState.loginError = error.error?.message || 'خطا در ورود به سیستم';

    if (this._loginState.loginError) {
      this.setError(this._loginState.loginError);
    }
  }

  /**
   * Navigate user based on their role
   */
  private navigateByRole(role: TRoles): void {
    const roleRoutes = {
      [ROLES.ADMIN]: '/admin',
      [ROLES.SCHOOL]: '/schools',
      [ROLES.TEACHERS]: '/teachers',
      [ROLES.STUDENTS]: '/students',
      [ROLES.GRADER]: '/grader',
      [ROLES.SUPERADMIN]: '/superadmin',
    };

    this.router.navigate([roleRoutes[role]]);
  }

  /**
   * Extract token expiry from JWT
   */
  private getTokenExpiry(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000; // Convert to milliseconds
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }

  /**
   * Reset state to initial values
   */
  reset(): void {
    this.setState({
      loading: false,
      error: null,
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      permissions: [],
      loginAttempts: 0,
      lastLoginTime: null,
      sessionExpiry: null,
    });

    this._loginState.isLoggingIn = false;
    this._loginState.isRefreshing = false;
    this._loginState.loginError = null;
  }
}
