import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ErrorType, getErrorType } from '../interceptors/error.interceptor';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private readonly toastService = inject(ToastService);

  /**
   * Handle HTTP errors with user-friendly notifications
   */
  handleError(error: any): void {
    this.handleHttpError(error);
    // if (error instanceof HttpErrorResponse) {

    // } else {
    //   this.handleGenericError(error);
    // }
  }

  /**
   * Handle HTTP errors specifically
   */
  private handleHttpError(error: HttpErrorResponse): void {
    const errorType = getErrorType(error);
    const userMessage = this.getUserMessage(error);

    if (userMessage) {
      this.toastService.error({
        title: error.error?.title || 'خطا',
        text: userMessage,
      });
    } else {
      switch (errorType) {
        case ErrorType.NETWORK:
          this.showNetworkError(userMessage);
          break;
        case ErrorType.AUTHENTICATION:
          this.showAuthError(userMessage);
          break;
        case ErrorType.AUTHORIZATION:
          this.showAuthorizationError(userMessage);
          break;
        case ErrorType.VALIDATION:
          this.showValidationError(userMessage, error);
          break;
        case ErrorType.SERVER:
          this.showServerError(userMessage);
          break;
        default:
          this.showGenericError(userMessage);
      }
    }
  }

  /**
   * Handle generic JavaScript errors
   */
  private handleGenericError(error: any): void {
    console.error('Generic error:', error);
    this.toastService.error({
      text: 'یک خطای غیرمنتظره رخ داده است. لطفاً صفحه را تازه‌سازی کنید.',
    });
  }

  /**
   * Show network error notification
   */
  private showNetworkError(message: string): void {
    this.toastService.error({
      title: 'خطای اتصال',
      text: message,
    });
  }

  /**
   * Show authentication error notification
   */
  private showAuthError(message: string): void {
    this.toastService.warn({
      title: 'خطای احراز هویت',
      text: message,
    });
  }

  /**
   * Show authorization error notification
   */
  private showAuthorizationError(message: string): void {
    this.toastService.warn({
      title: 'عدم دسترسی',
      text: message,
    });
  }

  /**
   * Show validation error notification
   */
  private showValidationError(message: string, error: HttpErrorResponse): void {
    // Handle field-specific validation errors
    const validationErrors = this.extractValidationErrors(error);

    if (validationErrors.length > 0) {
      const errorList = validationErrors.join(', ');
      this.toastService.error({
        title: 'خطاهای اعتبارسنجی',
        text: errorList,
      });
    } else {
      this.toastService.error({
        title: 'خطای اعتبارسنجی',
        text: message,
      });
    }
  }

  /**
   * Show server error notification
   */
  private showServerError(message: string): void {
    this.toastService.error({
      title: 'خطای سرور',
      text: message,
    });
  }

  /**
   * Show generic error notification
   */
  private showGenericError(message: string): void {
    this.toastService.error({
      text: message,
    });
  }

  /**
   * Extract user-friendly message from error
   */
  private getUserMessage(error: HttpErrorResponse): string {
    if (error.error && typeof error.error === 'object') {
      // Try different common message fields
      return (
        error.error.message ||
        error.error.error ||
        error.error.detail ||
        error.statusText ||
        'خطای نامشخص رخ داده است'
      );
    }

    if (typeof error.error === 'string') {
      return error.error;
    }

    return error.statusText || 'خطای نامشخص رخ داده است';
  }

  /**
   * Extract validation errors from server response
   */
  private extractValidationErrors(error: HttpErrorResponse): string[] {
    const errors: string[] = [];

    if (error.error && typeof error.error === 'object') {
      if (error.error.errors) {
        Object.keys(error.error.errors).forEach((field) => {
          const fieldErrors = error.error.errors[field];
          if (Array.isArray(fieldErrors)) {
            errors.push(...fieldErrors);
          } else {
            errors.push(fieldErrors);
          }
        });
      }

      // Handle other validation error formats
      if (error.error.validationErrors) {
        errors.push(...error.error.validationErrors);
      }
    }

    return errors;
  }

  /**
   * Success notification helper
   */
  showSuccess(title: string, message: string): void {
    this.toastService.success({
      title,
      text: message,
    });
  }

  /**
   * Info notification helper
   */
  showInfo(title: string, message: string): void {
    this.toastService.info({
      title,
      text: message,
    });
  }

  /**
   * Warning notification helper
   */
  showWarning(title: string, message: string): void {
    this.toastService.warn({
      title,
      text: message,
    });
  }
}
