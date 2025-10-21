export const adminSchoolsApiRoutes = (baseUrl: string) => {
  const schoolsBaseUrl = `${baseUrl}/school`;
  return {
    list: () => `${schoolsBaseUrl}/GetAll`,
    byGender: () => `${schoolsBaseUrl}/GetByBoyOrGirl`,
    byCategories: () => `${schoolsBaseUrl}/GetByCategories`,
    byName: () => `${schoolsBaseUrl}/GetByName`,
    byRegion: () => `${schoolsBaseUrl}/GetByRegion`,
    activate: () => `${schoolsBaseUrl}/ActivateSchool`,
    deactivate: () => `${schoolsBaseUrl}/DeactivateSchool`,
    single: () => `${schoolsBaseUrl}/GetOne`,
    add: () => `${schoolsBaseUrl}/AddSchool`,
  };
};
