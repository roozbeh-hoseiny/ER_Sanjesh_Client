const baseUrl = '/api/v1/MDM';

export const STATES_API_ROUTES = {
  states: () => `${baseUrl}/GetAllStates`,
  stateCities: (stateId: string) => `${baseUrl}/GetCitiesOfState/${stateId}`,
  regionTree: () => `${baseUrl}/GetRegionTree`,
};
