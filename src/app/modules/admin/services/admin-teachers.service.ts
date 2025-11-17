import { PAGINATED_QUERY_DEFAULT_VALUES } from '@/core/constants';
import { IPaginatedQuery, IPaginatedResponse } from '@/core/models/service.model';
import {
  IApproveSchoolLessonRequestPayload,
  IApproveSchoolRequestPayload,
  IDetachSchoolRequestPayload,
  IRejectSchoolLessonRequestPayload,
  IRejectSchoolRequestPayload,
} from '@/modules/teachers/models';
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

  filterByWithoutSchools(
    paginatedQuery: IPaginatedQuery,
  ): Observable<IPaginatedResponse<IAdminTeacherEntity>> {
    return this.http
      .post<IPaginatedResponse<IAdminTeacherResponse>>(this.apiRoutes.teachers.byWithoutSchools(), {
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
  byLesson(
    lessonId: number,
    paginatedQuery: IPaginatedQuery,
  ): Observable<IPaginatedResponse<IAdminTeacherEntity>> {
    return this.http
      .post<IPaginatedResponse<IAdminTeacherResponse>>(this.apiRoutes.teachers.byLesson(), {
        ...PAGINATED_QUERY_DEFAULT_VALUES,
        ...paginatedQuery,
        lessonId,
      })
      .pipe(
        map((res) => ({
          ...res,
          items: res.items.map(this.mapTeacherData),
        })),
      );
  }
  bySchool(schoolId: string): Observable<IAdminTeacherEntity[]> {
    return this.http
      .post<IAdminTeacherResponse[]>(this.apiRoutes.teachers.bySchool(), {
        schoolId,
      })
      .pipe(map((res) => res.map(this.mapTeacherData)));
  }

  byId(id: string): Observable<IAdminTeacherResponse> {
    return this.http.get<IAdminTeacherResponse>(this.apiRoutes.teachers.byId(id));
  }

  attachLesson(payload: IAttachLessonToTeacherRequest): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.teachers.attachLesson(), payload);
  }
  detachLesson(payload: IDetachLessonFromTeacherRequest): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.teachers.detachLesson(), payload);
  }

  detachSchool(payload: IDetachSchoolRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.teachers.detachSchool(), payload);
  }

  approveSchool(request: IApproveSchoolRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.teachers.approveSchool(), request);
  }
  rejectSchool(request: IRejectSchoolRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.teachers.rejectSchool(), request);
  }
  approveSchoolLesson(request: IApproveSchoolLessonRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.teachers.approveSchoolLesson(), request);
  }
  rejectSchoolLesson(request: IRejectSchoolLessonRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.teachers.rejectSchoolLesson(), request);
  }

  private mapTeacherData(teacher: IAdminTeacherResponse): IAdminTeacherEntity {
    return {
      ...teacher,
      fullname: `${teacher.firstName} ${teacher.lastName}`,
      gender: teacher.gender ? 'مرد' : 'زن',
    };
  }
}
