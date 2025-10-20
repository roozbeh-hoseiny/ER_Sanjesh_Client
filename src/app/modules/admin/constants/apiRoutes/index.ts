import { adminMdmApiRoutes } from './mdm.api.const';
import { adminSchoolsApiRoutes } from './schools.api.const';

const baseUrl = '/api/v1/admin';

export const ADMIN_API_ROUTES = {
  login: () => `${baseUrl}/login`,
  schools: adminSchoolsApiRoutes(baseUrl),
  mdm: adminMdmApiRoutes(),
};
