import {
  ISchoolAddressRequest,
  ISchoolContactRequest,
  ISchoolInfoRequest,
  ISchoolResponse,
} from '@/modules/schools/models';
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface SchoolDetailsService {
  editInfo(request: ISchoolInfoRequest): Observable<ISchoolResponse>;
  editAddress(request: ISchoolAddressRequest): Observable<ISchoolResponse | void>;
  updateContact(payload: ISchoolContactRequest): Observable<boolean>;
  validateContactEmail(id: string): Observable<boolean>;
  validateContactMobile(id: string): Observable<boolean>;
  validateManagerEmail(id: string): Observable<boolean>;
  validateManagerMobile(id: string): Observable<boolean>;
  invalidateContactEmail(id: string): Observable<boolean>;
  invalidateContactMobile(id: string): Observable<boolean>;
  invalidateManagerEmail(id: string): Observable<boolean>;
  invalidateManagerMobile(id: string): Observable<boolean>;
}

export const SCHOOL_DETAILS_SERVICE = new InjectionToken<SchoolDetailsService>(
  'SCHOOL_DETAILS_SERVICE',
);
