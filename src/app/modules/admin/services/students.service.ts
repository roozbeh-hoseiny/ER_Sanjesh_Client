import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import {
  IAssignExistStudentToSchoolRequestPayload,
  IAssignExistStudentToSchoolRequestResponse,
  ICheckExistStudentRequestRawResponse,
  IStudentRawResponse,
  IStudentResponse,
  IUnassignExistStudentToSchoolRequestPayload,
  IUnassignExistStudentToSchoolRequestResponse,
} from '../../../shared/components/modules/students';
import { ADMIN_API_ROUTES } from '../constants';
import { IGetAdminSchoolStudentsRequestPayload } from '../pages/schools/models/schools';

@Injectable({ providedIn: 'any' })
export class AdminSchoolsStudentsService {
  private http = inject(HttpClient);

  private apiRoutes = ADMIN_API_ROUTES.schools.students;

  getAll(payload: IGetAdminSchoolStudentsRequestPayload): Observable<IStudentResponse[]> {
    return this.http
      .post<IStudentRawResponse[]>(this.apiRoutes.list(), payload)
      .pipe(shareReplay());
  }

  assign(
    payload: IAssignExistStudentToSchoolRequestPayload,
  ): Observable<IAssignExistStudentToSchoolRequestResponse> {
    return this.http.post<ICheckExistStudentRequestRawResponse>(this.apiRoutes.assign(), payload);
  }
  unassign(
    payload: IUnassignExistStudentToSchoolRequestPayload,
  ): Observable<IUnassignExistStudentToSchoolRequestResponse> {
    return this.http.post<IUnassignExistStudentToSchoolRequestResponse>(
      this.apiRoutes.unassign(),
      payload,
    );
  }
}
