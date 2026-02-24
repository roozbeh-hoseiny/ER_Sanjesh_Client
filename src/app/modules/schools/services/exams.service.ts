import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SCHOOLS_API_ROUTES } from '../constants/apiRoutes';
import {
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
    return this.http.get<ISchoolExamDetailsRawResponse>(this.apiRoutes.single(examId));
  }

  getStudents(examId: string): Observable<ISchoolStudentWithExamsInfoRawResponse[]> {
    return this.http.post<ISchoolStudentWithExamsInfoResponse[]>(this.apiRoutes.students(), {
      examid: examId,
    });
  }
}
