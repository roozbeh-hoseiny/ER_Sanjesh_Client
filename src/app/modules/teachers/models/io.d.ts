export interface ITeacherInfoRequest {
  id: string;
  name: string;
  managerInfo: Omit<ManagerInfo, 'mobileIsVerified' | 'emailIsVerified'>;
  phoneNumber: string;
  boyOrGirl: number;
  examHallCapacity: number;
}

export interface ITeacherLoginInfoRequest {
  username: string;
  password: string;
  email: string;
  mobile: string;
}

export interface IVerifyRequest {
  otp: string;
}

export interface IVerifyEmailRequest extends IVerifyRequest {}
export interface IVerifyMobileRequest extends IVerifyRequest {}

export interface ITeacherMeResponse {
  id: string;
  firstName: string;
  lastName: string;
  gender: boolean;
  mobile: string;
  email: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  uniqueId: string;
  lessons: ITeacherLesson[];
}

export interface ITeacherLesson {
  lessonId: number;
  schoolId: string;
  lessonTitle: string;
  schoolTitle: string;
  educationaLevellId: number;
  educationalLevelTitle: string;
  fieldOfStudyId: number;
  fieldOfStudyTitle: string;
  approved: boolean;
  id: number;
}

export interface IApproveAllLessonsRequestPayload {
  teacherId: string;
  schoolId: string;
}
export interface IRejectAllLessonsRequestPayload extends IApproveAllLessonsRequestPayload {}

export interface IApproveSchoolLessonRequestPayload {
  teacherId: string;
  teacherLessonId: number;
}
export interface IRejectSchoolLessonRequestPayload extends IApproveSchoolLessonRequestPayload {}

export interface IAttachLessonRequestPayload {
  id: string;
  schoolId: string;
  lessonId: number;
}
export interface IDetachLessonRequestPayload {
  teacherId: string;
  schoolId: string;
  lessonId: number;
}

export interface IDetachSchoolRequestPayload {
  teacherId: string;
  schoolId: string;
}
