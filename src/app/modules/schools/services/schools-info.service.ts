import { IAddressRequestPayload } from '@/modules/admin/pages/schools/models/schools';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SCHOOLS_API_ROUTES } from '../constants/apiRoutes';
import { ISchoolInfoRequest, ISchoolLoginInfoRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class SchoolsInfoService {
  constructor(private http: HttpClient) {}

  private apiRoutes = SCHOOLS_API_ROUTES;

  editAddress(request: IAddressRequestPayload): Observable<void> {
    return this.http.post<void>(this.apiRoutes.editAddress(), request);
  }

  editLoginInfo(request: ISchoolLoginInfoRequest): Observable<void> {
    return this.http.post<void>(this.apiRoutes.editLoginInfo(), request);
  }

  editInfo(request: ISchoolInfoRequest): Observable<void> {
    return this.http.post<void>(this.apiRoutes.editInfo(), request);
  }
}
