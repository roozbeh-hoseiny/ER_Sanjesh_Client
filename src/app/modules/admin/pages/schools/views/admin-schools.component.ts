import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminSchoolsService } from '../../../services';
import { PageDataListComponent } from '@/shared/components/pageDataList/page-data-list.component';
import { ISchoolResponse } from '../models/schools';
import { BreadcrumbService } from '@/core/services';
import { adminNamedRoutes } from '@/modules/admin/constants';

@Component({
  selector: 'admin-schools',
  standalone: true,
  templateUrl: './admin-schools.component.html',
  imports: [CommonModule, ReactiveFormsModule, PageDataListComponent],
})
export class AdminSchoolsComponent {
  private services = inject(AdminSchoolsService);
  private breadcrumbService = inject(BreadcrumbService);

  columns = [
    { field: 'name', header: 'نام مدرسه' },
    { field: 'address', header: 'آدرس' },
    { field: 'phone', header: 'شماره تماس' },
    { field: 'boyOrGirl', header: 'جنسیت' },
  ];

  paginatedItems = signal<ISchoolResponse[][]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(true);
  lastSeen = signal<string>('');
  activePageIndex = signal<number>(0);

  pageCursors: string[] = [''];

  activePageItems = computed(() => {
    const pageIndex = this.activePageIndex();
    const pages = this.paginatedItems();
    return pages[pageIndex] || [];
  });

  ngOnInit() {
    this.breadcrumbService.setItems([adminNamedRoutes.root.meta, adminNamedRoutes.schools.meta]);

    this.getData();
  }

  getData() {
    this.loading.set(true);
    this.services.getSchools(this.lastSeen()).subscribe((schools) => {
      if (!this.paginatedItems.length) {
        this.totalRecords.set(schools.totalCount);
      }
      this.paginatedItems.update((prev) => {
        return [...prev, schools.items];
      });
      this.lastSeen.set(schools.lastSeen || '');
      this.loading.set(false);
    });
  }

  onPageChange = (event: any) => {
    console.log(event);

    const page = event.page;

    this.activePageIndex.set(page);
    if (this.paginatedItems().length > page) {
      return;
    }

    this.getData();
  };

  openAddSchoolForm() {
    console.log('first');
  }
}
