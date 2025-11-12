export interface IEducationalLevelRequestPayload {
  title: string;
  level: string;
}
export interface IEducationalLevelEditRequestPayload extends IEducationalLevelRequestPayload {
  id: number;
}

export interface IFieldOfStudyRequestPayload {
  title: string;
  educationalId: number;
}
export interface IFieldOfStudyEditRequestPayload extends IFieldOfStudyRequestPayload {
  id: number;
}
