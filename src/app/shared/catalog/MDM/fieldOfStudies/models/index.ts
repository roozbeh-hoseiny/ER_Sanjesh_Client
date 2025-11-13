export interface IFieldOfStudiesRawResponse {
  educationalLevelId: number;
  educationalLevelTitle: string;
  educationalLevelLevel: string;
  id: number;
  title: string;
}
export interface IFieldOfStudiesResponse extends IFieldOfStudiesRawResponse {
  fullTitle: string;
}
export interface IFieldOfStudiesRequest {}
