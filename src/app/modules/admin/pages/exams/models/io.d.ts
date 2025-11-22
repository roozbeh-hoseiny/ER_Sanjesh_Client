export interface IAdminExamRawResponse {}

export interface IExamRequestPayload {
  title: string;
  lessonId: number;
  examTime: string;
  registrationStartTime: string;
  registrationEndTime: string;
  duration: string;
  description: string;
  price: string;
  score: number;
}
