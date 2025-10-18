# Environment Configuration Guide

This project uses environment files to manage configuration across different environments (development, staging, production).

## Environment Files

- `src/environments/environment.ts` - Development environment (default)
- `src/environments/environment.staging.ts` - Staging environment
- `src/environments/environment.prod.ts` - Production environment

## Configuration Properties

Each environment file contains:

- **production**: Boolean flag indicating if it's a production build
- **apiBaseUrl**: Base URL for API calls (e.g., `https://localhost:7148`)
- **host**: Application host
- **port**: Application port
- **apiEndpoints**: Object containing API endpoint paths
- **enableLogging**: Enable/disable console logging
- **enableDebug**: Enable/disable debug mode

## Usage

### Using ConfigService

The `ConfigService` provides centralized access to environment variables:

```typescript
import { ConfigService } from '@app/core/services';

constructor(private configService: ConfigService) {}

// Get API base URL
const apiUrl = this.configService.apiBaseUrl;

// Get a specific endpoint
const authEndpoint = this.configService.getApiEndpoint('auth');

// Build a full API URL
const fullUrl = this.configService.getApiUrl('/api/custom-endpoint');

// Check environment
if (this.configService.isProduction) {
  // Production-specific logic
}
```

### Using BaseApiService

Extend `BaseApiService` for consistent API calls:

```typescript
import { Injectable } from '@angular/core';
import { BaseApiService } from '@app/shared/services/base-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseApiService {

  getUsers(): Observable<User[]> {
    return this.get<User[]>('/api/users');
  }

  createUser(user: User): Observable<User> {
    return this.post<User>('/api/users', user);
  }
}
```

## Running Different Environments

```bash
# Development (default)
npm start
# or
ng serve

# Staging
ng serve --configuration=staging

# Production
ng build --configuration=production
```

## Environment Variables (.env)

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Then update the values in `.env` with your actual configuration.

**Note**: The `.env` file is git-ignored and should never be committed.

## Updating Environment Files

When adding new configuration properties:

1. Add the property to all environment files
2. Update the `ConfigService` if needed to provide typed access
3. Update this documentation

## Best Practices

1. **Never commit sensitive data** (API keys, passwords) to environment files
2. Use environment variables or secrets management for sensitive data
3. Keep environment files in sync (same properties across all environments)
4. Use the `ConfigService` instead of importing environment files directly
5. Test your application in each environment before deployment
