export enum UserRole {
  STUDENT = 'student',
  GRADER = 'grader',
  ADMIN = 'admin',
  SCHOOLS = 'schools',
  TEACHERS = 'teachers',
  SUPERADMIN = 'superadmin',
}

export type TRoles = keyof typeof UserRole;

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
  captcha: string;
}
