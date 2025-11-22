import { PAGINATED_QUERY_DEFAULT_VALUES } from '@/core/constants';
import { IPaginatedQuery, IPaginatedResponse } from '@/core/models/service.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ADMIN_API_ROUTES } from '../constants/apiRoutes';
import { IAdminExamRawResponse, IExamRequestPayload } from '../pages/exams';
import { IAdminTeacherResponse } from '../pages/teachers/models';

@Injectable({ providedIn: 'root' })
export class AdminExamsService {
  constructor(private http: HttpClient) {}

  private apiRoutes = ADMIN_API_ROUTES.exams;

  getAll(paginatedQuery: IPaginatedQuery): Observable<IPaginatedResponse<IAdminExamRawResponse>> {
    return this.http.post<IPaginatedResponse<IAdminTeacherResponse>>(this.apiRoutes.list(), {
      ...PAGINATED_QUERY_DEFAULT_VALUES,
      ...paginatedQuery,
    });
  }

  create(payload: IExamRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.create(), payload);
  }

  // filterByWithoutSchools(
  //   paginatedQuery: IPaginatedQuery,
  // ): Observable<IPaginatedResponse<IAdminTeacherEntity>> {
  //   return this.http
  //     .post<IPaginatedResponse<IAdminTeacherResponse>>(this.apiRoutes.teachers.byWithoutSchools(), {
  //       ...PAGINATED_QUERY_DEFAULT_VALUES,
  //       ...paginatedQuery,
  //     })
  //     .pipe(
  //       map((res) => ({
  //         ...res,
  //         items: res.items.map(this.mapTeacherData),
  //       })),
  //     );
  // }
  // byLesson(
  //   lessonId: number,
  //   paginatedQuery: IPaginatedQuery,
  // ): Observable<IPaginatedResponse<IAdminTeacherEntity>> {
  //   return this.http
  //     .post<IPaginatedResponse<IAdminTeacherResponse>>(this.apiRoutes.teachers.byLesson(), {
  //       ...PAGINATED_QUERY_DEFAULT_VALUES,
  //       ...paginatedQuery,
  //       lessonId,
  //     })
  //     .pipe(
  //       map((res) => ({
  //         ...res,
  //         items: res.items.map(this.mapTeacherData),
  //       })),
  //     );
  // }
  // bySchool(schoolId: string): Observable<IAdminTeacherEntity[]> {
  //   return this.http
  //     .post<IAdminTeacherResponse[]>(this.apiRoutes.teachers.bySchool(), {
  //       schoolId,
  //     })
  //     .pipe(map((res) => res.map(this.mapTeacherData)));
  // }
}
