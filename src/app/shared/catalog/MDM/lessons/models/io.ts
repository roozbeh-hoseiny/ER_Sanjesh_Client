import { IEducationalLevel, IFieldOfStudy } from './mappedData';

export interface ILessonsRequest {}
export interface ILessonsResponse {
  id: number;
  title: string;
  educationalLevel: IEducationalLevel;
  fieldOfStudy: IFieldOfStudy;
}
