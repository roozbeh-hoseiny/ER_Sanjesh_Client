import { PAGINATED_QUERY_DEFAULT_VALUES } from '@/core/constants';
import { IPaginatedQuery, IPaginatedResponse } from '@/core/models/service.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ADMIN_API_ROUTES } from '../constants/apiRoutes';
import {
  IAdminTeacherEntity,
  IAdminTeacherResponse,
  IAttachLessonToTeacherRequest,
  IDetachLessonFromTeacherRequest,
} from '../pages/teachers/models';

@Injectable({ providedIn: 'root' })
export class AdminTeachersService {
  constructor(private http: HttpClient) {}

  private apiRoutes = ADMIN_API_ROUTES;

  getAll(paginatedQuery: IPaginatedQuery): Observable<IPaginatedResponse<IAdminTeacherEntity>> {
    return this.http
      .post<IPaginatedResponse<IAdminTeacherResponse>>(this.apiRoutes.teachers.list(), {
        ...PAGINATED_QUERY_DEFAULT_VALUES,
        ...paginatedQuery,
      })
      .pipe(
        map((res) => ({
          ...res,
          items: res.items.map(this.mapTeacherData),
        })),
      );
  }
  byId(id: string): Observable<IAdminTeacherEntity> {
    return this.http
      .get<IAdminTeacherResponse>(this.apiRoutes.teachers.byId(id))
      .pipe(map(this.mapTeacherData));
  }

  attachLesson(payload: IAttachLessonToTeacherRequest): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.teachers.attachLesson(), payload);
  }

  detachLesson(payload: IDetachLessonFromTeacherRequest): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.teachers.detachLesson(), payload);
  }

  private mapTeacherData(teacher: IAdminTeacherResponse): IAdminTeacherEntity {
    return {
      ...teacher,
      fullname: `${teacher.firstName} ${teacher.lastName}`,
      gender: teacher.gender ? 'مرد' : 'زن',
    };
  }
}
