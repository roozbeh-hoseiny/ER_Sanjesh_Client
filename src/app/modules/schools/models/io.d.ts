import { Maybe } from '@/core';

export interface ISchoolAddressRequest {
  id: string;
  regionId: number;
  address: string;
  postalCode: string;
  number: string;
  latitude: string;
  longitude: string;
  zoom: number;
}

export interface ISchoolInfoRequest {
  id: string;
  name: string;
  managerInfo: Omit<ISchoolManagerInfo, 'mobileIsVerified' | 'emailIsVerified'>;
  phoneNumber: string;
  boyOrGirl: number;
  conductExam: boolean;
  examApplicantTypeId: number;
  scannerType?: string;
  scannerName?: string;
  examHallCapacity: number;
}

export interface ISchoolContactRequest {
  id: string;
  firstname: string;
  lastname: string;
  gender: boolean;
  email: string;
  mobile: string;
}

export interface ISchoolLoginInfoRequest {
  username: string;
  password: string;
  email: string;
  mobile: string;
}

export interface ISchoolLoginInfoRequestResponse {
  done: boolean;
}

export interface IVerifyRequest {
  otp: string;
}

export interface IVerifyManagerEmailRequest extends IVerifyRequest {}
export interface IVerifyManagerMobileRequest extends IVerifyRequest {}

export interface IVerifyContactEmailRequest {}
export interface IVerifyContactMobileRequest {}

export interface ISchoolRawResponse {
  id: string;
  name: string;
  phoneNumber: string;
  address: Address;
  managerInfo: ISchoolManagerInfo;
  contactInfo: ISchoolManagerInfo;
  username: string;
  passwordMustBeChangedOnNextLogin: boolean;
  canLoginWithMobileOrEmail: boolean;
  boyOrGirl: number;
  examHallCapacity: number;
  isActive: boolean;
  uniqueId: string;
  conductExam: boolean;
  examApplicantTypeId: number;
  examApplicantTypeTitle: number;
  hasScanner: boolean;
  scannerName: string;
  scannerType: string;
  categories: ISchoolCategory[];
  fieldOfStudies: SchoolsFieldOfStudyRaw[];
  bankAccounts: ISchoolBankInfo[];
  canBuyExamByCredit: boolean;
  agentInfo: Maybe<any>;
  remainedCredit: string;
  canEdit: boolean;
  canRegisterToExam: boolean;
}
export interface ISchoolResponse extends Omit<ISchoolRawResponse, 'fieldOfStudies'> {
  fieldOfStudies: SchoolsFieldOfStudy[];
}

export interface ISchoolMeRawResponse extends ISchoolRawResponse {}
export interface ISchoolMeResponse extends Omit<ISchoolMeRawResponse, 'fieldOfStudies'> {
  fieldOfStudies: SchoolsFieldOfStudy[];
}

export interface ISchoolCategory {
  id: number;
  title: string;
  ordinal: number;
  parent: number;
  children: ISchoolCategory[];
}

export interface ISchoolAddress {
  regionId: number;
  address: string;
  postalCode: string;
  number: string;
  latitude: string;
  longitude: string;
  zoom: number;
  countryName: string;
  stateName: string;
  cityName: string;
  districtName: string;
  regionType: number;
}

export interface ISchoolManagerInfo {
  firstName: string;
  lastName: string;
  gender: boolean;
  mobile: string;
  email: string;
  mobileIsVerified: boolean;
  emailIsVerified: boolean;
}
export interface ISchoolContactInfo extends ISchoolManagerInfo {}

export interface ISchoolEducationalLevelsResponse {
  educationalLevelId: number;
  educationalLevelTitle: string;
  educationalLevelLevel: string;
  fieldOfStudyId: number;
  fieldOfStudyTitle: string;
}

export interface ISchoolAddressRequestPayload {
  regionId: number;
  address: string;
  postalCode: string;
  number: string;
  latitude: string;
  longitude: string;
}
interface SchoolsFieldOfStudyRaw {
  educationalLevelId: number;
  educationalLevelTitle: string;
  educationalLevelLevel: string;
  fieldOfStudyId: number;
  fieldOfStudyTitle: string;
}
interface SchoolsFieldOfStudy
  extends Omit<SchoolsFieldOfStudyRaw, 'fieldOfStudyId' | 'fieldOfStudyTitle'> {
  id: number;
  title: string;
  fullTitle: string;
}
interface ISchoolBankInfo {
  id: number;
  bankTypeId: number;
  bankName: string;
  branchCode: string;
  branchName: string;
  ownerName: string;
  depositeNumber: string;
  sheba: string;
}

export interface ISchoolBankInfoAddRequestPayload {
  bankTypeId: number;
  bankName: string;
  branchCode: string;
  branchName: string;
  ownerName: string;
  depositeNumber: string;
  sheba: string;
}
export interface ISchoolBankInfoEditRequestPayload extends ISchoolBankInfoAddRequestPayload {
  id: string;
  bankAccountId: number;
}

export interface ISchoolBankInfoRemoveRequestPayload {
  id: string;
  bankAccountId: number;
}
