const mdmBaseUrl = `/api/v1/admin/mdm`;
export const adminMdmApiRoutes = () => {
  return {
    educationalLevels: {
      create: `${mdmBaseUrl}/AddEducationLevel`,
      update: `${mdmBaseUrl}/EditEducationLevel`,
    },
    fieldOfStudies: {
      create: `${mdmBaseUrl}/AddFieldOfStudy`,
      update: `${mdmBaseUrl}/EditFieldOfStudy`,
    },
  };
};
