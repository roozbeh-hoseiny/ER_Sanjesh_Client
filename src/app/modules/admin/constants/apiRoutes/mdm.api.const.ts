const mdmBaseUrl = `/api/v1/mdm`;
export const adminMdmApiRoutes = () => {
  return {
    educationLevels: () => `${mdmBaseUrl}/GetAllEducationalLevels`,
    fieldOfStudies: () => `${mdmBaseUrl}/GetAllFieldOfStudies`,
    regions: () => `${mdmBaseUrl}/GetAllRegions`,
    states: () => `${mdmBaseUrl}/GetAllStates`,
  };
};
