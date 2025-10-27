import { paginatedQueryDefaultValues } from '@/core/constants';
import { IPaginatedResponse } from '@/core/models/service.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ADMIN_API_ROUTES } from '../constants/apiRoutes';
import {
  ICategoryFullTree,
  ISchoolRequest,
  ISchoolResponse,
} from '../pages/schools/models/schools';

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

  getSchoolsByName(
    name: string,
    lastSeen?: string,
  ): Observable<IPaginatedResponse<ISchoolResponse>> {
    return this.http.post<IPaginatedResponse<ISchoolResponse>>(this.apiRoutes.schools.byName(), {
      ...paginatedQueryDefaultValues,
      lastSeen,
      name,
    });
  }

  getSchoolsByGender(
    boyOrGirl: number,
    lastSeen?: string,
  ): Observable<IPaginatedResponse<ISchoolResponse>> {
    return this.http.post<IPaginatedResponse<ISchoolResponse>>(this.apiRoutes.schools.byGender(), {
      ...paginatedQueryDefaultValues,
      lastSeen,
      boyOrGirl,
    });
  }

  getSchoolsByCategories(
    categoryIds: number[],
    lastSeen?: string,
  ): Observable<IPaginatedResponse<ISchoolResponse>> {
    return this.http.post<IPaginatedResponse<ISchoolResponse>>(
      this.apiRoutes.schools.byCategories(),
      {
        ...paginatedQueryDefaultValues,
        lastSeen,
        categoryIds,
      },
    );
  }

  getSchoolsByRegion(
    regionId: number,
    lastSeen?: string,
  ): Observable<IPaginatedResponse<ISchoolResponse>> {
    return this.http.post<IPaginatedResponse<ISchoolResponse>>(this.apiRoutes.schools.byRegion(), {
      ...paginatedQueryDefaultValues,
      lastSeen,
      regionId,
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

  categories(): Observable<ICategoryFullTree[]> {
    return this.http.get<ICategoryFullTree[]>(this.apiRoutes.schools.categories());
  }
}
