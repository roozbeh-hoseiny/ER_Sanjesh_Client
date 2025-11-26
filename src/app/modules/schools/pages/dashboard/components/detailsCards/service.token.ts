import { IAdminAgentResponse } from '@/modules/admin/pages/agents/models';
import {
  IAttachAgentToSchoolRequestPayload,
  IAttachCategoryToSchoolRequestPayload,
  IAttachFieldToSchoolRequestPayload,
  IDetachAgentToSchoolRequestPayload,
  IDetachCategoryToSchoolRequestPayload,
  IDetachFieldToSchoolRequestPayload,
} from '@/modules/admin/pages/schools/models/schools';
import {
  ISchoolAddressRequest,
  ISchoolBankInfoAddRequestPayload,
  ISchoolBankInfoEditRequestPayload,
  ISchoolBankInfoRemoveRequestPayload,
  ISchoolContactRequest,
  ISchoolInfoRequest,
} from '@/modules/schools/models';
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ISchoolTeacherRawResponse } from '../../../teachers/models';

export interface SchoolDetailsService {
  getTeachers(schoolUniqueId: string, schoolId: string): Observable<ISchoolTeacherRawResponse[]>;
  searchForAgent(uniqueId: string): Observable<IAdminAgentResponse>;
  editInfo(request: ISchoolInfoRequest): Observable<boolean>;
  editAddress(request: ISchoolAddressRequest): Observable<boolean>;
  addBankInfo(request: ISchoolBankInfoAddRequestPayload): Observable<boolean>;
  editBankInfo(request: ISchoolBankInfoEditRequestPayload): Observable<boolean>;
  removeBankInfo(request: ISchoolBankInfoRemoveRequestPayload): Observable<boolean>;
  updateContact(payload: ISchoolContactRequest): Observable<boolean>;

  enableCanEdit(schoolId: string): Observable<boolean>;
  disableCanEdit(schoolId: string): Observable<boolean>;

  enableCanPurchaseByCredit(schoolId: string): Observable<boolean>;
  disableCanPurchaseByCredit(schoolId: string): Observable<boolean>;

  validateContactEmail(id: string): Observable<boolean>;
  validateContactMobile(id: string): Observable<boolean>;
  validateManagerEmail(id: string): Observable<boolean> | void;
  validateManagerMobile(id: string): Observable<boolean> | void;
  invalidateContactEmail(id: string): Observable<boolean>;
  invalidateContactMobile(id: string): Observable<boolean>;
  invalidateManagerEmail(id: string): Observable<boolean>;
  invalidateManagerMobile(id: string): Observable<boolean>;

  attachAgent(payload: IAttachAgentToSchoolRequestPayload): Observable<boolean>;
  detachAgent(payload: IDetachAgentToSchoolRequestPayload): Observable<boolean>;

  attachCategory(payload: IAttachCategoryToSchoolRequestPayload): Observable<boolean>;
  detachCategory(payload: IDetachCategoryToSchoolRequestPayload): Observable<boolean>;

  attachField(payload: IAttachFieldToSchoolRequestPayload): Observable<boolean>;
  detachField(payload: IDetachFieldToSchoolRequestPayload): Observable<boolean>;
}

export const SCHOOL_DETAILS_SERVICE = new InjectionToken<SchoolDetailsService>(
  'SCHOOL_DETAILS_SERVICE',
);
