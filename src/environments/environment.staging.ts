// Staging environment configuration
export const environment = {
  production: false,
  apiBaseUrl: 'https://staging-api.yourdomain.com',
  host: 'staging.yourdomain.com',
  port: 443,
  apiEndpoints: {
    auth: '/api/auth',
    users: '/api/users',
    // Add more endpoints as needed
  },
  enableLogging: true,
  enableDebug: true,
};
