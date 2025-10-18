import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FakeApiService } from 'src/app/core/services/fake-api.service';
import { educationalLevelsAdminTempData } from 'src/_temp/admin/adminTempData';

@Injectable({ providedIn: 'root' })
export class AdminEducationalLevelsFakeService {
  constructor(private fakeApi: FakeApiService) {}

  getEducationalLevels(): Observable<any[]> {
    return this.fakeApi.get(educationalLevelsAdminTempData, 500);
  }
}
