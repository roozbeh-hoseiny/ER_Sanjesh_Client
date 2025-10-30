import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SCHOOLS_API_ROUTES } from '../constants';
import {
  ISchoolMeResponse,
  IVerifyContactEmailRequest,
  IVerifyContactMobileRequest,
  IVerifyManagerEmailRequest,
  IVerifyManagerMobileRequest,
} from '../models';

@Injectable({ providedIn: 'root' })
export class SchoolsAuthService {
  constructor(private http: HttpClient) {}

  private apiRoutes = SCHOOLS_API_ROUTES;

  me(): Observable<ISchoolMeResponse> {
    console.log('asdasdasd');

    return this.http.get<ISchoolMeResponse>(this.apiRoutes.me());
  }

  verifyContactEmail(request: IVerifyContactEmailRequest): Observable<void> {
    return this.http.post<void>(this.apiRoutes.contactEmailVerification(), request);
  }
  verifyContactMobile(request: IVerifyContactMobileRequest): Observable<void> {
    return this.http.post<void>(this.apiRoutes.contactPhoneVerification(), request);
  }

  sendOTPSms(request: { mobile: string }): Observable<void> {
    return this.http.post<void>(this.apiRoutes.sendSmsOTP(), request);
  }
  sendOTPEmail(request: { email: string }): Observable<void> {
    return this.http.post<void>(this.apiRoutes.sendEmailOTP(), request);
  }

  sendOTPEmailForManagerEmail(): Observable<void> {
    return this.http.post<void>(this.apiRoutes.managerEmailSendOTPVerification(), {});
  }
  sendOTPSmsForManagerMobile(): Observable<void> {
    return this.http.post<void>(this.apiRoutes.managerPhoneSendOTPVerification(), {});
  }

  verifyManagerEmail(request: IVerifyManagerEmailRequest): Observable<void> {
    return this.http.post<void>(this.apiRoutes.managerEmailVerification(), request);
  }
  verifyManagerMobile(request: IVerifyManagerMobileRequest): Observable<void> {
    return this.http.post<void>(this.apiRoutes.managerPhoneVerification(), request);
  }
}
