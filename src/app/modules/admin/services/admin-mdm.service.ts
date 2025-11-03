import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ADMIN_API_ROUTES } from '../constants';

@Injectable({ providedIn: 'root' })
export class AdminMDMService {
  constructor(private http: HttpClient) {}

  private readonly mdmApiRoutes = ADMIN_API_ROUTES.mdm;

  getEducationalLevels(): Observable<any[]> {
    return this.http.get<any[]>(this.mdmApiRoutes.educationLevels());
  }

  getFieldOfStudies(): Observable<any[]> {
    return this.http.get<any[]>(this.mdmApiRoutes.fieldOfStudies());
  }

  getRegions(): Observable<any[]> {
    return this.http.get<any[]>(this.mdmApiRoutes.regions());
  }

  getStates(): Observable<any[]> {
    return this.http.get<any[]>(this.mdmApiRoutes.states());
  }
}
