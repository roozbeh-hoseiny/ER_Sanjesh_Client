export interface IStudentRawResponse {
  id: number;
  firstName: string;
  lastName: string;
  fatherName: string;
  nationalCode: string;
  idCardNumber: string;
  email: string;
  mobile: string;
  isLeftHanded: boolean;
  isForeigner: boolean;
  religion: string;
  denomination: string;
  religionId: number;
  denominationId: number;
  province: string;
  city: string;
  provinceId: number;
  cityId: number;
  phoneNumber: string;
  isNew: boolean;
  isAlreadyInThisSchool: boolean;
  genderTitle: string;
  genderId: number;
  birthDate: string;
}
export interface IStudentResponse extends IStudentRawResponse {}

export interface IStudentRequest {}
export interface IGetSchoolStudentsRequestPayload {
  academicYear: number;
  educationalLevelId: number;
  fieldOfStudyId: number;
}

export interface IStudentBulkAddResponse {
  firstName: string;
  lastName: string;
  fatherName: string;
  nationalCode: string;
  idCardNumber: string;
  email: string;
  mobile: string;
  isLeftHanded: boolean;
  isForeigner: boolean;
  religion: string;
  denomination: string;
  religionId: number;
  denominationId: number;
  province: string;
  city: string;
  provinceId: number;
  cityId: number;
  phoneNumber: string;
  isNew: boolean;
  isAlreadyInThisSchool: boolean;
  genderTitle: string;
  genderId: number;
  birthDate: string;
  hasError: boolean;
  errorMessages: string[];
}
