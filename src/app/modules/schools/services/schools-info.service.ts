import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SCHOOLS_API_ROUTES } from '../constants/apiRoutes';
import {
  ISchoolAddressRequestPayload,
  ISchoolInfoRequest,
  ISchoolLoginInfoRequest,
  ISchoolResponse,
} from '../models';

@Injectable({ providedIn: 'root' })
export class SchoolsInfoService {
  constructor(private http: HttpClient) {}

  private apiRoutes = SCHOOLS_API_ROUTES;

  editAddress(request: ISchoolAddressRequestPayload): Observable<void> {
    return this.http.post<void>(this.apiRoutes.editAddress(), request);
  }

  editLoginInfo(request: ISchoolLoginInfoRequest): Observable<void> {
    return this.http.post<void>(this.apiRoutes.editLoginInfo(), request);
  }

  editInfo(request: ISchoolInfoRequest): Observable<ISchoolResponse> {
    return this.http.post<ISchoolResponse>(this.apiRoutes.editInfo(), request);
  }
}
