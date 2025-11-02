export const schoolsTeachersApiRoutes = (baseUrl: string) => {
  return {
    list: () => `${baseUrl}/getTeachers`,
  };
};
