import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SCHOOLS_API_ROUTES } from '../constants/apiRoutes';
import { ISchoolTeacherMappedData, ISchoolTeacherRawResponse } from '../pages/teachers/models';

@Injectable({ providedIn: 'root' })
export class SchoolsTeachersService {
  constructor(private http: HttpClient) {}

  private apiRoutes = SCHOOLS_API_ROUTES;

  getAll(schoolId: string): Observable<ISchoolTeacherRawResponse[]> {
    return this.http.get<ISchoolTeacherRawResponse[]>(this.apiRoutes.teachers.list());
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

  findByUniqueId(uniqueId: string): Observable<ISchoolTeacherRawResponse> {
    return this.http.get<ISchoolTeacherRawResponse>(
      this.apiRoutes.teachers.findByUniqueId(uniqueId),
    );
  }

  assignTeacher(teacherId: string, lessonId: number): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.assignTeacher(), {
      teacherId,
      lessonId,
    });
  }
}
