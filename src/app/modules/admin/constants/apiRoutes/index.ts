import { adminExamsApiRoutes } from './exam.api.const';
import { adminMdmApiRoutes } from './mdm.api.const';
import { adminSchoolsApiRoutes } from './schools.api.const';
import { adminTeachersApiRoutes } from './teachers.api.const';

const baseUrl = '/api/v1/admin';

export const ADMIN_API_ROUTES = {
  login: () => `${baseUrl}/login`,
  schools: adminSchoolsApiRoutes(baseUrl),
  teachers: adminTeachersApiRoutes(baseUrl),
  exams: adminExamsApiRoutes(baseUrl),
  mdm: adminMdmApiRoutes(),
};
