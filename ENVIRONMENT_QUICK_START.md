# Environment Configuration Quick Reference

## 📁 Files Created

```
src/
  environments/
    environment.ts            # Development config
    environment.staging.ts    # Staging config
    environment.prod.ts       # Production config
  app/
    core/
      services/
        config.service.ts     # Centralized config access
    shared/
      services/
        base-api.service.ts   # Base service for API calls
.env.example                  # Environment variables template
ENVIRONMENT.md               # Full documentation
```

## 🚀 Quick Start

1. **Create your local environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your values:**
   ```env
   API_BASE_URL=https://localhost:7148
   ANGULAR_PORT=60749
   ```

3. **Start development:**
   ```bash
   npm start
   ```

## 💡 Usage Examples

### In a Service

```typescript
import { Injectable } from '@angular/core';
import { BaseApiService } from '@app/shared/services/base-api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MyService extends BaseApiService {

  getData(): Observable<any[]> {
    // Automatically uses apiBaseUrl from environment
    return this.get<any[]>('/api/data');
  }
}
```

### Using ConfigService Directly

```typescript
import { ConfigService } from '@app/core/services';

constructor(private config: ConfigService) {
  console.log('API URL:', this.config.apiBaseUrl);
  console.log('Is Production:', this.config.isProduction);
}
```

## 🌍 Environment Commands

| Command | Environment | Use Case |
|---------|-------------|----------|
| `ng serve` | Development | Local development |
| `ng serve --configuration=staging` | Staging | Testing with staging API |
| `ng build` | Development | Build for development |
| `ng build --configuration=staging` | Staging | Build for staging |
| `ng build --configuration=production` | Production | Build for production |

## ⚙️ Configuration Properties

| Property | Type | Description |
|----------|------|-------------|
| `apiBaseUrl` | string | Base URL for API calls |
| `host` | string | Application host |
| `port` | number | Application port |
| `production` | boolean | Production flag |
| `enableLogging` | boolean | Enable console logging |
| `enableDebug` | boolean | Enable debug mode |
| `apiEndpoints` | object | Named API endpoints |

## 🔒 Security Notes

- ✅ `.env` is git-ignored (safe for secrets)
- ✅ `.env.example` is committed (template only)
- ❌ Never commit real API keys or passwords
- ❌ Never commit `.env` file

## 📚 Full Documentation

See [ENVIRONMENT.md](ENVIRONMENT.md) for complete documentation.
