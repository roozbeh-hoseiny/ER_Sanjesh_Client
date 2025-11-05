import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ADMIN_API_ROUTES } from '../constants';

@Injectable({ providedIn: 'root' })
export class AdminMDMService {
  constructor(private http: HttpClient) {}

  private readonly mdmApiRoutes = ADMIN_API_ROUTES.mdm;
}
