import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SCHOOLS_API_ROUTES } from '../constants/apiRoutes';
import {
  IExamRegisterByCouponRequestPayload,
  IExamRegisterByCreditRequestPayload,
  ISchoolExamDetailsRawResponse,
  ISchoolExamDetailsResponse,
  ISchoolExamsRawResponse,
  ISchoolExamsResponse,
  ISchoolStudentWithExamsInfoRawResponse,
  ISchoolStudentWithExamsInfoResponse,
} from '../pages/exams/models';

@Injectable({ providedIn: 'root' })
export class SchoolExamsService {
  constructor(private http: HttpClient) {}

  private apiRoutes = SCHOOLS_API_ROUTES.exams;

  getList(): Observable<ISchoolExamsResponse[]> {
    return this.http.get<ISchoolExamsRawResponse[]>(this.apiRoutes.list());
  }
  get(examId: string): Observable<ISchoolExamDetailsResponse> {
    return this.http.get<ISchoolExamDetailsRawResponse>(this.apiRoutes.single(examId)).pipe(
      map((res) => ({
        ...res,
        discountPercent: parseFloat(res.discountPercent),
        discountValue: parseFloat(res.discountValue),
        hasDiscount: !!res.discountPercent || !!res.discountValue,
      })),
    );
  }

  getStudents(examId: string): Observable<ISchoolStudentWithExamsInfoRawResponse[]> {
    return this.http.post<ISchoolStudentWithExamsInfoResponse[]>(this.apiRoutes.students(), {
      examid: examId,
    });
  }

  registerByCoupon(data: IExamRegisterByCouponRequestPayload): Observable<void> {
    return this.http.post<void>(this.apiRoutes.registerByCoupon(), data);
  }

  registerByCredit(data: IExamRegisterByCreditRequestPayload): Observable<void> {
    return this.http.post<void>(this.apiRoutes.registerByCredit(), data);
  }
}
