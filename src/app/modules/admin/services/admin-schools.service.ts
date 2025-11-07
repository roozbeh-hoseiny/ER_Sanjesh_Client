import { PAGINATED_QUERY_DEFAULT_VALUES } from '@/core/constants';
import { IPaginatedQuery, IPaginatedResponse } from '@/core/models/service.model';
import { ISchoolContactRequest } from '@/modules/schools/models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { debounceTime, Observable } from 'rxjs';
import { ADMIN_API_ROUTES } from '../constants/apiRoutes';
import {
  IAdminSchoolResponse,
  ICategoryFullTreeResponse,
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
    return this.http
      .post<IPaginatedResponse<IAdminSchoolResponse>>(this.apiRoutes.schools.byName(), {
        ...PAGINATED_QUERY_DEFAULT_VALUES,
        ...paginatedQuery,
        name,
      })
      .pipe(debounceTime(300));
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

  categories(): Observable<ICategoryFullTreeResponse[]> {
    return this.http.get<ICategoryFullTreeResponse[]>(this.apiRoutes.schools.categories());
  }

  getOne(schoolId: string): Observable<IAdminSchoolResponse> {
    return this.http.post<IAdminSchoolResponse>(this.apiRoutes.schools.single(), { id: schoolId });
  }

  // contact info methods
  updateContact(payload: ISchoolContactRequest) {
    return this.http.post<boolean>(this.apiRoutes.schools.updateContact(), payload);
  }

  validateContactMobile(schoolId: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.schools.validateContactMobile(), {
      id: schoolId,
    });
  }
  validateContactEmail(schoolId: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.schools.validateContactEmail(), { id: schoolId });
  }

  invalidateContactMobile(schoolId: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.schools.invalidateContactMobile(), {
      id: schoolId,
    });
  }
  invalidateContactEmail(schoolId: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.schools.invalidateContactEmail(), {
      id: schoolId,
    });
  }

  // manager info methods

  validateManagerMobile(schoolId: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.schools.validateManagerMobile(), {
      id: schoolId,
    });
  }
  validateManagerEmail(schoolId: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.schools.validateManagerEmail(), { id: schoolId });
  }

  invalidateManagerMobile(schoolId: string): Observable<boolean> {
    console.log('invalidateManagerMobile');

    return this.http.post<boolean>(this.apiRoutes.schools.invalidateManagerMobile(), {
      id: schoolId,
    });
  }
  invalidateManagerEmail(schoolId: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.schools.invalidateManagerEmail(), {
      id: schoolId,
    });
  }
}
