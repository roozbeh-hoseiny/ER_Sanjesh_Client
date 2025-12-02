export const schoolsStudentsApiRoutes = (baseUrl: string) => {
  return {
    list: () => `${baseUrl}/getStudents`,
  };
};
