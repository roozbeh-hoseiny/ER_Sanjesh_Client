import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';

/**
 * Logging interceptor for development
 * - Logs all HTTP requests and responses
 * - Measures request duration
 * - Provides detailed debugging information
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();

  // Only log in development mode
  if (!isProductionMode()) {
    // console.group(`🌐 HTTP ${req.method} ${req.url}`);
    // console.log('Request:', {
    //   url: req.url,
    //   method: req.method,
    //   headers: req.headers.keys().reduce((acc, key) => {
    //     // Don't log sensitive headers
    //     if (!isSensitiveHeader(key)) {
    //       acc[key] = req.headers.get(key);
    //     }
    //     return acc;
    //   }, {} as any),
    //   body: req.body,
    // });
  }

  return next(req).pipe(
    tap({
      next: (response) => {
        if (!isProductionMode()) {
          const duration = Date.now() - startTime;
          // console.log(`✅ Response (${duration}ms):`, response);
          console.groupEnd();
        }
      },
      error: (error) => {
        if (!isProductionMode()) {
          const duration = Date.now() - startTime;
          console.error(`❌ Error (${duration}ms):`, error);
          console.groupEnd();
        }
      },
    }),
  );
};

/**
 * Check if we're in production mode
 */
function isProductionMode(): boolean {
  // You can also check environment variables
  return false; // Set to true in production builds
}

/**
 * Check if header contains sensitive information
 */
function isSensitiveHeader(headerName: string): boolean {
  const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];

  return sensitiveHeaders.includes(headerName.toLowerCase());
}
