export enum UserRole {
  ADMIN = 'admin',
  SCHOOL = 'school',
  TEACHER = 'teacher',
  STUDENTS = 'students',
  GRADER = 'grader',
  SUPERADMIN = 'superadmin',
}

export type TRoles = keyof typeof UserRole;

export interface User {
  fullName: string;
  role: TRoles;
  // id: string;
  // email: string;
  // firstName: string;
  // lastName: string;
  // permissions: Permission[];
  // isActive: boolean;
  // lastLogin?: Date;
  // createdAt: Date;
  // updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

export interface IAuthResponse {
  // user: User;
  token: string;
  fullName: string;
  mustChangePassword: boolean;
  role: string;
  refreshToken: string;
  expiresIn: number;
}

export interface SendSmsOtpCredentials {
  mobile: string;
}
export interface ISendSmsOtpRequestPayload extends SendSmsOtpCredentials {
  captcha: string;
}
export interface LoginOtpCredentials {
  mobile: string;
  otp: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
export interface ILoginRequestPayload extends LoginCredentials {
  captcha: string;
}

export interface IUserLoginInfo {
  username: string;
  password: string;
  mobile: string;
  email: string;
}

export interface ISignupRequestPayload {
  firstName: string;
  lastName: string;
  gender: boolean;
  mobile: string;
  email: string;
  username: string;
  password: string;
}
