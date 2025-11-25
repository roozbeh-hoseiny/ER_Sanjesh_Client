export interface IAdminAgentRawResponse {
  id: number;
  firstName: string;
  lastName: string;
  gender: boolean;
  mobile: string;
  email: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  uniqueId: string;
  username: string;
}

export interface IAdminAgentResponse extends IAdminAgentRawResponse {
  fullname: string;
}

export interface IAdminAgentRequestPayload {
  firstName: string;
  lastName: string;
  gender: boolean;
  mobile: string;
  email: string;
}
export interface IAdminAgentUpdateRequestPayload extends IAdminAgentRequestPayload {
  id: number;
}
