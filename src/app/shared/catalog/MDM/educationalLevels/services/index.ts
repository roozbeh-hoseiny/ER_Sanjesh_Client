import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EDUCATIONAL_LEVELS_API_ROUTES } from '../constants/educationalLevels.api.const';
import { IEducationalLevelsResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class EducationalLevelsService {
  constructor(private http: HttpClient) {}

  private apiRoutes = EDUCATIONAL_LEVELS_API_ROUTES;

  getAll(): Observable<IEducationalLevelsResponse[]> {
    return this.http.get<IEducationalLevelsResponse[]>(this.apiRoutes.all());
  }
}
