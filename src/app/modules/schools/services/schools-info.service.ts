import { AdminTeachersService } from '@/modules/admin/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SCHOOLS_API_ROUTES } from '../constants/apiRoutes';
import {
  ISchoolAddressRequestPayload,
  ISchoolBankInfoAddRequestPayload,
  ISchoolBankInfoEditRequestPayload,
  ISchoolBankInfoRemoveRequestPayload,
  ISchoolInfoRequest,
  ISchoolLoginInfoRequest,
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

  editLoginInfo(request: ISchoolLoginInfoRequest): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.editLoginInfo(), request);
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

  getTeachers(schoolId: string): Observable<any> {
    return this.teachersService.bySchool(schoolId);
  }
}
