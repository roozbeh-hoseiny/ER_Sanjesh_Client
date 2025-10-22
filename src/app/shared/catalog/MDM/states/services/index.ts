import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { STATES_API_ROUTES } from '../constatns/states.api.const';
import { IStateResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class StatesService {
  constructor(private http: HttpClient) {}

  private apiRoutes = STATES_API_ROUTES;

  getStates(): Observable<IStateResponse[]> {
    return this.http.get<IStateResponse[]>(this.apiRoutes.states());
  }

  getRegionTree(): Observable<IStateResponse[]> {
    return this.http.get<IStateResponse[]>(this.apiRoutes.regionTree());
  }
}
