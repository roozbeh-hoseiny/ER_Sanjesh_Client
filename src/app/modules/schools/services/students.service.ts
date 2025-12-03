import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SCHOOLS_API_ROUTES } from '../constants/apiRoutes';
import {
  IGetSchoolStudentsRequestPayload,
  IStudentBulkAddResponse,
  IStudentRawResponse,
  IStudentResponse,
} from '../pages/students/models';

@Injectable({ providedIn: 'root' })
export class SchoolsStudentsService {
  constructor(private http: HttpClient) {}

  private apiRoutes = SCHOOLS_API_ROUTES;

  getAll(payload: IGetSchoolStudentsRequestPayload): Observable<IStudentResponse[]> {
    return this.http.post<IStudentRawResponse[]>(this.apiRoutes.students.list(), payload);
  }

  bulkAdd(formData: FormData): Observable<IStudentBulkAddResponse[]> {
    return this.http.post<IStudentBulkAddResponse[]>(this.apiRoutes.students.bulkAdd(), formData);
  }
}
