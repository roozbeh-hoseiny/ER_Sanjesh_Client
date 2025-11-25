import { NamedRoutes } from '@/core';

export type TAdminAgentsRouteNames = 'agents';

export const adminAgentsNamedRoutes: NamedRoutes<TAdminAgentsRouteNames> = {
  agents: {
    path: 'agents',
    loadComponent: () =>
      import('../../pages/agents/views/agents.component').then((m) => m.AdminAgentsComponent),
    meta: {
      title: 'کارگزاران',
    },
  },
};
