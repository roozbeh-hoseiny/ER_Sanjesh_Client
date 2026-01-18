export const schoolStudentsApiRoutes = (baseUrl: string) => {
  return {
    list: () => `${baseUrl}/GetSchoolStudents`,
    create: () => `${baseUrl}/signupStudent`,
    bulkAdd: () => `${baseUrl}/UploadStudentsExcelFile`,
    checkExist: () => `${baseUrl}/GetStudentInfoByNationalCode`,
    assign: () => `${baseUrl}/School_AassignStudent`,
    unassign: () => `${baseUrl}/School_UnassignStudent`,
  };
};
