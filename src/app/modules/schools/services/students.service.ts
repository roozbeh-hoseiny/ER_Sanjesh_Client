import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SCHOOLS_API_ROUTES } from '../constants/apiRoutes';
import { IStudentRawResponse, IStudentResponse } from '../pages/students/models';

@Injectable({ providedIn: 'root' })
export class SchoolsStudentsService {
  constructor(private http: HttpClient) {}

  private apiRoutes = SCHOOLS_API_ROUTES;

  getAll(schoolId: string): Observable<IStudentResponse[]> {
    return this.http.get<IStudentRawResponse[]>(this.apiRoutes.students.list());
  }
}
