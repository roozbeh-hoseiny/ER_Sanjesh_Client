import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ErrorType, getErrorType } from '../interceptors/error.interceptor';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private readonly messageService = inject(MessageService);

  /**
   * Handle HTTP errors with user-friendly notifications
   */
  handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
    } else {
      this.handleGenericError(error);
    }
  }

  /**
   * Handle HTTP errors specifically
   */
  private handleHttpError(error: HttpErrorResponse): void {
    const errorType = getErrorType(error);
    const userMessage = this.getUserMessage(error);

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

  /**
   * Handle generic JavaScript errors
   */
  private handleGenericError(error: any): void {
    console.error('Generic error:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'خطای غیرمنتظره',
      detail: 'یک خطای غیرمنتظره رخ داده است. لطفاً صفحه را تازه‌سازی کنید.',
      life: 5000,
    });
  }

  /**
   * Show network error notification
   */
  private showNetworkError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'خطای اتصال',
      detail: message,
      sticky: true, // Don't auto-close network errors
    });
  }

  /**
   * Show authentication error notification
   */
  private showAuthError(message: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'خطای احراز هویت',
      detail: message,
      life: 4000,
    });
  }

  /**
   * Show authorization error notification
   */
  private showAuthorizationError(message: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'عدم دسترسی',
      detail: message,
      life: 4000,
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
      this.messageService.add({
        severity: 'error',
        summary: 'خطاهای اعتبارسنجی',
        detail: errorList,
        life: 6000,
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'خطای اعتبارسنجی',
        detail: message,
        life: 4000,
      });
    }
  }

  /**
   * Show server error notification
   */
  private showServerError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'خطای سرور',
      detail: message,
      life: 5000,
    });
  }

  /**
   * Show generic error notification
   */
  private showGenericError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'خطا',
      detail: message,
      life: 4000,
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
      // Handle Laravel-style validation errors
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
    this.messageService.add({
      severity: 'success',
      summary: title,
      detail: message,
      life: 3000,
    });
  }

  /**
   * Info notification helper
   */
  showInfo(title: string, message: string): void {
    this.messageService.add({
      severity: 'info',
      summary: title,
      detail: message,
      life: 3000,
    });
  }

  /**
   * Warning notification helper
   */
  showWarning(title: string, message: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: title,
      detail: message,
      life: 4000,
    });
  }
}
