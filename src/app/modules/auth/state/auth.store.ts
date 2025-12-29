import { AuthService } from '@/core';
import { CaptchaService } from '@/core/services/captcha.service';
import { ToastService } from '@/core/services/toast.service';
import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, of, tap } from 'rxjs';
import { LOCAL_STORAGE_KEYS, ROLES } from 'src/assets/constants';
import {
  IAuthResponse,
  ISignupRequestPayload,
  IUserLoginInfo,
  LoginCredentials,
  LoginOtpCredentials,
  Maybe,
  ResetPasswordOtpCredentials,
  SendSmsOtpCredentials,
  TRoles,
  User,
} from '../../../core/models';
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
  selectedRole: TRoles;
  redirectUrl: string;
  authStep: TAuthSteps;
  loginType: TLoginType;
  loginStep: TLoginSteps;
  captchaCode: Maybe<string>;
  pendingUserInfo?: Partial<IUserLoginInfo>;
}

/**
 * Login state for UI feedback
 */
export interface LoginState {
  isLoggingIn: boolean;
  isRefreshing: boolean;
  loginError: Maybe<string>;
}
export type TAuthSteps = 'login' | 'otp' | 'modifyLoginInfo' | 'signup' | 'forgetPassword';
export type TLoginType = 'PASSWORD' | 'OTP';
export type TLoginSteps = 'SEND_OTP' | 'VERIFY_OTP';

/**
 * Authentication state store
 */
@Injectable({
  providedIn: 'root',
})
export class AuthStore extends BaseStore<AuthState> {
  // private readonly http = inject(HttpClient);
  private readonly service = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly captchaService = inject(CaptchaService);

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
      selectedRole: ROLES.SCHOOL,
      redirectUrl: '',
      authStep: 'login',
      loginType: 'PASSWORD',
      loginStep: 'SEND_OTP',
      captchaCode: null,
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
  readonly selectedRole = computed(() => this._state().selectedRole);
  readonly redirectUrl = computed(() => this._state().redirectUrl);
  readonly authStep = computed(() => this._state().authStep);
  readonly loginType = computed(() => this._state().loginType);
  readonly loginStep = computed(() => this._state().loginStep);
  readonly captchaCode = computed(() => this._state().captchaCode);
  readonly pendingUserInfo = computed(() => this._state().pendingUserInfo);
  readonly canChangeRole = computed(() => this.selectedRole() !== 'ADMIN');

  // Login state selectors
  readonly isLoggingIn = computed(() => this._loginState.isLoggingIn);
  readonly isRefreshing = computed(() => this._loginState.isRefreshing);
  readonly loginError = computed(() => this._loginState.loginError);

  //captcha selectors
  readonly captchaIsExpired = this.captchaService.captchaIsExpired;
  readonly captchaLoading = this.captchaService.loading;
  readonly captchaImageSrc = this.captchaService.captchaImageSrc;

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

  setSelectedRole(role: TRoles) {
    this.patchState({ selectedRole: role });
  }
  setRedirectUrl(url: string) {
    this.patchState({ redirectUrl: url });
  }
  setAuthStep(authStep: TAuthSteps) {
    this.patchState({ authStep, loginStep: 'SEND_OTP' });
  }
  setLoginType(loginType: TLoginType) {
    this.patchState({ loginType });
  }
  setCaptchaCode(captchaCode: string) {
    this.patchState({ captchaCode });
  }
  setLoginStep(loginStep: TLoginSteps) {
    this.patchState({ loginStep });
  }
  resetCaptcha() {
    this.captchaService.renewCaptcha();
    this.patchState({ captchaCode: null });
  }
  requestNewCaptcha() {
    this.captchaService.requestNewCaptcha();
  }

  private redirectToDashboard() {
    let redirectUrl = this._state().redirectUrl.replace(/\/[^/]*$/, '');
    if (!this._state().redirectUrl) {
      switch (this.selectedRole()) {
        case 'SCHOOL':
          redirectUrl = '/schools';
          break;
        case 'ADMIN':
          redirectUrl = '/admin';
          break;
        case 'TEACHER':
          redirectUrl = '/teachers';
          break;
        case 'STUDENTS':
          redirectUrl = '/students';
          break;
      }
    }
    this.router.navigateByUrl(redirectUrl);
  }

  /**
   * Login with credentials
   */
  login(credentials: LoginCredentials) {
    if (!this._state().captchaCode) {
      this.toastService.error({ text: 'مقدار کپچا را وارد کنید' });
      return of(null);
    }
    this._loginState.isLoggingIn = true;
    this._loginState.loginError = null;
    this.setLoading(true);

    return this.service
      .login({ ...credentials, captcha: this.captchaCode()! }, this.selectedRole())
      .pipe(
        tap((response) => {
          this.handleAuthSuccess(response);
          this.resetCaptcha();
          if (response.mustChangePassword) {
            // @TODO: check below to fill pendingUserInfo correctly
            this.patchState({ pendingUserInfo: { username: credentials.username } });
            this.setAuthStep('modifyLoginInfo');
          }
        }),
        catchError((error) => {
          this.handleAuthError(error);
          return of(null);
        }),
        finalize(() => {
          this._loginState.isLoggingIn = false;
          this.setLoading(false);
        }),
      );
  }

  sendOtp(credentials: SendSmsOtpCredentials) {
    this._loginState.isLoggingIn = true;
    this._loginState.loginError = null;
    this.setLoading(true);
    return this.service
      .sendOTP({ ...credentials, captcha: this.captchaCode()! }, this.selectedRole())
      .pipe(
        tap((response) => {
          this.patchState({ pendingUserInfo: { mobile: credentials.mobile } });
          this.setLoginStep('VERIFY_OTP');
          this.resetCaptcha();
        }),
        catchError((error) => {
          this.handleAuthError(error);
          return of(null);
        }),
        finalize(() => {
          this._loginState.isLoggingIn = false;
          this.setLoading(false);
        }),
      );
  }

  resendOtp() {
    if (this.pendingUserInfo()?.mobile) {
      this._loginState.isLoggingIn = true;
      this._loginState.loginError = null;
      this.setLoading(true);
      return this.service
        .resendOTP({ mobile: this.pendingUserInfo()!.mobile! }, this.selectedRole())
        .pipe(
          tap((response) => {
            this.toastService.success({
              text: 'کد تایید مجددا ارسال شد',
            });
            return of(response);
          }),
          catchError((error) => {
            this.handleAuthError(error);
            return of(null);
          }),
          finalize(() => {
            this._loginState.isLoggingIn = false;
            this.setLoading(false);
          }),
        );
    } else {
      return of(null);
    }
  }

  loginWithOtp(credentials: LoginOtpCredentials) {
    this._loginState.isLoggingIn = true;
    this._loginState.loginError = null;
    this.setLoading(true);

    return this.service
      .loginWithOTP(
        {
          otp: credentials.otp,
          mobile: this.pendingUserInfo()?.mobile!,
          captcha: this.captchaCode()!,
        },
        this.selectedRole(),
      )
      .pipe(
        tap((response) => {
          this.handleAuthSuccess(response);
        }),
        catchError((error) => {
          this.handleAuthError(error);
          return of(null);
        }),
        finalize(() => {
          this._loginState.isLoggingIn = false;
          this.setLoading(false);
        }),
      );
  }

  sendForgetPasswordOtp(credentials: SendSmsOtpCredentials) {
    this._loginState.isLoggingIn = true;
    this._loginState.loginError = null;
    this.setLoading(true);
    return this.service
      .sendOtpForResetPassword(
        { ...credentials, captcha: this.captchaCode()! },
        this.selectedRole(),
      )
      .pipe(
        tap((response) => {
          this.patchState({ pendingUserInfo: { mobile: credentials.mobile } });
          this.setLoginStep('VERIFY_OTP');
          this.resetCaptcha();
        }),
        catchError((error) => {
          this.handleAuthError(error);
          return of(null);
        }),
        finalize(() => {
          this._loginState.isLoggingIn = false;
          this.setLoading(false);
        }),
      );
  }

  resendForgetPasswordOtp() {
    if (this.pendingUserInfo()?.mobile) {
      this._loginState.isLoggingIn = true;
      this._loginState.loginError = null;
      this.setLoading(true);
      return this.service
        .resendOtpForResetPassword({ mobile: this.pendingUserInfo()!.mobile! }, this.selectedRole())
        .pipe(
          tap((response) => {
            this.toastService.success({
              text: 'کد تایید مجددا ارسال شد',
            });
            return of(response);
          }),
          catchError((error) => {
            this.handleAuthError(error);
            return of(null);
          }),
          finalize(() => {
            this._loginState.isLoggingIn = false;
            this.setLoading(false);
          }),
        );
    } else {
      return of(null);
    }
  }

  resetPasswordWithOtp(credentials: ResetPasswordOtpCredentials) {
    this._loginState.isLoggingIn = true;
    this._loginState.loginError = null;
    this.setLoading(true);

    return this.service
      .resetPasswordWithOtp(
        {
          ...credentials,
          mobile: this.pendingUserInfo()?.mobile!,
          captcha: this.captchaCode()!,
        },
        this.selectedRole(),
      )
      .pipe(
        tap((response) => {
          this.toastService.success({
            text: 'رمز عبور با موفقیت تغییر کرد. لطفا وارد شوید.',
          });
          this.setAuthStep('login');
          this.resetCaptcha();
        }),
        catchError((error) => {
          this.handleAuthError(error);
          return of(null);
        }),
        finalize(() => {
          this._loginState.isLoggingIn = false;
          this.setLoading(false);
        }),
      );
  }

  modifyInfo(updatedInfo: IUserLoginInfo) {
    this.setLoading(true);
    return this.service.changeInfo(updatedInfo, this.selectedRole()).pipe(
      tap((response) => {
        this.toastService.success({
          text: 'اطلاعات با موفقیت به‌روزرسانی شد',
        });
        this.setAuthStep('login');
      }),
      catchError((error) => {
        return of(null);
      }),
      finalize(() => {
        this.setLoading(false);
      }),
    );
  }

  signup(credentials: ISignupRequestPayload) {
    this.setLoading(true);

    return this.service.signup(credentials, this.selectedRole()).pipe(
      tap(() => {
        this.toastService.success({
          text: 'ثبت نام با موفقیت انجام شد. لطفا وارد شوید.',
        });
        this.setAuthStep('login');
      }),
      catchError((error) => {
        return of(null);
      }),
      finalize(() => {
        this.setLoading(false);
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

    return this.service.refreshToken().pipe(
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
  private handleAuthSuccess(response: IAuthResponse, withoutRedirect?: boolean): void {
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
      pendingUserInfo: undefined,
      loading: false,
      error: null,
    });

    // Reset login attempts on successful login
    localStorage.removeItem(LOCAL_STORAGE_KEYS.LOGIN_ATTEMPTS);

    if (!withoutRedirect) {
      this.redirectToDashboard();
    }
    this.resetCaptcha();
  }

  /**
   * Handle authentication error
   */
  private handleAuthError(error: any): void {
    this.resetCaptcha();
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
      [ROLES.TEACHER]: '/teachers',
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
      selectedRole: ROLES.SCHOOL,
      redirectUrl: '',
      authStep: 'login',
      loginType: 'PASSWORD',
      loginStep: 'SEND_OTP',
      captchaCode: null,
    });

    this._loginState.isLoggingIn = false;
    this._loginState.isRefreshing = false;
    this._loginState.loginError = null;
  }
}
