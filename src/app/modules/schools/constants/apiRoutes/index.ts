const baseUrl = '/api/v1/school';

export const SCHOOLS_API_ROUTES = {
  login: () => `${baseUrl}/login`,
  me: () => `${baseUrl}/me`,

  // edit routes
  editAddress: () => `${baseUrl}/changeAddress`,
  editLoginInfo: () => `${baseUrl}/changeLoginInfo`,
  editInfo: () => `${baseUrl}/editSchool`,

  //verification routes
  managerEmailSendOTPVerification: () => `${baseUrl}/SendEmailOTPForForManagerEmailVerification`,
  managerPhoneSendOTPVerification: () => `${baseUrl}/SendSmsOTPForForManagerMobileVerification`,
  sendEmailOTP: () => `${baseUrl}/SendEmailOTPForLogin`,
  sendSmsOTP: () => `${baseUrl}/SendSmsOTPForLogin`,

  managerEmailVerification: () => `${baseUrl}/VerifyManagerEmail`,
  managerPhoneVerification: () => `${baseUrl}/VerifyManagerMobile`,
  contactEmailVerification: () => `${baseUrl}/VerifyContactEmail`,
  contactPhoneVerification: () => `${baseUrl}/VerifyContactMobile`,
};
