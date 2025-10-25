import { paginatedQueryDefaultValues } from '@/core/constants';
import { IPaginatedResponse } from '@/core/models/service.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ADMIN_API_ROUTES } from '../constants/apiRoutes';
import { ITeacherResponse } from '../pages/teachers/models';

@Injectable({ providedIn: 'root' })
export class AdminTeachersService {
  constructor(private http: HttpClient) {}

  private apiRoutes = ADMIN_API_ROUTES;

  getAll(lastSeen?: string): Observable<IPaginatedResponse<ITeacherResponse>> {
    return this.http.post<IPaginatedResponse<ITeacherResponse>>(this.apiRoutes.teachers.list(), {
      ...paginatedQueryDefaultValues,
      lastSeen,
    });
  }
}
