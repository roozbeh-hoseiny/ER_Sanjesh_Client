import { schoolsTeachersApiRoutes } from './schools-teachers-api.const';
import { schoolsStudentsApiRoutes } from './students-api.const';

const baseUrl = '/api/v1/school';

export const SCHOOLS_API_ROUTES = {
  sendSmsOtpForLogin: () => `${baseUrl}/SendSmsOTPForLogin`,
  loginWithSmsOtp: () => `${baseUrl}/loginBySmsOTP`,
  login: () => `${baseUrl}/login`,
  sendSmsOtpForForgetPassword: () => `${baseUrl}/SendSmsOTPForResetPassword`,
  resetPassword: () => `${baseUrl}/SchoolResetPasswordByMobile`,
  me: () => `${baseUrl}/me`,

  // edit routes
  editAddress: () => `${baseUrl}/changeAddress`,
  editLoginInfo: () => `${baseUrl}/changeLoginInfo`,
  editInfo: () => `${baseUrl}/editSchool`,
  addBankInfo: () => `${baseUrl}/AssignBankAccount`,
  editBankInfo: () => `${baseUrl}/EditBankAccount`,
  removeBankInfo: () => `${baseUrl}/UnassignBankAccount`,

  //verification routes
  managerEmailSendOTPVerification: () => `${baseUrl}/SendEmailOTPForForManagerEmailVerification`,
  managerPhoneSendOTPVerification: () => `${baseUrl}/SendSmsOTPForForManagerMobileVerification`,
  sendEmailOTP: () => `${baseUrl}/SendEmailOTPForLogin`,
  sendSmsOTP: () => `${baseUrl}/SendSmsOTPForLogin`,

  managerEmailVerification: () => `${baseUrl}/VerifyManagerEmail`,
  managerPhoneVerification: () => `${baseUrl}/VerifyManagerMobile`,
  contactEmailVerification: () => `${baseUrl}/VerifyContactEmail`,
  contactPhoneVerification: () => `${baseUrl}/VerifyContactMobile`,

  // teacher lessons management
  assignTeacher: () => `${baseUrl}/AssignTeacher`,
  detachTeacher: () => `${baseUrl}/UnassignTeacher`,

  approveAllLessons: () => `${baseUrl}/ApproveTeacher`,
  rejectAllLessons: () => `${baseUrl}/RejectTeacher`,

  approveLesson: () => `${baseUrl}/ApproveTeacherById`,
  rejectLesson: () => `${baseUrl}/RejectTeacherById`,

  teachers: schoolsTeachersApiRoutes(baseUrl),
  students: schoolsStudentsApiRoutes(baseUrl),
};
