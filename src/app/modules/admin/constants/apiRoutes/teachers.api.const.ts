export const adminTeachersApiRoutes = (baseUrl: string) => {
  const teachersBaseUrl = `${baseUrl}/teacher`;
  return {
    list: () => `${teachersBaseUrl}/GetAll`,
    byIds: () => `${teachersBaseUrl}/FindByIds`,
    byId: () => `${teachersBaseUrl}/GetOneById`,
    byUniqueId: () => `${teachersBaseUrl}/GetOneByUniqueId`,
  };
};
