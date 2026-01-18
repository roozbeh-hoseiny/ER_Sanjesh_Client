import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import {
  IAssignExistStudentToSchoolRequestPayload,
  IAssignExistStudentToSchoolRequestResponse,
  ICheckExistStudentRequestPayload,
  ICheckExistStudentRequestRawResponse,
  ICheckExistStudentRequestResponse,
  IGetSchoolStudentsRequestPayload,
  IStudentBulkAddResponse,
  IStudentRawResponse,
  IStudentRequestPayload,
  IStudentRequestResponse,
  IStudentResponse,
  IUnassignExistStudentToSchoolRequestPayload,
  IUnassignExistStudentToSchoolRequestResponse,
} from '../../../shared/components/modules/students';
import { SCHOOLS_API_ROUTES } from '../constants/apiRoutes';

@Injectable({ providedIn: 'any' })
export class SchoolsStudentsService {
  private http = inject(HttpClient);

  private apiRoutes = SCHOOLS_API_ROUTES;

  getAll(payload: IGetSchoolStudentsRequestPayload): Observable<IStudentResponse[]> {
    return this.http
      .post<IStudentRawResponse[]>(this.apiRoutes.students.list(), payload)
      .pipe(shareReplay());
  }

  bulkAdd(formData: FormData): Observable<IStudentBulkAddResponse[]> {
    return this.http.post<IStudentBulkAddResponse[]>(this.apiRoutes.students.bulkAdd(), formData);
  }

  create(payload: IStudentRequestPayload): Observable<IStudentRequestResponse> {
    return this.http.post<IStudentRequestResponse>(this.apiRoutes.students.create(), payload);
  }

  checkIsExist(
    payload: ICheckExistStudentRequestPayload,
  ): Observable<ICheckExistStudentRequestResponse> {
    return this.http.post<ICheckExistStudentRequestRawResponse>(
      this.apiRoutes.students.checkExist(),
      payload,
    );
  }

  assign(
    payload: IAssignExistStudentToSchoolRequestPayload,
  ): Observable<IAssignExistStudentToSchoolRequestResponse> {
    return this.http.post<ICheckExistStudentRequestRawResponse>(
      this.apiRoutes.students.assign(),
      payload,
    );
  }
  unassign(
    payload: IUnassignExistStudentToSchoolRequestPayload,
  ): Observable<IUnassignExistStudentToSchoolRequestResponse> {
    return this.http.post<IUnassignExistStudentToSchoolRequestResponse>(
      this.apiRoutes.students.unassign(),
      payload,
    );
  }
}
