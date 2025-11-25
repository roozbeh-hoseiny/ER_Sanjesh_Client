export const adminAgentsApiRoutes = (baseUrl: string) => {
  const agentsBaseUrl = `${baseUrl}/agent`;
  return {
    list: () => `${agentsBaseUrl}/GetAll`,
    byName: () => `${agentsBaseUrl}/FindByName`,
    single: () => `${agentsBaseUrl}/GetOneById`,
    byUniqueId: () => `${agentsBaseUrl}/GetOneByUniqueId`,

    add: () => `${agentsBaseUrl}/AddAgent`,

    //update
    edit: () => `${agentsBaseUrl}/Edit`,
  };
};
