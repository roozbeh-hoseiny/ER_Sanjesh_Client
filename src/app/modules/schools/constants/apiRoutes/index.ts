import { schoolExamsApiRoutes } from './exams-api.const';
import { schoolStudentsApiRoutes } from './students-api.const';
import { schoolTeachersApiRoutes } from './teachers-api.const';

const baseUrl = '/api/v1/school';

export const SCHOOLS_API_ROUTES = {
  sendVoiceOtpForLogin: () => `${baseUrl}/SendVoiceOTPForLogin`,
  resendVoiceOtpForLogin: () => `${baseUrl}/reSendVoiceOTPForLogin`,
  loginWithVoiceOtp: () => `${baseUrl}/loginByVoiceOTP`,

  sendSmsOtpForLogin: () => `${baseUrl}/SendSmsOTPForLogin`,
  resendSmsOtpForLogin: () => `${baseUrl}/reSendSmsOTPForLogin`,
  loginWithSmsOtp: () => `${baseUrl}/loginBySmsOTP`,

  sendSmsOtpForForgetPassword: () => `${baseUrl}/SendSmsOTPForResetPassword`,
  resendSmsOtpForForgetPassword: () => `${baseUrl}/reSendSmsOTPForResetPassword`,
  resetPassword: () => `${baseUrl}/SchoolResetPasswordByMobile`,

  sendSmsOtpForChangePassword: () => `${baseUrl}/SendSmsOTPForChangePassword`,
  resendSmsOtpForChangePassword: () => `${baseUrl}/ResendSmsOTPForChangePassword`,
  changePassword: () => `${baseUrl}/SchoolChangePassword`,

  login: () => `${baseUrl}/login`,
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
  managerPhoneSendOTPVerification: () => `${baseUrl}/SendSmsOTPForManagerMobileVerification`,
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

  // field of studies
  assignField: () => `${baseUrl}/AssignFieldOfStudy`,
  unassignField: () => `${baseUrl}/UnassignFieldOfStudy`,

  teachers: schoolTeachersApiRoutes(baseUrl),
  students: schoolStudentsApiRoutes(baseUrl),
  exams: schoolExamsApiRoutes(baseUrl),
};
