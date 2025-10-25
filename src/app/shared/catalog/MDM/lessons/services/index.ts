import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LESSONS_API_ROUTES } from '../constants/lessons.api.const';
import { ILessonsResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class LessonsService {
  constructor(private http: HttpClient) {}

  private apiRoutes = LESSONS_API_ROUTES;

  getAll(): Observable<ILessonsResponse[]> {
    return this.http.get<ILessonsResponse[]>(this.apiRoutes.all());
  }
}
