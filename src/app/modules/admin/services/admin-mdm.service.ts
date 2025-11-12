import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ADMIN_API_ROUTES } from '../constants';
import {
  IEducationalLevelEditRequestPayload,
  IEducationalLevelRequestPayload,
  IFieldOfStudyEditRequestPayload,
  IFieldOfStudyRequestPayload,
} from '../models/mdm';

@Injectable({ providedIn: 'root' })
export class AdminMDMService {
  constructor(private http: HttpClient) {}

  private readonly mdmApiRoutes = ADMIN_API_ROUTES.mdm;

  addEducationalLevel(payload: IEducationalLevelRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.mdmApiRoutes.educationalLevels.create, payload);
  }
  editEducationalLevel(payload: IEducationalLevelEditRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.mdmApiRoutes.educationalLevels.update, payload);
  }

  addFieldOfStudy(payload: IFieldOfStudyRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.mdmApiRoutes.fieldOfStudies.create, payload);
  }
  editFieldOfStudy(payload: IFieldOfStudyEditRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.mdmApiRoutes.fieldOfStudies.update, payload);
  }
}
