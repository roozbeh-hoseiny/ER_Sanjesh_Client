import { PAGINATED_QUERY_DEFAULT_VALUES } from '@/core/constants';
import { IPaginatedQuery, IPaginatedResponse } from '@/core/models/service.model';
import { ISchoolContactRequest } from '@/modules/schools/models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ADMIN_API_ROUTES } from '../constants/apiRoutes';
import {
  IAdminSchoolResponse,
  ICategoryFullTree,
  ISchoolRequest,
} from '../pages/schools/models/schools';

@Injectable({ providedIn: 'root' })
export class AdminSchoolsService {
  constructor(private http: HttpClient) {}

  private apiRoutes = ADMIN_API_ROUTES;

  getAll(paginatedQuery: IPaginatedQuery): Observable<IPaginatedResponse<IAdminSchoolResponse>> {
    return this.http.post<IPaginatedResponse<IAdminSchoolResponse>>(this.apiRoutes.schools.list(), {
      ...PAGINATED_QUERY_DEFAULT_VALUES,
      ...paginatedQuery,
    });
  }

  filterByName(
    name: string,
    paginatedQuery: IPaginatedQuery,
  ): Observable<IPaginatedResponse<IAdminSchoolResponse>> {
    return this.http.post<IPaginatedResponse<IAdminSchoolResponse>>(
      this.apiRoutes.schools.byName(),
      {
        ...PAGINATED_QUERY_DEFAULT_VALUES,
        ...paginatedQuery,
        name,
      },
    );
  }

  filterByGender(
    boyOrGirl: number,
    paginatedQuery: IPaginatedQuery,
  ): Observable<IPaginatedResponse<IAdminSchoolResponse>> {
    return this.http.post<IPaginatedResponse<IAdminSchoolResponse>>(
      this.apiRoutes.schools.byGender(),
      {
        ...PAGINATED_QUERY_DEFAULT_VALUES,
        ...paginatedQuery,
        boyOrGirl,
      },
    );
  }

  filterByCategories(
    categoryIds: number[],
    paginatedQuery: IPaginatedQuery,
  ): Observable<IPaginatedResponse<IAdminSchoolResponse>> {
    return this.http.post<IPaginatedResponse<IAdminSchoolResponse>>(
      this.apiRoutes.schools.byCategories(),
      {
        ...PAGINATED_QUERY_DEFAULT_VALUES,
        ...paginatedQuery,
        categoryIds,
      },
    );
  }

  filterByRegion(
    regionId: number,
    paginatedQuery: IPaginatedQuery,
  ): Observable<IPaginatedResponse<IAdminSchoolResponse>> {
    return this.http.post<IPaginatedResponse<IAdminSchoolResponse>>(
      this.apiRoutes.schools.byRegion(),
      {
        ...PAGINATED_QUERY_DEFAULT_VALUES,
        ...paginatedQuery,
        regionId,
      },
    );
  }

  addSchool(data?: ISchoolRequest): Observable<IAdminSchoolResponse> {
    return this.http.post<IAdminSchoolResponse>(this.apiRoutes.schools.add(), data);
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

  getOne(schoolId: string): Observable<IAdminSchoolResponse> {
    return this.http.post<IAdminSchoolResponse>(this.apiRoutes.schools.single(), { id: schoolId });
  }

  updateContact(payload: ISchoolContactRequest) {
    return this.http.post<boolean>(this.apiRoutes.schools.updateContact(), payload);
  }
}
