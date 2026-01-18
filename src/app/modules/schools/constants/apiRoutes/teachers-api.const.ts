export const schoolTeachersApiRoutes = (baseUrl: string) => {
  return {
    list: () => `${baseUrl}/getTeachers`,
    findByUniqueId: (uniqueId: string) => `${baseUrl}/FindTeacherByUniqueId/${uniqueId}`,
  };
};
