// Development environment configuration
export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:7148',
  host: 'localhost',
  port: 60749,
  apiEndpoints: {
    auth: '/api/auth',
    users: '/api/users',
    // Add more endpoints as needed
  },
  enableLogging: true,
  enableDebug: true,
};
