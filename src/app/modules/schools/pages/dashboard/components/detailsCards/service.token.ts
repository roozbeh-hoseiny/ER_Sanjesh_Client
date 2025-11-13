import {
  IAttachCategoryToSchoolRequestPayload,
  IAttachFieldToSchoolRequestPayload,
  IDetachCategoryToSchoolRequestPayload,
  IDetachFieldToSchoolRequestPayload,
} from '@/modules/admin/pages/schools/models/schools';
import {
  ISchoolAddressRequest,
  ISchoolContactRequest,
  ISchoolInfoRequest,
} from '@/modules/schools/models';
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface SchoolDetailsService {
  editInfo(request: ISchoolInfoRequest): Observable<boolean>;
  editAddress(request: ISchoolAddressRequest): Observable<boolean>;
  updateContact(payload: ISchoolContactRequest): Observable<boolean>;
  validateContactEmail(id: string): Observable<boolean>;
  validateContactMobile(id: string): Observable<boolean>;
  validateManagerEmail(id: string): Observable<boolean> | void;
  validateManagerMobile(id: string): Observable<boolean> | void;
  invalidateContactEmail(id: string): Observable<boolean>;
  invalidateContactMobile(id: string): Observable<boolean>;
  invalidateManagerEmail(id: string): Observable<boolean>;
  invalidateManagerMobile(id: string): Observable<boolean>;

  attachCategory(payload: IAttachCategoryToSchoolRequestPayload): Observable<boolean>;
  detachCategory(payload: IDetachCategoryToSchoolRequestPayload): Observable<boolean>;

  attachField(payload: IAttachFieldToSchoolRequestPayload): Observable<boolean>;
  detachField(payload: IDetachFieldToSchoolRequestPayload): Observable<boolean>;
}

export const SCHOOL_DETAILS_SERVICE = new InjectionToken<SchoolDetailsService>(
  'SCHOOL_DETAILS_SERVICE',
);
