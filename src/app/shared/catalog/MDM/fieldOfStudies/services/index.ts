import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FIELD_OF_STUDIES_API_ROUTES } from '../constants/fieldOfStudies.api.const';
import { IFieldOfStudiesResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class FieldOfStudiesService {
  constructor(private http: HttpClient) {}

  private apiRoutes = FIELD_OF_STUDIES_API_ROUTES;

  getAll(): Observable<IFieldOfStudiesResponse[]> {
    return this.http.get<IFieldOfStudiesResponse[]>(this.apiRoutes.all());
  }
}
