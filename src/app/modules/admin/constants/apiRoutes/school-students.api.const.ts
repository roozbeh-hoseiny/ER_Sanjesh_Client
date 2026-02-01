export const adminSchoolStudentsApiRoutes = (baseUrl: string) => {
  return {
    list: () => `${baseUrl}/GetSchoolStudents`,
    // create: () => `${baseUrl}/signupStudent`,
    // bulkAdd: () => `${baseUrl}/UploadStudentsExcelFile`,
    // checkExist: () => `${baseUrl}/GetStudentInfoByNationalCode`,
    assign: () => `${baseUrl}/School_AssignStudent`,
    unassign: () => `${baseUrl}/School_UnassignStudent`,
  };
};
