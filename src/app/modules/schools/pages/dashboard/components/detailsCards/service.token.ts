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
}

export const SCHOOL_DETAILS_SERVICE = new InjectionToken<SchoolDetailsService>(
  'SCHOOL_DETAILS_SERVICE',
);
