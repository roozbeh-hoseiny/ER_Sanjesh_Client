export interface ILessonsGroupedByLevel extends IEducationalLevel {
  lessons: {
    id: string;
    title: string;
  };
}

export interface ILessonsInRoot extends IFieldOfStudy {
  fullTitle: string;
  fieldId: string;
  fieldTitle: string;
}

export interface IFieldOfStudy {
  id: number;
  title: string;
  educationLevelId: number;
  educationalLevelTitle: string;
  educationalLevelLevel: string;
}

export interface IEducationalLevel {
  id: number;
  title: string;
  level: string;
}
