import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * HTTP Interceptor for token management
 * - Adds Authorization header with Bearer token to requests
 * - Handles token refresh on 401 responses
 * - Prevents duplicate refresh token requests
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Skip auth for certain endpoints
  if (shouldSkipAuth(req.url)) {
    return next(req);
  }

  const token = authService.getToken();

  // Add token to request if available
  const authReq = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      // Handle 401 Unauthorized - token might be expired
      if (error.status === 401 && !isRefreshTokenRequest(req.url)) {
        return handleTokenRefresh(authService, req, next);
      }

      return throwError(() => error);
    })
  );
};

// Subject to track if refresh is in progress
const isRefreshing = new BehaviorSubject<boolean>(false);

/**
 * Handle token refresh logic
 */
function handleTokenRefresh(authService: AuthService, req: any, next: any): Observable<any> {
  if (!isRefreshing.value) {
    isRefreshing.next(true);

    const refreshToken = authService.getRefreshToken();
    if (!refreshToken) {
      isRefreshing.next(false);
      authService.logout();
      return throwError(() => new Error('توکنی یافت نشد'));
    }

    return authService.refreshToken().pipe(
      switchMap((response) => {
        isRefreshing.next(false);

        // Retry original request with new token
        const newAuthReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${response.token}`),
        });

        return next(newAuthReq);
      }),
      catchError((refreshError) => {
        isRefreshing.next(false);
        authService.logout();
        return throwError(() => refreshError);
      })
    );
  } else {
    // Wait for refresh to complete, then retry request
    return isRefreshing.pipe(
      filter((refreshing) => !refreshing),
      take(1),
      switchMap(() => {
        const token = authService.getToken();
        const newAuthReq = token
          ? req.clone({
              headers: req.headers.set('Authorization', `Bearer ${token}`),
            })
          : req;

        return next(newAuthReq);
      })
    );
  }
}

/**
 * Check if the request should skip authentication
 */
function shouldSkipAuth(url: string): boolean {
  const skipAuthUrls = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/verify-email',
    '/api/public/',
  ];

  return skipAuthUrls.some((skipUrl) => url.includes(skipUrl));
}

/**
 * Check if this is a refresh token request
 */
function isRefreshTokenRequest(url: string): boolean {
  return url.includes('/api/auth/refresh');
}
