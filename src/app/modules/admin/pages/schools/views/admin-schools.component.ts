import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, ViewChild, TemplateRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminSchoolsService } from '../../../services';
import { SchoolGendersTag } from '@/shared/cataloge/schoolsGender/app-school-genders-tag.component';
import {
  IColumn,
  PageDataListComponent,
} from '@/shared/components/pageDataList/page-data-list.component';
import { ISchoolResponse } from '../models/schools';
import { BreadcrumbService } from '@/core/services';
import { adminNamedRoutes } from '@/modules/admin/constants';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { AdminSchoolFormComponent } from '../components/admin-school-form.component';
import { Button } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'admin-schools',
  standalone: true,
  templateUrl: './admin-schools.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageDataListComponent,
    SchoolGendersTag,
    ToggleSwitchModule,
    AdminSchoolFormComponent,
    Button,
    FormsModule,
  ],
})
export class AdminSchoolsComponent {
  private services = inject(AdminSchoolsService);
  private breadcrumbService = inject(BreadcrumbService);
  @ViewChild('boyOrGirl', { static: true }) boyOrGirlTpl!: TemplateRef<any>;
  @ViewChild('status', { static: true }) statusTpl!: TemplateRef<any>;

  columns = [] as IColumn[];

  checked: boolean = false;

  paginatedItems = signal<ISchoolResponse[][]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(true);
  lastSeen = signal<string>('');
  activePageIndex = signal<number>(0);

  isAddSchoolFormVisible = signal<boolean>(false);

  schoolsChangeStatusSchedules = signal<Record<string, boolean>>({});

  activePageItems = computed(() => {
    const pageIndex = this.activePageIndex();
    const pages = this.paginatedItems();
    return pages[pageIndex] || [];
  });

  ngOnInit() {
    this.breadcrumbService.setItems([adminNamedRoutes.root.meta, adminNamedRoutes.schools.meta]);
    this.columns = [
      { field: 'name', header: 'نام مدرسه' },
      { field: 'boyOrGirl', header: 'جنسیت', customDataModel: this.boyOrGirlTpl, width: '10rem' },
      {
        field: 'state',
        header: 'استان',
        customDataModel: (item: ISchoolResponse) => item?.address?.stateName ?? '-',
        width: '12rem',
      },
      {
        field: 'managerInfo',
        header: 'مدیریت',
        customDataModel: (item: ISchoolResponse) => {
          const { firstName, lastName } = item.managerInfo;
          const fullName = [firstName, lastName].filter(Boolean).join(' ');
          return fullName || '-';
        },
      },
      {
        field: 'status',
        header: 'وضعیت',
        customDataModel: this.statusTpl,
        width: '8rem',
      },
    ];
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
    const page = event.page;

    this.activePageIndex.set(page);
    if (this.paginatedItems().length > page) {
      return;
    }

    this.getData();
  };

  openAddSchoolForm() {
    this.isAddSchoolFormVisible.set(true);
  }

  openEditForm(item: ISchoolResponse) {
    this.isAddSchoolFormVisible.set(true);
  }

  toggleStatus(item: ISchoolResponse, checked: boolean) {
    this.schoolsChangeStatusSchedules.update((prev) => ({ ...prev, [item.id]: true }));
    this.services.updateSchoolStatus(item.id, checked).subscribe(() => {
      const updatedSchedules = { ...this.schoolsChangeStatusSchedules() };
      delete updatedSchedules[item.id];
      console.log(updatedSchedules);

      this.schoolsChangeStatusSchedules.update(() => updatedSchedules);
      item.isActive = checked;
    });
  }

  onSchoolFormSave($event: any) {}
}
