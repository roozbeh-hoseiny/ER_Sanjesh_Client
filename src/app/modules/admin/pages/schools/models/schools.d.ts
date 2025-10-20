export interface ISchoolResponse {
  id: string;
  name: string;
  address: Address;
  managerInfo: ManagerInfo;
  contactInfo: ManagerInfo;
  username: string;
  passwordMustBeChangedOnNextLogin: boolean;
  canLoginWithMobileOrEmail: boolean;
  boyOrGirl: number;
  examHallCapacity: number;
  isActive: boolean;
  categories: any[];
  fieldOfStudies: any[];
}

interface ManagerInfo {
  firstName: string;
  lastName: string;
  gender: boolean;
  mobile: string;
  email: string;
  mobileIsVerified: boolean;
  emailIsVerified: boolean;
}

interface Address {
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
}
