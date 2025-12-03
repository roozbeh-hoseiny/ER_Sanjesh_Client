import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiBaseUrlInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Prepare default headers but don't overwrite existing ones
    const defaultHeaders: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };

    const headersToSet: Record<string, string> = {};
    const isFormData = req.body instanceof FormData;
    Object.keys(defaultHeaders).forEach((k) => {
      if (k === 'Content-Type' && isFormData) return;
      if (!req.headers.has(k)) {
        headersToSet[k] = defaultHeaders[k];
      }
    });

    // Only prepend base URL if the request URL is relative (does not start with http or https)
    if (!/^https?:\/\//i.test(req.url)) {
      const apiReq = req.clone({ url: environment.apiBaseUrl + req.url, setHeaders: headersToSet });
      return next.handle(apiReq);
    }

    // If absolute URL, still ensure default headers are present
    if (Object.keys(headersToSet).length > 0) {
      const reqWithHeaders = req.clone({ setHeaders: headersToSet });
      return next.handle(reqWithHeaders);
    }

    return next.handle(req);
  }
}
