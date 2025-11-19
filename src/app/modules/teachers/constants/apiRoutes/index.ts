const baseUrl = '/api/v1/teacher';

export const TEACHERS_API_ROUTES = {
  login: () => `${baseUrl}/login`,
  signup: () => `${baseUrl}/signup`,
  me: () => `${baseUrl}/me`,

  // edit routes
  editLoginInfo: () => `${baseUrl}/changeLoginInfo`,
  editInfo: () => `${baseUrl}/editSchool`,

  //verification routes
  emailSendOTPVerification: () => `${baseUrl}/SendEmailOTPForForEmailVerification`,
  phoneSendOTPVerification: () => `${baseUrl}/SendSmsOTPForForMobileVerification`,
  sendEmailOTP: () => `${baseUrl}/SendEmailOTPForLogin`,
  sendSmsOTP: () => `${baseUrl}/SendSmsOTPForLogin`,

  emailVerification: () => `${baseUrl}/VerifyEmail`,
  phoneVerification: () => `${baseUrl}/VerifyMobile`,

  approveSchool: () => `${baseUrl}/ApproveTeacherSchool`,
  rejectSchool: () => `${baseUrl}/RejectTeacherSchool`,
};
