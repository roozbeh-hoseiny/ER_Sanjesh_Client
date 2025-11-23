import { BreadcrumbService } from '@/core/services';
import { adminNamedRoutes } from '@/modules/admin/constants';
import { AdminSchoolsService } from '@/modules/admin/services';
import { IColumn } from '@/shared/components/pageDataList/page-data-list.component';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { CategoryAddFormDialogComponent } from '../components';
import { AdminSchoolCategoryListShowComponent } from '../components/categories/admin-school-category-list-show.component';
import { ICategoryFullTreeResponse } from '../models/schools';

@Component({
  selector: 'app-admin-school-categories',
  templateUrl: './admin-school-categories.component.html',
  standalone: true,
  host: { style: 'height: 100cqmin' },
  imports: [
    CommonModule,
    Card,
    AdminSchoolCategoryListShowComponent,
    Button,
    CategoryAddFormDialogComponent,
  ],
})
export class AdminSchoolCategoriesComponent {
  constructor(
    private schoolsService: AdminSchoolsService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
  ) {
    this.breadcrumbService.setItems([
      { ...adminNamedRoutes.root.meta, routerLink: '/admin' },
      { ...adminNamedRoutes.schools.meta, routerLink: '/admin/schools' },
      { ...adminNamedRoutes.categories.meta },
    ]);
    this.getData();
  }

  columns = [] as IColumn[];
  items = signal<ICategoryFullTreeResponse[]>([]);
  loading = signal<boolean>(true);
  lastSeen = signal<string>('');
  activePageIndex = signal<number>(0);
  perPage = signal<number>(40);

  isAddFormVisible = signal<boolean>(false);

  private getData() {
    this.loading.set(true);
    this.getAll();
  }

  openAddForm() {
    this.isAddFormVisible.set(true);
  }

  onSubCategorySubmitted() {
    this.getAll();
  }

  onCategorySubmitted() {
    this.getAll();
  }

  private getAll() {
    this.schoolsService.getCategories().subscribe((categories) => {
      this.items.set(categories);
      this.loading.set(false);
    });
  }
}
