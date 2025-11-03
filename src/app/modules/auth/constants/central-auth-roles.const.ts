import rolesConst from '@/core/constants/roles.const';

export const CENTRAL_AUTH_ROLES = [
  ...Object.values(rolesConst).filter((role) => role.key !== 'ADMIN'),
];
