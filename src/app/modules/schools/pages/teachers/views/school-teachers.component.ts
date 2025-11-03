import { Maybe } from '@/core';
import { BreadcrumbService } from '@/core/services';
import { schoolsNamedRoutes } from '@/modules/schools/constants';
import { SchoolsStore } from '@/modules/schools/dataStore';
import { SchoolsTeachersService } from '@/modules/schools/services/schools-teachers.service';
import {
  IColumn,
  PageDataListComponent,
} from '@/shared/components/pageDataList/page-data-list.component';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ISchoolTeachersResponse } from '../models';

@Component({
  selector: 'school-teachers',
  standalone: true,
  templateUrl: './school-teachers.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageDataListComponent,
    ToggleSwitchModule,
    ButtonModule,
    FormsModule,
  ],
})
export class SchoolTeachersComponent {
  private services = inject(SchoolsTeachersService);
  private breadcrumbService = inject(BreadcrumbService);
  private schoolsStore = inject(SchoolsStore);

  columns = [] as IColumn[];

  checked: boolean = false;

  paginatedItems = signal<ISchoolTeachersResponse[][]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(true);
  lastSeen = signal<string>('');
  activePageIndex = signal<number>(0);
  perPage = signal<number>(10);

  isAddFormVisible = signal<boolean>(false);
  selectedItemForEdit = signal<Maybe<ISchoolTeachersResponse>>(null);

  activePageItems = computed(() => {
    const pageIndex = this.activePageIndex();
    const pages = this.paginatedItems();
    return pages[pageIndex] || [];
  });

  constructor() {
    this.breadcrumbService.setItems([
      schoolsNamedRoutes.root.meta,
      schoolsNamedRoutes.teachers.meta,
    ]);
    this.getData();
  }

  ngOnInit(): void {
    this.setColumns();
  }

  private setColumns() {
    this.columns = [
      { field: 'firstName', header: 'نام دبیر' },
      { field: 'lastName', header: 'نام خانوادگی دبیر' },
    ];
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

  openEditForm(item: ISchoolTeachersResponse) {
    this.selectedItemForEdit.set(item);
    this.isAddFormVisible.set(true);
  }

  onFormSave($event: any) {
    console.log($event);
  }

  private getAll() {
    this.services.getAll(this.schoolsStore.info()?.id!, this.lastSeen()).subscribe({
      next: (teachers) => {
        if (!this.paginatedItems.length) {
          this.totalRecords.set(teachers.totalCount);
        }
        this.paginatedItems.update((prev) => {
          return [...prev, teachers.items];
        });
        this.lastSeen.set(teachers.lastSeen || '');
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
