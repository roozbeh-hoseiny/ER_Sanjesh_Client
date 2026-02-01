import { adminSchoolStudentsApiRoutes } from './school-students.api.const';

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
    enableEdit: () => `${schoolsBaseUrl}/EnableEdit`,
    disableEdit: () => `${schoolsBaseUrl}/DisableEdit`,

    updateContact: () => `${schoolsBaseUrl}/ChangeContactInfo`,
    attachAgent: () => `${schoolsBaseUrl}/AssignAgent`,
    detachAgent: () => `${schoolsBaseUrl}/UnassignAgent`,
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

    //credits and coupons
    enablePurchaseOnCredit: () => `${schoolsBaseUrl}/EnablePurchaseOnCredit`,
    disablePurchaseOnCredit: () => `${schoolsBaseUrl}/DisablePurchaseOnCredit`,
    increaseCredit: () => `${schoolsBaseUrl}/IncreaseCredit`,
    decreaseCredit: () => `${schoolsBaseUrl}/WithdrawCredit`,
    editCredit: () => `${schoolsBaseUrl}/SetRemainedCredit`,
    activateCredit: () => `${schoolsBaseUrl}/EnablePurchaseOnCredit`,
    deactivateCredit: () => `${schoolsBaseUrl}/DisablePurchaseOnCredit`,

    enablePurchaseOnCoupon: () => `${schoolsBaseUrl}/EnablePurchaseOnCoupon`,
    disablePurchaseOnCoupon: () => `${schoolsBaseUrl}/DisablePurchaseOnCoupon`,
    increaseCoupon: () => `${schoolsBaseUrl}/IncreaseCoupon`,
    decreaseCoupon: () => `${schoolsBaseUrl}/WithdrawCoupon`,
    editCoupon: () => `${schoolsBaseUrl}/SetRemainedCoupon`,
    activateCoupon: () => `${schoolsBaseUrl}/EnablePurchaseOnCoupon`,
    deactivateCoupon: () => `${schoolsBaseUrl}/DisablePurchaseOnCoupon`,

    students: adminSchoolStudentsApiRoutes(schoolsBaseUrl),
    //
  };
};
