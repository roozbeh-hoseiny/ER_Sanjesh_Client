import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TEACHERS_API_ROUTES } from '../constants/apiRoutes';
import { ISchoolInfoRequest, ISchoolLoginInfoRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class SchoolsInfoService {
  constructor(private http: HttpClient) {}

  private apiRoutes = TEACHERS_API_ROUTES;

  editLoginInfo(request: ISchoolLoginInfoRequest): Observable<void> {
    return this.http.post<void>(this.apiRoutes.editLoginInfo(), request);
  }

  editInfo(request: ISchoolInfoRequest): Observable<void> {
    return this.http.post<void>(this.apiRoutes.editInfo(), request);
  }
}
