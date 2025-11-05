import {
  ISchoolAddressRequest,
  ISchoolInfoRequest,
  ISchoolResponse,
} from '@/modules/schools/models';
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Minimal service surface required by SchoolDetailsCardsStore.
 * Parent modules (admin / school) can provide their own implementation
 * by binding this token to an object that implements these methods.
 */
export interface SchoolDetailsService {
  editInfo(request: ISchoolInfoRequest): Observable<ISchoolResponse>;
  editAddress(request: ISchoolAddressRequest): Observable<ISchoolResponse | void>;
  updateContact(payload: {
    id: string;
    firstname: string;
    lastname: string;
    gender: boolean;
    email: string;
    mobile: string;
  }): Observable<boolean>;
}

export const SCHOOL_DETAILS_SERVICE = new InjectionToken<SchoolDetailsService>(
  'SCHOOL_DETAILS_SERVICE',
);
