import { Maybe } from '@/core';
import { BreadcrumbService } from '@/core/services';
import { adminNamedRoutes } from '@/modules/admin/constants';
import { AdminTeachersService } from '@/modules/admin/services';
import {
  IColumn,
  PageDataListComponent,
} from '@/shared/components/pageDataList/page-data-list.component';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ITeacherResponse } from '../models';

@Component({
  selector: 'admin-teachers',
  standalone: true,
  templateUrl: './admin-teachers.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageDataListComponent,
    ToggleSwitchModule,
    ButtonModule,
    FormsModule,
  ],
})
export class AdminTeachersComponent {
  private services = inject(AdminTeachersService);
  private breadcrumbService = inject(BreadcrumbService);

  columns = [] as IColumn[];

  checked: boolean = false;

  paginatedItems = signal<ITeacherResponse[][]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(true);
  lastSeen = signal<string>('');
  activePageIndex = signal<number>(0);
  perPage = signal<number>(10);

  isAddFormVisible = signal<boolean>(false);
  selectedItemForEdit = signal<Maybe<ITeacherResponse>>(null);

  activePageItems = computed(() => {
    const pageIndex = this.activePageIndex();
    const pages = this.paginatedItems();
    return pages[pageIndex] || [];
  });

  constructor() {
    this.breadcrumbService.setItems([adminNamedRoutes.root.meta, adminNamedRoutes.teachers.meta]);
    this.getData();
  }

  ngOnInit(): void {
    this.setColumns();
  }

  private setColumns() {
    this.columns = [{ field: 'name', header: 'نام دبیر', minWidth: '15rem' }];
  }

  private getData() {
    this.loading.set(true);
    this.getAll();
  }

  onPageChange = (page: number) => {
    this.activePageIndex.set(page - 1);
    if (this.paginatedItems().length > page) {
      return;
    }

    this.getData();
  };

  openAddForm() {
    this.selectedItemForEdit.set(null);
    this.isAddFormVisible.set(true);
  }

  openEditForm(item: ITeacherResponse) {
    this.selectedItemForEdit.set(item);
    this.isAddFormVisible.set(true);
  }

  onFormSave($event: any) {
    console.log($event);
  }

  private getAll() {
    this.services.getAll(this.lastSeen()).subscribe((teachers) => {
      if (!this.paginatedItems.length) {
        this.totalRecords.set(teachers.totalCount);
      }
      this.paginatedItems.update((prev) => {
        return [...prev, teachers.items];
      });
      this.lastSeen.set(teachers.lastSeen || '');
      this.loading.set(false);
    });
  }
}
