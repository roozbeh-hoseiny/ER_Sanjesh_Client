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
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { IAdminTeacherEntity } from '../models';

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

  paginatedItems = signal<IAdminTeacherEntity[][]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(true);
  lastSeen = signal<string>('');
  activePageIndex = signal<number>(0);
  perPage = signal<number>(40);

  isAddFormVisible = signal<boolean>(false);
  selectedItemForEdit = signal<Maybe<IAdminTeacherEntity>>(null);

  activePageItems = computed(() => {
    const pageIndex = this.activePageIndex();
    const pages = this.paginatedItems();
    return pages[pageIndex] || [];
  });

  constructor(private router: Router) {
    this.breadcrumbService.setItems([adminNamedRoutes.root.meta, adminNamedRoutes.teachers.meta]);
    this.getData();
  }

  ngOnInit(): void {
    this.setColumns();
  }

  private setColumns() {
    this.columns = [
      {
        field: 'fullname',
        header: 'نام دبیر',
        minWidth: '15rem',
      },
      {
        field: 'uniqueId',
        header: 'شناسه',
        width: '5rem',
        minWidth: '5rem',
      },
      {
        field: 'gender',
        header: 'جنسیت',
        width: '4rem',
        minWidth: '4rem',
      },
      {
        field: 'mobile',
        header: 'شماره موبایل',
      },
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

  openEditForm(item: IAdminTeacherEntity) {
    this.selectedItemForEdit.set(item);
    this.isAddFormVisible.set(true);
  }

  onFormSave($event: any) {
    console.log($event);
  }

  toDetails(item: IAdminTeacherEntity) {
    const detailRoute = adminNamedRoutes.teacher.meta.pagePath!(item.id)! as string;

    this.router.navigateByUrl(detailRoute);
  }

  private getAll() {
    this.services
      .getAll({ lastSeen: this.lastSeen(), pageSize: this.perPage() })
      .subscribe((teachers) => {
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
