import { AuthStore } from '@/modules/auth/state';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

/**
 * HTTP Interceptor for token management
 * - Adds Authorization header with Bearer token to requests
 * - Handles token refresh on 401 responses
 * - Prevents duplicate refresh token requests
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);

  // Skip auth for certain endpoints
  if (shouldSkipAuth(req.url)) {
    return next(req);
  }

  const token = authStore.getToken();

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
        return handleTokenRefresh(authStore, req, next);
      }

      return throwError(() => error);
    }),
  );
};

// Subject to track if refresh is in progress
const isRefreshing = new BehaviorSubject<boolean>(false);

/**
 * Handle token refresh logic
 */
function handleTokenRefresh(authStore: AuthStore, req: any, next: any): Observable<any> {
  if (!isRefreshing.value) {
    isRefreshing.next(true);

    const refreshToken = authStore.refreshToken();
    if (!refreshToken) {
      isRefreshing.next(false);
      authStore.logout();
      return throwError(() => new Error('توکنی یافت نشد'));
    }

    return authStore.refreshAuthToken().pipe(
      switchMap((response) => {
        isRefreshing.next(false);

        if (response == null) {
          authStore.logout();
          return throwError(() => new Error('توکنی یافت نشد'));
        }

        // Retry original request with new token
        const newAuthReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${response.token}`),
        });

        return next(newAuthReq);
      }),
      catchError((refreshError) => {
        isRefreshing.next(false);
        authStore.logout();
        return throwError(() => refreshError);
      }),
    );
  } else {
    // Wait for refresh to complete, then retry request
    return isRefreshing.pipe(
      filter((refreshing) => !refreshing),
      take(1),
      switchMap(() => {
        const token = authStore.getToken();
        const newAuthReq = token
          ? req.clone({
              headers: req.headers.set('Authorization', `Bearer ${token}`),
            })
          : req;

        return next(newAuthReq);
      }),
    );
  }
}

/**
 * Check if the request should skip authentication
 */
function shouldSkipAuth(url: string): boolean {
  const skipAuthUrls = ['/captcha', '/api/v1/mdm', '/login'];

  return skipAuthUrls.some((skipUrl) => url.includes(skipUrl));
}

/**
 * Check if this is a refresh token request
 */
function isRefreshTokenRequest(url: string): boolean {
  return url.includes('/api/auth/refresh');
}
