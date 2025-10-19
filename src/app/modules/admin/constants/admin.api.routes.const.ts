import { adminSchoolsApiRoutes } from './apiRoutes';

const baseUrl = '/api/v1/admin';
const schoolsBaseUrl = `${baseUrl}/school`;

export const ADMIN_API_ROUTES = {
  login: () => `${baseUrl}/login`,
  schools: adminSchoolsApiRoutes(schoolsBaseUrl),
};
