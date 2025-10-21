import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ADMIN_API_ROUTES } from '../constants/apiRoutes';
import { Injectable } from '@angular/core';
import { paginatedQueryDefaultValues } from '@/core/constants';
import { IPaginatedResponse } from '@/core/models/service.model';
import { ISchoolRequest, ISchoolResponse } from '../pages/schools/models/schools';

@Injectable({ providedIn: 'root' })
export class AdminSchoolsService {
  constructor(private http: HttpClient) {}

  private apiRoutes = ADMIN_API_ROUTES;

  getSchools(lastSeen?: string): Observable<IPaginatedResponse<ISchoolResponse>> {
    return this.http.post<IPaginatedResponse<ISchoolResponse>>(this.apiRoutes.schools.list(), {
      ...paginatedQueryDefaultValues,
      lastSeen,
    });
  }

  addSchool(data?: ISchoolRequest): Observable<ISchoolResponse> {
    return this.http.post<ISchoolResponse>(this.apiRoutes.schools.add(), data);
  }

  updateSchoolStatus(schoolId: string, isActive: boolean): Observable<any> {
    const endpoint = isActive
      ? this.apiRoutes.schools.activate()
      : this.apiRoutes.schools.deactivate();
    return this.http.post<any>(endpoint, { id: schoolId });
  }
}
