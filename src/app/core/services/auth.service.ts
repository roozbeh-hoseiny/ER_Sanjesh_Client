import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AuthResponse, LoginCredentials, Maybe, User, UserRole } from '../models';
import { CaptchaService } from './captcha.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private captchaService = inject(CaptchaService);

  private readonly currentUserSubject = new BehaviorSubject<Maybe<User>>(null);
  private readonly isLoadingSubject = new BehaviorSubject<boolean>(false);

  readonly currentUser$ = this.currentUserSubject.asObservable();
  readonly isLoading$ = this.isLoadingSubject.asObservable();

  // Signals for reactive state management
  // readonly currentUser = signal<Maybe<User>>(null);
  readonly currentUser = signal<Maybe<User>>({
    firstName: 'عباس',
    lastName: 'حسنی',
    role: UserRole.ADMIN,
    id: '213',
    username: 'abas.hassani',
    email: 'abas.hassani@example.com',
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    permissions: [],
  });
  readonly isLoading = signal<boolean>(false);
  readonly token = signal<Maybe<string>>(null);
  readonly isAuthenticated = computed(() => Boolean(this.token));
  readonly userRole = computed(() => this.currentUser()?.role);

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = localStorage.getItem('auth_token');
    // const userData = localStorage.getItem('user_data');
    const userData = this.currentUser();

    if (token && userData) {
      try {
        // const user = JSON.parse(userData) as User;
        // this.setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.logout();
      }
    }
  }

  login(credentials: LoginCredentials, loginApiUrl: string): Observable<AuthResponse> {
    const { username, password, captcha } = credentials;
    this.isLoading.set(true);
    this.isLoadingSubject.next(true);
    const baseHeaders = this.captchaService.buildCaptchaHeaders({}, captcha);

    console.log('asdasdasdasdzxczxczxczxcxzcxzcxzcxz', {
      loginApiUrl,
      username,
      password,
      baseHeaders,
    });

    return this.http
      .post<AuthResponse>(
        loginApiUrl,
        { username, password },
        {
          headers: baseHeaders,
        },
      )
      .pipe(
        tap((response) => {
          console.log('asdasdasdasasdasds');

          this.handleAuthSuccess(response);
        }),
        catchError((error) => {
          console.error('Login error:', error);
          this.isLoadingSubject.next(false);
          throw error;
        }),
        finalize(() => {
          this.isLoading.set(false);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('refresh_token');

    this.setCurrentUser(null);
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<AuthResponse>('/api/auth/refresh', { refreshToken }).pipe(
      tap((response) => {
        this.handleAuthSuccess(response);
      }),
      catchError((error) => {
        console.error('Token refresh error:', error);
        this.logout();
        return throwError(() => error);
      }),
    );
  }

  /**
   * Get current access token
   */
  getToken(): Maybe<string> {
    return localStorage.getItem('auth_token');
  }

  /**
   * Get current refresh token
   */
  getRefreshToken(): Maybe<string> {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Check if token is expired (optional - requires JWT parsing)
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      // Parse JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true;
    }
  }

  /**
   * Check if refresh token is expired
   */
  isRefreshTokenExpired(): boolean {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return true;

    try {
      // Parse JWT refresh token to check expiration
      const payload = JSON.parse(atob(refreshToken.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error parsing refresh token:', error);
      return true;
    }
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser()?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const currentRole = this.currentUser()?.role;
    return currentRole ? roles.includes(currentRole) : false;
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUser();
    if (!user) return false;

    return user.permissions.some(
      (p) => p.name === permission || `${p.resource}:${p.action}` === permission,
    );
  }

  canAccess(requiredRoles?: UserRole[], requiredPermissions?: string[]): boolean {
    if (!this.isAuthenticated()) return false;

    if (requiredRoles && requiredRoles.length > 0) {
      if (!this.hasAnyRole(requiredRoles)) return false;
    }

    if (requiredPermissions && requiredPermissions.length > 0) {
      return requiredPermissions.every((permission) => this.hasPermission(permission));
    }

    return true;
  }

  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem('auth_token', response.token);
    // localStorage.setItem('refresh_token', response.refreshToken);
    // localStorage.setItem('user_data', JSON.stringify(response.user));

    // this.setCurrentUser(response.user);
    // this.isLoading.set(false);
    this.isLoadingSubject.next(false);

    // Navigate based on user role
    // this.navigateByRole(response.user.role);
  }

  private setCurrentUser(user: Maybe<User>): void {
    this.currentUser.set(user);
    this.currentUserSubject.next(user);
  }

  private navigateByRole(role: UserRole): void {
    const roleRoutes = {
      [UserRole.STUDENT]: '/student',
      [UserRole.GRADER]: '/grader',
      [UserRole.ADMIN]: '/admin',
      [UserRole.PRINCIPAL]: '/principal',
      [UserRole.SUPERADMIN]: '/superadmin',
    };

    this.router.navigate([roleRoutes[role]]);
  }
}
