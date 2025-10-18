// Production environment configuration
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.yourdomain.com',
  host: 'yourdomain.com',
  port: 443,
  apiEndpoints: {
    auth: '/api/auth',
    users: '/api/users',
    // Add more endpoints as needed
  },
  enableLogging: false,
  enableDebug: false,
};
