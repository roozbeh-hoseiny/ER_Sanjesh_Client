import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FakeApiService {
  /**
   * Simulate a GET request
   */
  get<T>(data: T, ms: number = 500): Observable<T> {
    return of(data).pipe(delay(ms));
  }

  /**
   * Simulate a POST request
   */
  post<T>(data: T, ms: number = 500): Observable<T> {
    return of(data).pipe(delay(ms));
  }

  /**
   * Simulate an error response
   */
  error<T>(message: string, ms: number = 500): Observable<T> {
    return throwError(() => new Error(message)).pipe(delay(ms));
  }
}
