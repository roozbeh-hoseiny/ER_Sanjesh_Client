export interface ICheckExistStudentInfo {
  id: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  gender: boolean;
  idCardNumber: string;
  nationalCode: string;
  birthDate: string;
}

export interface IStudentFieldOfStudy {
  educationalLevelId: number;
  educationalLevelTitle: string;
  educationalLevelLevel: string;
  fieldOfStudyId: number;
  fieldOfStudyTitle: string;
}

export interface IStudentAddress {
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
