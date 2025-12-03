import { PAGINATED_QUERY_DEFAULT_VALUES } from '@/core/constants';
import { IPaginatedQuery, IPaginatedResponse } from '@/core/models/service.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { debounceTime, map, Observable } from 'rxjs';
import { ADMIN_API_ROUTES } from '../constants/apiRoutes';
import {
  IAdminAgentRawResponse,
  IAdminAgentRequestPayload,
  IAdminAgentResponse,
  IAdminAgentUpdateRequestPayload,
} from '../pages/agents/models';

@Injectable({ providedIn: 'root' })
export class AdminAgentsService {
  constructor(private http: HttpClient) {}

  private apiRoutes = ADMIN_API_ROUTES;

  getAll(
    paginatedQuery: IPaginatedQuery<number>,
  ): Observable<IPaginatedResponse<IAdminAgentResponse, number>> {
    return this.http
      .post<IPaginatedResponse<IAdminAgentRawResponse, number>>(this.apiRoutes.agents.list(), {
        ...PAGINATED_QUERY_DEFAULT_VALUES,
        ...paginatedQuery,
      })
      .pipe(
        map((res) => ({
          ...res,
          items: res.items.map((item) => ({
            ...item,
            fullname: `${item.firstName} ${item.lastName}`,
          })),
        })),
      );
  }

  searchByName(
    name: string,
    paginatedQuery: IPaginatedQuery<number>,
  ): Observable<IAdminAgentResponse[]> {
    return this.http
      .post<IPaginatedResponse<IAdminAgentRawResponse, number>>(this.apiRoutes.agents.byName(), {
        ...PAGINATED_QUERY_DEFAULT_VALUES,
        ...paginatedQuery,
        name,
      })
      .pipe(
        map((res) => {
          return res.items.map((item) => ({
            ...item,
            fullname: `${item.firstName} ${item.lastName}`,
          }));
        }),
      );
  }

  filterByName(
    name: string,
    paginatedQuery: IPaginatedQuery<number>,
  ): Observable<IPaginatedResponse<IAdminAgentResponse, number>> {
    return this.http
      .post<IPaginatedResponse<IAdminAgentRawResponse, number>>(this.apiRoutes.agents.byName(), {
        ...PAGINATED_QUERY_DEFAULT_VALUES,
        ...paginatedQuery,
        name,
      })
      .pipe(
        debounceTime(300),
        map((res) => ({
          ...res,
          items: res.items.map((item) => ({
            ...item,
            fullname: `${item.firstName} ${item.lastName}`,
          })),
        })),
      );
  }

  add(data?: IAdminAgentRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.agents.add(), data);
  }

  getOne(schoolId: string): Observable<IAdminAgentResponse> {
    return this.http
      .post<IAdminAgentRawResponse>(this.apiRoutes.agents.single(), { id: schoolId })
      .pipe(
        map((item) => ({
          ...item,
          fullname: `${item.firstName} ${item.lastName}`,
        })),
      );
  }

  getByUniqueId(uniqueId: string): Observable<IAdminAgentResponse> {
    return this.http
      .post<IAdminAgentRawResponse>(this.apiRoutes.agents.byUniqueId(), {
        uniqueId,
      })
      .pipe(
        map((item) => ({
          ...item,
          fullname: `${item.firstName} ${item.lastName}`,
        })),
      );
  }

  update(payload: IAdminAgentUpdateRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.agents.edit(), payload);
  }
}
