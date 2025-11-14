export const adminTeachersApiRoutes = (baseUrl: string) => {
  const teachersBaseUrl = `${baseUrl}/teacher`;
  return {
    list: () => `${teachersBaseUrl}/GetAll`,
    byIds: () => `${teachersBaseUrl}/FindByIds`,
    byId: (id: string) => `${teachersBaseUrl}/GetOneById/${id}`,
    byUniqueId: (id: string) => `${teachersBaseUrl}/GetOneByUniqueId/${id}`,
    byWithoutSchools: () => `${teachersBaseUrl}/FindWithoutSchool`,
    byLesson: () => `${teachersBaseUrl}/FindByLessonId`,
    bySchool: () => `${teachersBaseUrl}/FindBySchoolId`,

    attachLesson: () => `${teachersBaseUrl}/AssignLesson`,
    detachLesson: () => `${teachersBaseUrl}/UnassignLesson`,

    detachSchool: () => `${teachersBaseUrl}/UnassignSchool`,

    approveSchool: () => `${teachersBaseUrl}/ApproveTeacherSchool`,
    rejectSchool: () => `${teachersBaseUrl}/RejectTeacherSchool`,
    approveSchoolLesson: () => `${teachersBaseUrl}/ApproveTeacherSchoolById`,
    rejectSchoolLesson: () => `${teachersBaseUrl}/RejectTeacherSchoolById`,
  };
};
