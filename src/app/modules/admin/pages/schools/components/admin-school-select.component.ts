import { AdminSchoolsService } from '@/modules/admin/services';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-school-select',
  templateUrl: './admin-school-select.component.html',
})
export class AdminSchoolSelectComponent {
  constructor(private adminSchoolService: AdminSchoolsService) {}
}
