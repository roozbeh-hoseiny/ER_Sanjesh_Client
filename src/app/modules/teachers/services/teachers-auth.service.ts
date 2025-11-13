import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TEACHERS_API_ROUTES } from '../constants';
import { ITeacherMeResponse, IVerifyEmailRequest, IVerifyMobileRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class TeachersAuthService {
  constructor(private http: HttpClient) {}

  private apiRoutes = TEACHERS_API_ROUTES;

  me(): Observable<ITeacherMeResponse> {
    return this.http.get<ITeacherMeResponse>(this.apiRoutes.me());
  }

  sendOTPSms(request: { mobile: string }): Observable<void> {
    return this.http.post<void>(this.apiRoutes.sendSmsOTP(), request);
  }
  sendOTPEmail(request: { email: string }): Observable<void> {
    return this.http.post<void>(this.apiRoutes.sendEmailOTP(), request);
  }

  sendOTPEmailForEmail(): Observable<void> {
    return this.http.post<void>(this.apiRoutes.emailSendOTPVerification(), {});
  }
  sendOTPSmsForMobile(): Observable<void> {
    return this.http.post<void>(this.apiRoutes.phoneSendOTPVerification(), {});
  }

  verifyEmail(request: IVerifyEmailRequest): Observable<void> {
    return this.http.post<void>(this.apiRoutes.emailVerification(), request);
  }
  verifyMobile(request: IVerifyMobileRequest): Observable<void> {
    return this.http.post<void>(this.apiRoutes.phoneVerification(), request);
  }
}
