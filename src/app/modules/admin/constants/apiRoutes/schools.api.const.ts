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
    categories: () => `${schoolsBaseUrl}/GetCategoryFullTree`,

    updateContact: () => `${schoolsBaseUrl}/ChangeContactInfo`,

    validateContactEmail: () => `${schoolsBaseUrl}/ValidateContactEmail`,
    validateContactMobile: () => `${schoolsBaseUrl}/ValidateContactMobile`,
    validateManagerEmail: () => `${schoolsBaseUrl}/ValidateManagerEmail`,
    validateManagerMobile: () => `${schoolsBaseUrl}/ValidateManagerMobile`,
    invalidateContactEmail: () => `${schoolsBaseUrl}/InvalidateContactEmail`,
    invalidateContactMobile: () => `${schoolsBaseUrl}/InvalidateContactMobile`,
    invalidateManagerEmail: () => `${schoolsBaseUrl}/InvalidateManagerEmail`,
    invalidateManagerMobile: () => `${schoolsBaseUrl}/InvalidateManagerMobile`,
  };
};
