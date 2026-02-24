export const schoolExamsApiRoutes = (baseUrl: string) => {
  return {
    list: () => `${baseUrl}/GetRegisterableExams`,
    single: (examId: string) => `${baseUrl}/GetExamInfoForRegistration/${examId}`,
    students: () => `${baseUrl}/GetSchoolExamStudents`,
    registerByCoupon: () => `${baseUrl}/RegisterStudentsToExamByCoupon`,
    registerByCredit: () => `${baseUrl}/RegisterStudentsToExamByCredit`,
  };
};
