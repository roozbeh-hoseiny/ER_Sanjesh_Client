export interface ITeacherLesson {
  lessonId: number;
  schoolId: string;
  lessonTitle: string;
  schoolTitle: string;
  educationaLevellId: number;
  educationalLevelTitle: string;
  fieldOfStudyId: number;
  fieldOfStudyTitle: string;
  id: number;
}

export interface ITeacherLessonGroupedBySchool {
  schoolId: string;
  schoolTitle: string;
  lessons: Omit<ITeacherLesson, 'schoolId' | 'schoolTitle'>[];
}
