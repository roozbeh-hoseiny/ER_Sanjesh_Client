import { ISchoolResponse } from '@/modules/admin/pages/schools/models/schools';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TEACHERS_API_ROUTES } from '../constants';
import { IVerifyManagerEmailRequest, IVerifyManagerMobileRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class SchoolsAuthService {
  constructor(private http: HttpClient) {}

  private apiRoutes = TEACHERS_API_ROUTES;

  me(): Observable<ISchoolResponse> {
    return this.http.get<ISchoolResponse>(this.apiRoutes.me());
  }

  sendOTPSms(request: { mobile: string }): Observable<void> {
    return this.http.post<void>(this.apiRoutes.sendSmsOTP(), request);
  }
  sendOTPEmail(request: { email: string }): Observable<void> {
    return this.http.post<void>(this.apiRoutes.sendEmailOTP(), request);
  }

  sendOTPEmailForManagerEmail(): Observable<void> {
    return this.http.post<void>(this.apiRoutes.emailSendOTPVerification(), {});
  }

  verifyManagerEmail(request: IVerifyManagerEmailRequest): Observable<void> {
    return this.http.post<void>(this.apiRoutes.emailVerification(), request);
  }
  verifyManagerMobile(request: IVerifyManagerMobileRequest): Observable<void> {
    return this.http.post<void>(this.apiRoutes.phoneVerification(), request);
  }
}
