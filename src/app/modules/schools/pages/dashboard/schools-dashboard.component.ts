import { LayoutService } from '@/layout/service/layout.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SchoolsStore } from '../../dataStore';
import { SchoolAddress } from './components/school-address.component';
import { SchoolInfoComponent } from './components/school-info.component';
import { SchoolManagerComponent } from './components/school-login-info.component';

@Component({
  selector: 'app-schools-dashboard',
  templateUrl: './schools-dashboard.component.html',
  imports: [CommonModule, SchoolAddress, SchoolManagerComponent, SchoolInfoComponent],
})
export class SchoolsDashboardComponent {
  constructor(
    protected schoolStore: SchoolsStore = inject(SchoolsStore),
    protected layoutService: LayoutService = inject(LayoutService),
  ) {}
}
