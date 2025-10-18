import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../services/base-api.service';

export interface EducationalLevel {
  id: number;
  title: string;
  level: string;
}

/**
 * Service for managing educational levels
 */
@Injectable({
  providedIn: 'root',
})
export class EducationLevelsService extends BaseApiService {
  private readonly endpoint = '/api/v1/MDM/GetAllEducationalLevels';

  /**
   * Get all educational levels
   */
  getAll(): Observable<EducationalLevel[]> {
    return this.get<EducationalLevel[]>(this.endpoint);
  }
}
