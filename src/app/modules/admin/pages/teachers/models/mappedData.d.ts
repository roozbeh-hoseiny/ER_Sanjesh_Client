export interface ITeacherLesson {
  lessonId: number;
  schoolId: string;
  lessonTitle: string;
  schoolTitle: string;
  educationaLevellId: number;
  educationalLevelTitle: string;
  fieldOfStudyId: number;
  fieldOfStudyTitle: string;
}

export interface ITeacherLessonGroupedBySchool {
  schoolId: string;
  schoolTitle: string;
  lessons: Omit<ITeacherLesson, 'schoolId' | 'schoolTitle'>[];
}
