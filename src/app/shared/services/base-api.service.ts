import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../../core/services/config.service';

/**
 * Base API service that uses ConfigService for API calls
 * Extend this class in your feature services for consistent API access
 */
@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  constructor(
    protected http: HttpClient,
    protected configService: ConfigService,
  ) {}

  /**
   * Perform a GET request
   * @param endpoint The API endpoint (e.g., '/users')
   * @param params Optional query parameters
   */
  protected get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    const url = this.configService.getApiUrl(endpoint);
    return this.http.get<T>(url, { params });
  }

  /**
   * Perform a POST request
   * @param endpoint The API endpoint
   * @param body Request body
   */
  protected post<T>(endpoint: string, body: any): Observable<T> {
    const url = this.configService.getApiUrl(endpoint);
    return this.http.post<T>(url, body);
  }

  /**
   * Perform a PUT request
   * @param endpoint The API endpoint
   * @param body Request body
   */
  protected put<T>(endpoint: string, body: any): Observable<T> {
    const url = this.configService.getApiUrl(endpoint);
    return this.http.put<T>(url, body);
  }

  /**
   * Perform a PATCH request
   * @param endpoint The API endpoint
   * @param body Request body
   */
  protected patch<T>(endpoint: string, body: any): Observable<T> {
    const url = this.configService.getApiUrl(endpoint);
    return this.http.patch<T>(url, body);
  }

  /**
   * Perform a DELETE request
   * @param endpoint The API endpoint
   */
  protected delete<T>(endpoint: string): Observable<T> {
    const url = this.configService.getApiUrl(endpoint);
    return this.http.delete<T>(url);
  }
}
