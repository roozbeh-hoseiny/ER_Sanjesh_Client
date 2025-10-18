import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Configuration service to provide centralized access to environment variables
 */
@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  /**
   * Get the base URL for API calls
   */
  get apiBaseUrl(): string {
    return environment.apiBaseUrl;
  }

  /**
   * Get the application host
   */
  get host(): string {
    return environment.host;
  }

  /**
   * Get the application port
   */
  get port(): number {
    return environment.port;
  }

  /**
   * Check if running in production mode
   */
  get isProduction(): boolean {
    return environment.production;
  }

  /**
   * Check if logging is enabled
   */
  get loggingEnabled(): boolean {
    return environment.enableLogging;
  }

  /**
   * Check if debug mode is enabled
   */
  get debugEnabled(): boolean {
    return environment.enableDebug;
  }

  /**
   * Get a specific API endpoint URL
   * @param endpoint The endpoint key from environment.apiEndpoints
   */
  getApiEndpoint(endpoint: keyof typeof environment.apiEndpoints): string {
    return `${this.apiBaseUrl}${environment.apiEndpoints[endpoint]}`;
  }

  /**
   * Get the full API URL for a given path
   * @param path The API path (should start with /)
   */
  getApiUrl(path: string): string {
    return `${this.apiBaseUrl}${path}`;
  }

  /**
   * Log a message if logging is enabled
   * @param message The message to log
   * @param data Optional data to log
   */
  log(message: string, ...data: any[]): void {
    if (this.loggingEnabled) {
      console.log(`[ConfigService] ${message}`, ...data);
    }
  }
}
