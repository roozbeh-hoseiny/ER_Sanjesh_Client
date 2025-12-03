export const schoolsStudentsApiRoutes = (baseUrl: string) => {
  return {
    list: () => `${baseUrl}/GetSchoolStudents`,
    bulkAdd: () => `${baseUrl}/UploadStudentsExcelFile`,
  };
};
