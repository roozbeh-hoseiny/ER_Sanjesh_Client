import { ICheckExistStudentInfo, IStudentAddress, IStudentFieldOfStudy } from './types';

export interface IStudentRawResponse {
  id: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  gender: boolean;
  idCardNumber: string;
  nationalCode: string;
  birthYear: string;
  birthDate: string;
  mobile: string;
  email: string;
  isLeftHanded: boolean;
  isForeigner: boolean;
  religionId: number;
  denominationId: number;
  religionTitle: string;
  denominationTitle: string;
  phoneNumber: string;
  address: IStudentAddress;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  fieldOfStudy: IStudentFieldOfStudy;
}

export interface IStudentResponse extends IStudentRawResponse {}

export interface IStudentRequestPayload {
  firstName: string;
  lastName: string;
  genderId: number;
  birthDate: string;
  nationalCode: string;
  idCardNumber: string;
  fatherName: string;
  email: string;
  mobile: string;
  provinceId: number;
  cityId: number;
  phoneNumber: string;
  isLeftHanded: boolean;
  isForeigner: boolean;
  religionId: number;
  denominationId: number;
  isAlreadyInThisSchool: boolean;
}
export interface IStudentRequestResponse extends IStudentRawResponse {}
export interface IGetSchoolStudentsRequestPayload {
  academicYear: number;
  educationalLevelId: number;
  fieldOfStudyId: number;
  onlyInSchool: boolean;
}

export interface IStudentBulkAddResponse extends Omit<IStudentRawResponse, 'id'> {
  hasError: boolean;
  errorMessages: string[];
}

export interface ICheckExistStudentRequestPayload {
  nationalCode: string;
}
export interface ICheckExistStudentRequestRawResponse {
  exists: boolean;
  studentInfo: ICheckExistStudentInfo;
}
export interface ICheckExistStudentRequestResponse extends ICheckExistStudentRequestRawResponse {}

export interface IAssignExistStudentToSchoolRequestPayload {
  nationalCode: string;
  academicYear: number;
  educationalLevelId: number;
  fieldOfStudyId: number;
}
export interface IAssignExistStudentToSchoolRequestResponse {}

export interface IUnassignExistStudentToSchoolRequestPayload {
  studentId: string;
}
export interface IUnassignExistStudentToSchoolRequestResponse {}
