import { AdminTeachersService } from '@/modules/admin/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SCHOOLS_API_ROUTES } from '../constants/apiRoutes';
import {
  IAttachFieldToSchoolRequestPayload,
  IDetachFieldToSchoolRequestPayload,
  ISchoolAddressRequestPayload,
  ISchoolBankInfoAddRequestPayload,
  ISchoolBankInfoEditRequestPayload,
  ISchoolBankInfoRemoveRequestPayload,
  ISchoolInfoRequest,
  ISchoolLoginInfoRequest,
  ISchoolLoginInfoRequestResponse,
} from '../models';

@Injectable({ providedIn: 'root' })
export class SchoolsInfoService {
  constructor(
    private http: HttpClient,
    private teachersService: AdminTeachersService,
  ) {}

  private apiRoutes = SCHOOLS_API_ROUTES;

  editAddress(request: ISchoolAddressRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.editAddress(), request);
  }

  editLoginInfo(request: ISchoolLoginInfoRequest): Observable<ISchoolLoginInfoRequestResponse> {
    return this.http.post<ISchoolLoginInfoRequestResponse>(this.apiRoutes.editLoginInfo(), request);
  }

  editInfo(request: ISchoolInfoRequest): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.editInfo(), request);
  }

  addBankInfo(request: ISchoolBankInfoAddRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.addBankInfo(), request);
  }
  editBankInfo(request: ISchoolBankInfoEditRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.editBankInfo(), request);
  }
  removeBankInfo(request: ISchoolBankInfoRemoveRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.removeBankInfo(), request);
  }

  assignFieldOfStudy(request: IAttachFieldToSchoolRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.assignField(), request);
  }
  unassignFieldOfStudy(request: IDetachFieldToSchoolRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.unassignField(), request);
  }

  getTeachers(schoolId: string): Observable<any> {
    return this.teachersService.bySchool(schoolId);
  }
}
