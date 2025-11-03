import { ISchoolAddressRequestPayload, ISchoolResponse } from '@/modules/schools/models';

export interface IAdminSchoolResponse extends ISchoolResponse {}

export interface ISchoolRequest {
  name: string;
  address: ISchoolAddressRequestPayload;
  managerInfo: ManagerInfoRequest;
  username: string;
  password: string;
}

export interface ICategoryFullTree {}
