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
