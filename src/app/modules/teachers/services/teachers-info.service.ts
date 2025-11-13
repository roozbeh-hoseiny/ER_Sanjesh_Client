import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TEACHERS_API_ROUTES } from '../constants/apiRoutes';
import {
  IApproveSchoolRequestPayload,
  IRejectSchoolRequestPayload,
  ITeacherInfoRequest,
  ITeacherLoginInfoRequest,
} from '../models';

@Injectable({ providedIn: 'root' })
export class TeachersInfoService {
  constructor(private http: HttpClient) {}

  private apiRoutes = TEACHERS_API_ROUTES;

  editLoginInfo(request: ITeacherLoginInfoRequest): Observable<void> {
    return this.http.post<void>(this.apiRoutes.editLoginInfo(), request);
  }

  editInfo(request: ITeacherInfoRequest): Observable<void> {
    return this.http.post<void>(this.apiRoutes.editInfo(), request);
  }

  approveSchool(request: IApproveSchoolRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.approveSchool(), request);
  }
  rejectSchool(request: IRejectSchoolRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.rejectSchool(), request);
  }
}
