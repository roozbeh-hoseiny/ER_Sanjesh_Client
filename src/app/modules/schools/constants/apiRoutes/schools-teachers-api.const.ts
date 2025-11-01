export const schoolsTeachersApiRoutes = (baseUrl: string) => {
  const schoolsBaseUrl = `${baseUrl}/teachers`;
  return {
    list: () => `${schoolsBaseUrl}`,
  };
};
