import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../services/error-handler.service';

/**
 * Error handling interceptor
 * - Handles HTTP errors globally
 * - Shows user-friendly error messages
 * - Redirects on authentication errors
 * - Logs errors for debugging
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const errorHandler = inject(ErrorHandlerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'خطای نامشخص رخ داده است';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `خطای کلاینت: ${error.error.message}`;
        console.error('Client-side error:', error.error.message);
      } else {
        // Server-side error
        console.error(`Server error ${error.status}:`, error.error);

        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'درخواست نامعتبر است';
            break;
          case 401:
            errorMessage = 'لطفاً مجدداً وارد شوید';
            // Don't redirect here as auth interceptor handles it
            break;
          case 403:
            errorMessage = 'شما دسترسی به این بخش ندارید';
            break;
          case 404:
            errorMessage = 'منبع مورد نظر یافت نشد';
            break;
          case 422:
            errorMessage = error.error?.message || 'اطلاعات ارسالی نامعتبر است';
            break;
          case 429:
            errorMessage = 'تعداد درخواست‌ها بیش از حد مجاز است';
            break;
          case 500:
            errorMessage = 'خطای داخلی سرور رخ داده است';
            break;
          case 502:
            errorMessage = 'سرور در حال حاضر در دسترس نیست';
            break;
          case 503:
            errorMessage = 'سرویس موقتاً خارج از دسترس است';
            break;
          default:
            if (error.status === 0) {
              errorMessage = 'اتصال به سرور برقرار نشد';
            } else {
              errorMessage = `خطای سرور (${error.status}): ${error.error?.message || error.message}`;
            }
        }
      }

      // Create enhanced error object
      const enhancedError = {
        ...error,
        userMessage: errorMessage,
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
      };

      // Log error details for debugging
      console.group('🚨 HTTP Error Details');
      console.error('URL:', req.url);
      console.error('Method:', req.method);
      console.error('Status:', error.status);
      console.error('Message:', errorMessage);
      console.error('Full Error:', error);
      console.groupEnd();

      // Handle error with notification service
      errorHandler.handleError(enhancedError);

      return throwError(() => enhancedError);
    })
  );
};

/**
 * Show error notification to user
 * Enhanced with Material Design snackbar notifications
 */
function showErrorNotification(message: string, status: number): void {
  // For now, we'll use console.error
  console.error(`🔥 Error ${status}: ${message}`);

  // You can also show browser notification for critical errors
  if (status >= 500) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('خطای سرور', {
        body: message,
        icon: '/favicon.ico',
      });
    }
  }
}

/**
 * Error types for better error handling
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
}

/**
 * Helper function to determine error type
 */
export function getErrorType(error: HttpErrorResponse): ErrorType {
  if (error.error instanceof ErrorEvent) {
    return ErrorType.NETWORK;
  }

  switch (error.status) {
    case 400:
    case 422:
      return ErrorType.VALIDATION;
    case 401:
      return ErrorType.AUTHENTICATION;
    case 403:
      return ErrorType.AUTHORIZATION;
    case 0:
      return ErrorType.NETWORK;
    default:
      return error.status >= 500 ? ErrorType.SERVER : ErrorType.CLIENT;
  }
}
