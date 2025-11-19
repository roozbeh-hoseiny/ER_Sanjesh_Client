import { ADMIN_API_ROUTES } from '@/modules/admin/constants';
import { SCHOOLS_API_ROUTES } from '@/modules/schools/constants';
import { ISchoolMeResponse } from '@/modules/schools/models';
import { TEACHERS_API_ROUTES } from '@/modules/teachers/constants';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { LOCAL_STORAGE_KEYS } from 'src/assets/constants';
import {
  IAuthResponse,
  ISignupRequestPayload,
  IUserLoginInfo,
  LoginCredentials,
  Maybe,
  TRoles,
  User,
} from '../models';
import { CaptchaService } from './captcha.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {
    this.initializeAuth();
  }

  readonly modulesLoginRoutes = {
    ADMIN: ADMIN_API_ROUTES.login(),
    SCHOOL: SCHOOLS_API_ROUTES.login(),
    TEACHER: TEACHERS_API_ROUTES.login(),
  } as Record<TRoles, string>;

  readonly modulesSignupRoutes = {
    TEACHER: TEACHERS_API_ROUTES.signup(),
  } as Record<TRoles, string>;

  readonly modulesGetInfoRoutes = {
    SCHOOL: SCHOOLS_API_ROUTES.me(),
  } as Record<TRoles, string>;

  readonly modulesChangeInfoRoutes = {
    SCHOOL: SCHOOLS_API_ROUTES.editLoginInfo(),
  } as Record<TRoles, string>;

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private captchaService = inject(CaptchaService);

  private readonly currentUserSubject = new BehaviorSubject<Maybe<User>>(null);
  private readonly isLoadingSubject = new BehaviorSubject<boolean>(false);

  readonly currentUser$ = this.currentUserSubject.asObservable();
  readonly isLoading$ = this.isLoadingSubject.asObservable();

  // Signals for reactive state management
  // readonly currentUser = signal<Maybe<User>>(null);
  readonly currentUser = signal<Maybe<User>>(null);
  readonly isLoading = signal<boolean>(false);
  readonly token = signal<Maybe<string>>(null);
  readonly isAuthenticated = computed(() => {
    return Boolean(this.token());
  });
  readonly userRole = computed(() => this.currentUser()?.role);

  private initializeAuth(): void {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);

    const userData = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);

    if (token && userData) {
      try {
        this.token.set(token);
        const user = JSON.parse(userData) as User;
        this.setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.logout();
      }
    }
  }

  login(credentials: LoginCredentials, role: TRoles): Observable<IAuthResponse> {
    const { username, password, captcha } = credentials;
    this.isLoading.set(true);
    this.isLoadingSubject.next(true);
    const baseHeaders = this.captchaService.buildCaptchaHeaders({}, captcha);

    return this.http
      .post<IAuthResponse>(
        this.modulesLoginRoutes[role],
        { username, password },
        {
          headers: baseHeaders,
        },
      )
      .pipe(
        tap((response) => {
          this.handleAuthSuccess(response);
          return response;
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

  signup(credentials: ISignupRequestPayload, role: TRoles): Observable<IAuthResponse> {
    this.isLoading.set(true);
    this.isLoadingSubject.next(true);
    // const baseHeaders = this.captchaService.buildCaptchaHeaders({}, captcha);

    return this.http
      .post<IAuthResponse>(
        this.modulesSignupRoutes[role],
        credentials,
        // {
        //   headers: baseHeaders,
        // },
      )
      .pipe(
        tap((response) => {
          this.handleAuthSuccess(response);
          return response;
        }),
        catchError((error) => {
          console.error('Signup error:', error);
          this.isLoadingSubject.next(false);
          throw error;
        }),
        finalize(() => {
          this.isLoading.set(false);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);

    this.setCurrentUser(null);
    this.router.navigate(['/auth']);
  }

  refreshToken(): Observable<IAuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<IAuthResponse>('/api/auth/refresh', { refreshToken }).pipe(
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

  getInfo(role: TRoles): Observable<Partial<IUserLoginInfo>> {
    if (this.modulesGetInfoRoutes[role]) {
      return this.http.get<any>(this.modulesGetInfoRoutes[role]).pipe(
        map((data) => {
          switch (role) {
            case 'SCHOOL':
              return this.prepareUserInfoBasedOnRole(role, data as ISchoolMeResponse);
            default:
              return data as Partial<IUserLoginInfo>;
          }
        }),
        catchError((err) => {
          console.error('GetInfo error:', err);
          return throwError(() => err);
        }),
      );
    }

    return throwError(() => new Error('متاسفانه مشکلی پیش آمده'));
  }
  changeInfo(credentials: IUserLoginInfo, role: TRoles): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(this.modulesChangeInfoRoutes[role], credentials);
  }

  prepareUserInfoBasedOnRole(role: TRoles, info: ISchoolMeResponse): Partial<IUserLoginInfo> {
    if (role === 'SCHOOL') {
      return {
        username: info.username,
        email: info.managerInfo.email,
        mobile: info.managerInfo.mobile,
      };
    }
    return {};
  }

  /**
   * Get current access token
   */
  getToken(): Maybe<string> {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Get current refresh token
   */
  getRefreshToken(): Maybe<string> {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
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

  hasRole(role: TRoles): boolean {
    return this.currentUser()?.role === role;
  }

  hasAnyRole(roles: TRoles[]): boolean {
    const currentRole = this.currentUser()?.role;
    return currentRole ? roles.includes(currentRole) : false;
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUser();
    if (!user) return false;

    return true;
    // return user.permissions.some(
    //   (p) => p.name === permission || `${p.resource}:${p.action}` === permission,
    // );
  }

  canAccess(requiredRoles?: TRoles[], requiredPermissions?: string[]): boolean {
    if (!this.isAuthenticated()) return false;

    if (requiredRoles && requiredRoles.length > 0) {
      if (!this.hasAnyRole(requiredRoles)) return false;
    }

    if (requiredPermissions && requiredPermissions.length > 0) {
      return requiredPermissions.every((permission) => this.hasPermission(permission));
    }

    return true;
  }

  private handleAuthSuccess(response: IAuthResponse): void {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, response.token);
    this.token.set(response.token);
    // localStorage.setItem('refresh_token', response.refreshToken);
    const user = { fullName: response.fullName, role: response.role as TRoles };

    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(user));

    this.setCurrentUser(user);
    // this.isLoading.set(false);
    this.currentUser.set({ fullName: response.fullName, role: response.role as TRoles });
    this.isLoadingSubject.next(false);

    // Navigate based on user role
    // this.navigateByRole(response.user.role);
  }

  private setCurrentUser(user: Maybe<User>): void {
    this.currentUser.set(user);
    this.currentUserSubject.next(user);
  }
}
