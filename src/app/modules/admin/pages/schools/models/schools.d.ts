import { ISchoolAddressRequestPayload, ISchoolResponse } from '@/modules/schools/models';

export interface IAdminSchoolResponse extends ISchoolResponse {}

export interface ISchoolRequest {
  name: string;
  address: ISchoolAddressRequestPayload;
  managerInfo: ManagerInfoRequest;
  username: string;
  password: string;
}
export interface ICategoryFullTreeResponse {
  id: number;
  title: string;
  ordinal: number;
  parent: number;
  children: ICategoryFullTreeResponse[];
}
export interface ICategoryFullTreeMapped
  extends Omit<ICategoryFullTreeResponse, 'children' | 'title' | 'parent'> {
  label: string;
  key: string;
  children: ICategoryFullTreeMapped[];
}

export interface ICreateCategoryRequestPayload {
  title: string;
  ordinal: number;
}
export interface ICreateSubCategoryRequestPayload {
  title: string;
  parentId: number;
}

export interface IAttachCategoryToSchoolRequestPayload {
  id: string;
  categoryId: number;
}
export interface IDetachCategoryToSchoolRequestPayload
  extends IAttachCategoryToSchoolRequestPayload {}

export interface IAttachFieldToSchoolRequestPayload {
  id: string;
  fieldOfStudyId: number;
}
export interface IDetachFieldToSchoolRequestPayload extends IAttachFieldToSchoolRequestPayload {}
