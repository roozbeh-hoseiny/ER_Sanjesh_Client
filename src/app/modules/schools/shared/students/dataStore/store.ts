import { ToastService } from '@/core/services/toast.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractSharedSchoolStudentsManagementStore } from '../../../../../shared/components/modules/students';

@Injectable({ providedIn: 'any' })
export class SchoolStudentsManagementStore extends AbstractSharedSchoolStudentsManagementStore {
  constructor(toastService: ToastService, router: Router, activatedRoute: ActivatedRoute) {
    super(toastService, router, activatedRoute);
    this.setInitialMainFilter();
  }
}
