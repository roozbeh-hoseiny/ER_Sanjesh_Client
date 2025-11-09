export const schoolsTeachersApiRoutes = (baseUrl: string) => {
  return {
    list: () => `${baseUrl}/getTeachers`,
    findByUniqueId: (uniqueId: string) => `${baseUrl}/FindTeacherByUniqueId/${uniqueId}`,
  };
};
