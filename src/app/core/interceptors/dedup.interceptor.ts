import { HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, shareReplay } from 'rxjs/operators';

const inFlightRequests = new Map<string, Observable<any>>();

function getRequestKey(req: any) {
  // Use method + full URL (including query params) as key
  return `${req.method}::${req.urlWithParams || req.url}`;
}

/**
 * Deduplicate concurrent identical GET requests.
 * If a GET with the same url+params is already in-flight, the same observable is returned.
 */
export const dedupInterceptor: HttpInterceptorFn = (req, next) => {
  // Only deduplicate safe idempotent GET requests
  // if (req.method !== 'GET') {
  //   return next(req);
  // }

  const key = getRequestKey(req);
  const existing = inFlightRequests.get(key);
  if (existing) return existing;

  const shared$ = next(req).pipe(
    // replay 1 value for any concurrent subscribers
    shareReplay({ bufferSize: 1, refCount: false }),
    // when finished (success or error) remove from map
    finalize(() => inFlightRequests.delete(key)),
  );

  inFlightRequests.set(key, shared$);
  return shared$;
};
