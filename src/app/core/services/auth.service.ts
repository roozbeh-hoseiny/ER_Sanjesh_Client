import { ADMIN_API_ROUTES } from '@/modules/admin/constants';
import { SCHOOLS_API_ROUTES } from '@/modules/schools/constants';
import { ISchoolMeResponse } from '@/modules/schools/models';
import { TEACHERS_API_ROUTES } from '@/modules/teachers/constants';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LOCAL_STORAGE_KEYS } from 'src/assets/constants';
import {
  IAuthResponse,
  ILoginRequestPayload,
  ISendSmsOtpRequestPayload,
  ISendVoiceOtpRequestPayload,
  ISignupRequestPayload,
  IUserLoginInfo,
  LoginOtpRequestPayload,
  LoginVoiceOtpRequestPayload,
  ResetPasswordOtpRequestPayload,
  SendSmsOtpCredentials,
  SendVoiceOtpCredentials,
  TRoles,
} from '../models';
import { CaptchaService } from './captcha.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly modulesLoginRoutes = {
    ADMIN: ADMIN_API_ROUTES.login(),
    SCHOOL: SCHOOLS_API_ROUTES.login(),
    TEACHER: TEACHERS_API_ROUTES.login(),
  } as Record<TRoles, string>;

  readonly modulesSendSmsOtpForgetPasswordRoutes = {
    SCHOOL: SCHOOLS_API_ROUTES.sendSmsOtpForForgetPassword(),
  } as Record<TRoles, string>;
  readonly modulesResendSmsOtpForgetPasswordRoutes = {
    SCHOOL: SCHOOLS_API_ROUTES.resendSmsOtpForForgetPassword(),
  } as Record<TRoles, string>;

  readonly modulesResetPasswordRoutes = {
    SCHOOL: SCHOOLS_API_ROUTES.resetPassword(),
  } as Record<TRoles, string>;

  readonly modulesSignupRoutes = {
    TEACHER: TEACHERS_API_ROUTES.signup(),
  } as Record<TRoles, string>;

  readonly modulesSendSmsOtpRoutes = {
    SCHOOL: SCHOOLS_API_ROUTES.sendSmsOtpForLogin(),
  } as Record<TRoles, string>;

  readonly modulesResendSmsOtpRoutes = {
    SCHOOL: SCHOOLS_API_ROUTES.resendSmsOtpForLogin(),
  } as Record<TRoles, string>;

  readonly modulesLoginWithOtpRoutes = {
    SCHOOL: SCHOOLS_API_ROUTES.loginWithSmsOtp(),
  } as Record<TRoles, string>;

  readonly modulesSendVoiceOtpRoutes = {
    SCHOOL: SCHOOLS_API_ROUTES.sendVoiceOtpForLogin(),
  } as Record<TRoles, string>;

  readonly modulesResendVoiceOtpRoutes = {
    SCHOOL: SCHOOLS_API_ROUTES.resendVoiceOtpForLogin(),
  } as Record<TRoles, string>;

  readonly modulesLoginWithVoiceOtpRoutes = {
    SCHOOL: SCHOOLS_API_ROUTES.loginWithVoiceOtp(),
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

  sendOTP(credentials: ISendSmsOtpRequestPayload, role: TRoles): Observable<void> {
    const endpoint = this.modulesSendSmsOtpRoutes[role];
    const { mobile, captcha } = credentials;
    const baseHeaders = this.captchaService.buildCaptchaHeaders({}, captcha);

    return this.http.post<void>(
      endpoint,
      { mobile },
      {
        headers: baseHeaders,
      },
    );
  }

  resendOTP(credentials: SendSmsOtpCredentials, role: TRoles): Observable<void> {
    const endpoint = this.modulesResendSmsOtpRoutes[role];
    const { mobile } = credentials;

    return this.http.post<void>(endpoint, { mobile });
  }

  loginWithOTP(credentials: LoginOtpRequestPayload, role: TRoles): Observable<IAuthResponse> {
    const { captcha, ...rest } = credentials;

    const baseHeaders = this.captchaService.buildCaptchaHeaders({}, captcha);
    return this.http.post<IAuthResponse>(this.modulesLoginWithOtpRoutes[role], rest, {
      headers: baseHeaders,
    });
  }

  // start with voice OTP
  sendVoiceOTP(credentials: ISendVoiceOtpRequestPayload, role: TRoles): Observable<void> {
    const endpoint = this.modulesSendVoiceOtpRoutes[role];
    const { mobile, captcha } = credentials;
    const baseHeaders = this.captchaService.buildCaptchaHeaders({}, captcha);

    return this.http.post<void>(
      endpoint,
      { mobile },
      {
        headers: baseHeaders,
      },
    );
  }

  resendVoiceOTP(credentials: SendVoiceOtpCredentials, role: TRoles): Observable<void> {
    const endpoint = this.modulesResendVoiceOtpRoutes[role];
    const { mobile } = credentials;

    return this.http.post<void>(endpoint, { mobile });
  }

  loginWithVoiceOTP(
    credentials: LoginVoiceOtpRequestPayload,
    role: TRoles,
  ): Observable<IAuthResponse> {
    const { captcha, ...rest } = credentials;

    const baseHeaders = this.captchaService.buildCaptchaHeaders({}, captcha);
    return this.http.post<IAuthResponse>(this.modulesLoginWithVoiceOtpRoutes[role], rest, {
      headers: baseHeaders,
    });
  }
  // end with voice OTP

  login(credentials: ILoginRequestPayload, role: TRoles): Observable<IAuthResponse> {
    const { username, password, captcha } = credentials;
    const baseHeaders = this.captchaService.buildCaptchaHeaders({}, captcha);

    return this.http.post<IAuthResponse>(
      this.modulesLoginRoutes[role],
      { username, password },
      {
        headers: baseHeaders,
      },
    );
  }

  signup(credentials: ISignupRequestPayload, role: TRoles): Observable<IAuthResponse> {
    // const baseHeaders = this.captchaService.buildCaptchaHeaders({}, captcha);

    return this.http.post<IAuthResponse>(
      this.modulesSignupRoutes[role],
      credentials,
      // {
      //   headers: baseHeaders,
      // },
    );
  }

  sendOtpForResetPassword(credentials: ISendSmsOtpRequestPayload, role: TRoles): Observable<void> {
    const endpoint = this.modulesSendSmsOtpForgetPasswordRoutes[role];
    const { mobile, captcha } = credentials;
    const baseHeaders = this.captchaService.buildCaptchaHeaders({}, captcha);

    return this.http.post<void>(
      endpoint,
      { mobile },
      {
        headers: baseHeaders,
      },
    );
  }

  resendOtpForResetPassword(credentials: SendSmsOtpCredentials, role: TRoles): Observable<void> {
    const endpoint = this.modulesResendSmsOtpForgetPasswordRoutes[role];
    const { mobile } = credentials;

    return this.http.post<void>(endpoint, { mobile });
  }

  resetPasswordWithOtp(
    credentials: ResetPasswordOtpRequestPayload,
    role: TRoles,
  ): Observable<IAuthResponse> {
    const { captcha, ...rest } = credentials;
    const baseHeaders = this.captchaService.buildCaptchaHeaders({}, captcha);
    return this.http.post<IAuthResponse>(this.modulesResetPasswordRoutes[role], rest, {
      headers: baseHeaders,
    });
  }

  logout(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
    this.router.navigate(['/auth']);
  }

  refreshToken(): Observable<IAuthResponse> {
    return of();
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
}
