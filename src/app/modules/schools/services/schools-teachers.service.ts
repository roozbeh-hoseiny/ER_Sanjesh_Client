import { PAGINATED_QUERY_DEFAULT_VALUES } from '@/core/constants';
import { IPaginatedResponse } from '@/core/models/service.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SCHOOLS_API_ROUTES } from '../constants/apiRoutes';
import { ISchoolTeachersResponse } from '../pages/teachers/models';

@Injectable({ providedIn: 'root' })
export class SchoolsTeachersService {
  constructor(private http: HttpClient) {}

  private apiRoutes = SCHOOLS_API_ROUTES;

  getAll(lastSeen?: string): Observable<IPaginatedResponse<ISchoolTeachersResponse>> {
    return this.http.post<IPaginatedResponse<ISchoolTeachersResponse>>(
      this.apiRoutes.teachers.list(),
      {
        ...PAGINATED_QUERY_DEFAULT_VALUES,
        lastSeen,
      },
    );
  }
}
