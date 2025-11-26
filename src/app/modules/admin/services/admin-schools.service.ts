import { PAGINATED_QUERY_DEFAULT_VALUES } from '@/core/constants';
import { IPaginatedQuery, IPaginatedResponse } from '@/core/models/service.model';
import {
  ISchoolAddressRequestPayload,
  ISchoolBankInfoAddRequestPayload,
  ISchoolBankInfoEditRequestPayload,
  ISchoolBankInfoRemoveRequestPayload,
  ISchoolContactRequest,
  ISchoolInfoRequest,
} from '@/modules/schools/models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { debounceTime, map, Observable } from 'rxjs';
import { ADMIN_API_ROUTES } from '../constants/apiRoutes';
import {
  IAdminSchoolRawResponse,
  IAdminSchoolResponse,
  IAttachAgentToSchoolRequestPayload,
  IAttachCategoryToSchoolRequestPayload,
  IAttachFieldToSchoolRequestPayload,
  ICategoryFullTreeResponse,
  ICreateCategoryRequestPayload,
  ICreateSubCategoryRequestPayload,
  IDetachAgentToSchoolRequestPayload,
  IDetachCategoryToSchoolRequestPayload,
  IDetachFieldToSchoolRequestPayload,
  ISchoolRequest,
} from '../pages/schools/models/schools';

@Injectable({ providedIn: 'root' })
export class AdminSchoolsService {
  constructor(private http: HttpClient) {}

  private apiRoutes = ADMIN_API_ROUTES;

  getAll(paginatedQuery: IPaginatedQuery): Observable<IPaginatedResponse<IAdminSchoolResponse>> {
    return this.http.post<IPaginatedResponse<IAdminSchoolResponse>>(this.apiRoutes.schools.list(), {
      ...PAGINATED_QUERY_DEFAULT_VALUES,
      ...paginatedQuery,
    });
  }

  filterByName(
    name: string,
    paginatedQuery: IPaginatedQuery,
  ): Observable<IPaginatedResponse<IAdminSchoolResponse>> {
    return this.http
      .post<IPaginatedResponse<IAdminSchoolResponse>>(this.apiRoutes.schools.byName(), {
        ...PAGINATED_QUERY_DEFAULT_VALUES,
        ...paginatedQuery,
        name,
      })
      .pipe(debounceTime(300));
  }

  filterByGender(
    boyOrGirl: number,
    paginatedQuery: IPaginatedQuery,
  ): Observable<IPaginatedResponse<IAdminSchoolResponse>> {
    return this.http.post<IPaginatedResponse<IAdminSchoolResponse>>(
      this.apiRoutes.schools.byGender(),
      {
        ...PAGINATED_QUERY_DEFAULT_VALUES,
        ...paginatedQuery,
        boyOrGirl,
      },
    );
  }

  filterByCategories(
    categoryIds: number[],
    paginatedQuery: IPaginatedQuery,
  ): Observable<IPaginatedResponse<IAdminSchoolResponse>> {
    return this.http.post<IPaginatedResponse<IAdminSchoolResponse>>(
      this.apiRoutes.schools.byCategories(),
      {
        ...PAGINATED_QUERY_DEFAULT_VALUES,
        ...paginatedQuery,
        categoryIds,
      },
    );
  }

  filterByRegion(
    regionId: number,
    paginatedQuery: IPaginatedQuery,
  ): Observable<IPaginatedResponse<IAdminSchoolResponse>> {
    return this.http.post<IPaginatedResponse<IAdminSchoolResponse>>(
      this.apiRoutes.schools.byRegion(),
      {
        ...PAGINATED_QUERY_DEFAULT_VALUES,
        ...paginatedQuery,
        regionId,
      },
    );
  }

  filterByCanUseCredit(
    paginatedQuery: IPaginatedQuery,
  ): Observable<IPaginatedResponse<IAdminSchoolResponse>> {
    return this.http.post<IPaginatedResponse<IAdminSchoolResponse>>(
      this.apiRoutes.schools.byCanUseCredit(),
      {
        ...PAGINATED_QUERY_DEFAULT_VALUES,
        ...paginatedQuery,
      },
    );
  }

  filterByCanNotUseCredit(
    paginatedQuery: IPaginatedQuery,
  ): Observable<IPaginatedResponse<IAdminSchoolResponse>> {
    return this.http.post<IPaginatedResponse<IAdminSchoolResponse>>(
      this.apiRoutes.schools.byCanNotUseCredit(),
      {
        ...PAGINATED_QUERY_DEFAULT_VALUES,
        ...paginatedQuery,
      },
    );
  }

  filterByWithoutAgent(
    paginatedQuery: IPaginatedQuery,
  ): Observable<IPaginatedResponse<IAdminSchoolResponse>> {
    return this.http.post<IPaginatedResponse<IAdminSchoolResponse>>(
      this.apiRoutes.schools.byWithoutAgent(),
      {
        ...PAGINATED_QUERY_DEFAULT_VALUES,
        ...paginatedQuery,
      },
    );
  }

  addSchool(data?: ISchoolRequest): Observable<IAdminSchoolResponse> {
    return this.http.post<IAdminSchoolResponse>(this.apiRoutes.schools.add(), data);
  }

  updateSchoolStatus(schoolId: string, isActive: boolean): Observable<any> {
    const endpoint = isActive
      ? this.apiRoutes.schools.activate()
      : this.apiRoutes.schools.deactivate();
    return this.http.post<any>(endpoint, { id: schoolId });
  }

  getOne(schoolId: string): Observable<IAdminSchoolResponse> {
    return this.http
      .post<IAdminSchoolRawResponse>(this.apiRoutes.schools.single(), { id: schoolId })
      .pipe(
        map((info) => ({
          ...info,
          fieldOfStudies: info.fieldOfStudies.map((field) => ({
            ...field,
            id: field.fieldOfStudyId,
            title: field.fieldOfStudyTitle,
            fullTitle: `${field.fieldOfStudyTitle} - ${field.educationalLevelTitle}`,
          })),
        })),
      );
  }

  getByUniqueId(schoolUniqueId: string) {
    return this.http.post<IAdminSchoolRawResponse>(this.apiRoutes.schools.byUniqueId(), {
      uniqueId: schoolUniqueId,
    });
  }

  updateInfo(payload: ISchoolInfoRequest) {
    return this.http.post<boolean>(this.apiRoutes.schools.updateInfo(), payload);
  }
  updateAddress(payload: ISchoolAddressRequestPayload) {
    return this.http.post<boolean>(this.apiRoutes.schools.updateAddress(), payload);
  }

  enableEdit(schoolId: string) {
    return this.http.post<boolean>(this.apiRoutes.schools.enableEdit(), { id: schoolId });
  }
  disableEdit(schoolId: string) {
    return this.http.post<boolean>(this.apiRoutes.schools.disableEdit(), { id: schoolId });
  }

  enablePurchaseOnCredit(schoolId: string) {
    return this.http.post<boolean>(this.apiRoutes.schools.enablePurchaseOnCredit(), {
      id: schoolId,
    });
  }
  disablePurchaseOnCredit(schoolId: string) {
    return this.http.post<boolean>(this.apiRoutes.schools.disablePurchaseOnCredit(), {
      id: schoolId,
    });
  }

  // bank info methods
  addBankInfo(payload: ISchoolBankInfoAddRequestPayload) {
    return this.http.post<boolean>(this.apiRoutes.schools.addBankInfo(), payload);
  }
  editBankInfo(payload: ISchoolBankInfoEditRequestPayload) {
    return this.http.post<boolean>(this.apiRoutes.schools.editBankInfo(), payload);
  }
  removeBankInfo(payload: ISchoolBankInfoRemoveRequestPayload) {
    return this.http.post<boolean>(this.apiRoutes.schools.removeBankInfo(), payload);
  }

  // contact info methods
  updateContact(payload: ISchoolContactRequest) {
    return this.http.post<boolean>(this.apiRoutes.schools.updateContact(), payload);
  }

  validateContactMobile(schoolId: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.schools.validateContactMobile(), {
      id: schoolId,
    });
  }
  validateContactEmail(schoolId: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.schools.validateContactEmail(), { id: schoolId });
  }

  invalidateContactMobile(schoolId: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.schools.invalidateContactMobile(), {
      id: schoolId,
    });
  }
  invalidateContactEmail(schoolId: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.schools.invalidateContactEmail(), {
      id: schoolId,
    });
  }

  // manager info methods

  validateManagerMobile(schoolId: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.schools.validateManagerMobile(), {
      id: schoolId,
    });
  }
  validateManagerEmail(schoolId: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.schools.validateManagerEmail(), { id: schoolId });
  }

  invalidateManagerMobile(schoolId: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.schools.invalidateManagerMobile(), {
      id: schoolId,
    });
  }
  invalidateManagerEmail(schoolId: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.schools.invalidateManagerEmail(), {
      id: schoolId,
    });
  }

  getCategories(): Observable<ICategoryFullTreeResponse[]> {
    return this.http.get<ICategoryFullTreeResponse[]>(this.apiRoutes.schools.categories());
  }

  addCategory(payload: ICreateCategoryRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.schools.addCategory(), payload);
  }
  addSubCategory(payload: ICreateSubCategoryRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.schools.addSubCategory(), payload);
  }

  attachAgent(payload: IAttachAgentToSchoolRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.schools.attachAgent(), payload);
  }
  detachAgent(payload: IDetachAgentToSchoolRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.schools.detachAgent(), payload);
  }

  attachCategory(payload: IAttachCategoryToSchoolRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.schools.attachCategory(), payload);
  }
  detachCategory(payload: IDetachCategoryToSchoolRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.schools.detachCategory(), payload);
  }

  attachField(payload: IAttachFieldToSchoolRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.schools.attachField(), payload);
  }
  detachField(payload: IDetachFieldToSchoolRequestPayload): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.schools.detachField(), payload);
  }
}
