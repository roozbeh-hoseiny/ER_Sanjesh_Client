import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SCHOOLS_API_ROUTES } from '../constants/apiRoutes';
import { ISchoolTeacherMappedData, ISchoolTeacherResponse } from '../pages/teachers/models';

@Injectable({ providedIn: 'root' })
export class SchoolsTeachersService {
  constructor(private http: HttpClient) {}

  private apiRoutes = SCHOOLS_API_ROUTES;

  getAll(schoolId: string): Observable<ISchoolTeacherResponse[]> {
    return this.http.post<ISchoolTeacherResponse[]>(this.apiRoutes.teachers.list(), {
      id: schoolId,
    });
  }

  getAllMappedData(schoolId: string): Observable<ISchoolTeacherMappedData[]> {
    return this.getAll(schoolId).pipe(
      map((teachers) =>
        teachers.map((teacher) => ({
          ...teacher,
          fullname: `${teacher.gender ? 'آقای' : 'خانم'} ${teacher.firstName} ${teacher.lastName}`,
        })),
      ),
    );
  }

  findByUniqueId(uniqueId: string): Observable<ISchoolTeacherResponse> {
    return this.http.get<ISchoolTeacherResponse>(this.apiRoutes.teachers.findByUniqueId(uniqueId));
  }
}
