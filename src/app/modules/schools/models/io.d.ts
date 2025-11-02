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
  managerInfo: Omit<IManagerInfo, 'mobileIsVerified' | 'emailIsVerified'>;
  phoneNumber: string;
  boyOrGirl: number;
  examHallCapacity: number;
}

export interface ISchoolLoginInfoRequest {
  username: string;
  password: string;
  email: string;
  mobile: string;
}

export interface IVerifyRequest {
  otp: string;
}

export interface IVerifyManagerEmailRequest extends IVerifyRequest {}
export interface IVerifyManagerMobileRequest extends IVerifyRequest {}

export interface IVerifyContactEmailRequest {}
export interface IVerifyContactMobileRequest {}

export interface ISchoolMeResponse {
  id: string;
  name: string;
  phoneNumber: string;
  address: Address;
  managerInfo: IManagerInfo;
  contactInfo: IManagerInfo;
  username: string;
  passwordMustBeChangedOnNextLogin: boolean;
  canLoginWithMobileOrEmail: boolean;
  boyOrGirl: number;
  examHallCapacity: number;
  isActive: boolean;
  uniqueId: string;
  categories: Category[];
  fieldOfStudies: any[];
}

interface Category {
  id: number;
  title: string;
  ordinal: number;
  parent: null;
  children: any[];
}

export interface ISchoolResponse {
  id: string;
  name: string;
  phoneNumber: string;
  address: Address;
  managerInfo: IManagerInfo;
  contactInfo: IManagerInfo;
  username: string;
  passwordMustBeChangedOnNextLogin: boolean;
  canLoginWithMobileOrEmail: boolean;
  boyOrGirl: number;
  examHallCapacity: number;
  isActive: boolean;
  categories: any[];
  fieldOfStudies: any[];
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

export interface IManagerInfo {
  firstName: string;
  lastName: string;
  gender: boolean;
  mobile: string;
  email: string;
  mobileIsVerified: boolean;
  emailIsVerified: boolean;
}
