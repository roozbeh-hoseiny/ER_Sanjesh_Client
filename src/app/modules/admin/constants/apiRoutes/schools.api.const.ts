export const adminSchoolsApiRoutes = (baseUrl: string) => {
  const schoolsBaseUrl = `${baseUrl}/school`;
  return {
    list: () => `${schoolsBaseUrl}/GetAll`,
    byGender: () => `${schoolsBaseUrl}/GetByBoyOrGirl`,
    byCategories: () => `${schoolsBaseUrl}/GetByCategories`,
    byName: () => `${schoolsBaseUrl}/GetByName`,
    byRegion: () => `${schoolsBaseUrl}/GetByRegion`,
    byCanUseCredit: () => `${schoolsBaseUrl}/GetCanPurchaseOnCredit`,
    byCanNotUseCredit: () => `${schoolsBaseUrl}/GetCanNotPurchaseOnCredit`,
    byWithoutAgent: () => `${schoolsBaseUrl}/GetWithoutAgent`,
    single: () => `${schoolsBaseUrl}/GetOne`,
    byUniqueId: () => `${schoolsBaseUrl}/GetByUniqueId`,

    add: () => `${schoolsBaseUrl}/AddSchool`,

    //update
    activate: () => `${schoolsBaseUrl}/ActivateSchool`,
    deactivate: () => `${schoolsBaseUrl}/DeactivateSchool`,
    updateInfo: () => `${schoolsBaseUrl}/EditSchool`,
    updateAddress: () => `${schoolsBaseUrl}/ChangeAddress`,
    updateContact: () => `${schoolsBaseUrl}/ChangeContactInfo`,
    attachCategory: () => `${schoolsBaseUrl}/AssignCategory`,
    detachCategory: () => `${schoolsBaseUrl}/UnassignCategory`,
    attachField: () => `${schoolsBaseUrl}/AssignFieldOfStudy`,
    detachField: () => `${schoolsBaseUrl}/UnassignFieldOfStudy`,

    //bank info
    addBankInfo: () => `${schoolsBaseUrl}/AssignBankAccount`,
    editBankInfo: () => `${schoolsBaseUrl}/EditBankAccount`,
    removeBankInfo: () => `${schoolsBaseUrl}/UnassignBankAccount`,

    //categories
    categories: () => `${schoolsBaseUrl}/GetCategoryFullTree`,
    addCategory: () => `${schoolsBaseUrl}/AddRootCategory`,
    addSubCategory: () => `${schoolsBaseUrl}/AddChildCategory`,

    // validations
    validateContactEmail: () => `${schoolsBaseUrl}/ValidateContactEmail`,
    validateContactMobile: () => `${schoolsBaseUrl}/ValidateContactMobile`,
    validateManagerEmail: () => `${schoolsBaseUrl}/ValidateManagerEmail`,
    validateManagerMobile: () => `${schoolsBaseUrl}/ValidateManagerMobile`,
    invalidateContactEmail: () => `${schoolsBaseUrl}/InvalidateContactEmail`,
    invalidateContactMobile: () => `${schoolsBaseUrl}/InvalidateContactMobile`,
    invalidateManagerEmail: () => `${schoolsBaseUrl}/InvalidateManagerEmail`,
    invalidateManagerMobile: () => `${schoolsBaseUrl}/InvalidateManagerMobile`,

    //
  };
};
