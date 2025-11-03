import { PAGINATED_QUERY_DEFAULT_VALUES } from '@/core/constants';
import { IPaginatedQuery, IPaginatedResponse } from '@/core/models/service.model';
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

  getSchools(paginatedQuery: IPaginatedQuery): Observable<IPaginatedResponse<ISchoolResponse>> {
    return this.http.post<IPaginatedResponse<ISchoolResponse>>(this.apiRoutes.schools.list(), {
      ...PAGINATED_QUERY_DEFAULT_VALUES,
      ...paginatedQuery,
    });
  }

  getSchoolsByName(
    name: string,
    paginatedQuery: IPaginatedQuery,
  ): Observable<IPaginatedResponse<ISchoolResponse>> {
    return this.http.post<IPaginatedResponse<ISchoolResponse>>(this.apiRoutes.schools.byName(), {
      ...PAGINATED_QUERY_DEFAULT_VALUES,
      ...paginatedQuery,
      name,
    });
  }

  getSchoolsByGender(
    boyOrGirl: number,
    paginatedQuery: IPaginatedQuery,
  ): Observable<IPaginatedResponse<ISchoolResponse>> {
    return this.http.post<IPaginatedResponse<ISchoolResponse>>(this.apiRoutes.schools.byGender(), {
      ...PAGINATED_QUERY_DEFAULT_VALUES,
      ...paginatedQuery,
      boyOrGirl,
    });
  }

  getSchoolsByCategories(
    categoryIds: number[],
    paginatedQuery: IPaginatedQuery,
  ): Observable<IPaginatedResponse<ISchoolResponse>> {
    return this.http.post<IPaginatedResponse<ISchoolResponse>>(
      this.apiRoutes.schools.byCategories(),
      {
        ...PAGINATED_QUERY_DEFAULT_VALUES,
        ...paginatedQuery,
        categoryIds,
      },
    );
  }

  getSchoolsByRegion(
    regionId: number,
    paginatedQuery: IPaginatedQuery,
  ): Observable<IPaginatedResponse<ISchoolResponse>> {
    return this.http.post<IPaginatedResponse<ISchoolResponse>>(this.apiRoutes.schools.byRegion(), {
      ...PAGINATED_QUERY_DEFAULT_VALUES,
      ...paginatedQuery,
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
