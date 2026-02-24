import { ILessonsResponse } from '@/shared/catalog';
import { IStudentResponse } from '@/shared/components/modules';

export interface ISchoolExamsRawResponse {
  id: string;
  title: string;
  lessonId: number;
  examTime: string;
  registrationStartTime: string;
  registrationEndTime: string;
  duration: string;
  description: string;
  price: string;
  score: number;
  status: number;
  statusTitle: string;
  lessonInfo: ILessonsResponse;
  academicYear: number;
}
export interface ISchoolExamsResponse extends ISchoolExamsRawResponse {}

export interface ISchoolExamDetailsRawResponse {
  examId: string;
  examTitle: string;
  lessonId: number;
  examTime: string;
  registrationStartTime: string;
  registrationEndTime: string;
  examDuration: string;
  examDescription: string;
  examPrice: string;
  examScore: number;
  examStatus: number;
  examStatusTitle: string;
  educationalLevelTitle: string;
  fieldOfStudyTitle: string;
  lessonTitle: string;
  discountValue: string;
  discountPercent: string;
  conductExam: boolean;
  isExamInSchoolCity: boolean;
  netPrice: string;
  remainedCoupon: number;
  remainedCredit: string;
  canUseCoupon: boolean;
  canUseCredit: boolean;
  educationalLevelId: number;
  fieldOfStudyId: number;
}

export interface ISchoolExamDetailsResponse extends ISchoolExamDetailsRawResponse {}

export interface ISchoolStudentWithExamsInfoRawResponse {
  registeredInExam: boolean;
  registerTime: string;
  registrationMethod: number;
  registrationMethodTitle: string;
  studentInfo: IStudentResponse;
}
export interface ISchoolStudentWithExamsInfoResponse
  extends ISchoolStudentWithExamsInfoRawResponse {}
