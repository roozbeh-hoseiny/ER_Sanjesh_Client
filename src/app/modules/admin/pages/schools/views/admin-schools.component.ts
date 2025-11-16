import { Maybe } from '@/core';
import { BreadcrumbService } from '@/core/services';
import { adminNamedRoutes } from '@/modules/admin/constants';
import { SchoolGendersTag } from '@/shared/catalog/schoolsGender/app-school-genders-tag.component';
import {
  IColumn,
  PageDataListComponent,
} from '@/shared/components/pageDataList/page-data-list.component';
import { CommonModule } from '@angular/common';
import { Component, signal, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToggleSwitchChangeEvent, ToggleSwitchModule } from 'primeng/toggleswitch';
import { AdminSchoolsService } from '../../../services';
import { AdminSchoolFormComponent } from '../components/admin-school-form.component';
import { AdminSchoolsFilterComponent } from '../components/admin-schools-filter.component';
import { IAdminSchoolResponse } from '../models/schools';
import { SchoolsStore } from '../store/schools.store';

@Component({
  selector: 'admin-schools',
  standalone: true,
  templateUrl: './admin-schools.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageDataListComponent,
    SchoolGendersTag,
    AdminSchoolFormComponent,
    FormsModule,
    ToggleSwitchModule,
    AdminSchoolsFilterComponent,
    ProgressSpinnerModule,
    ConfirmPopupModule,
  ],
  providers: [ConfirmationService],
})
export class AdminSchoolsComponent {
  constructor(
    private store: SchoolsStore,
    private services: AdminSchoolsService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private confirmationService: ConfirmationService,
  ) {
    this.breadcrumbService.setItems([adminNamedRoutes.root.meta, adminNamedRoutes.schools.meta]);
  }

  @ViewChild('boyOrGirl', { static: true }) boyOrGirlTpl!: TemplateRef<any>;
  @ViewChild('status', { static: true }) statusTpl!: TemplateRef<any>;

  columns = [] as IColumn[];

  isAddSchoolFormVisible = signal<boolean>(false);
  schoolsChangeStatusSchedules = signal<Record<string, boolean>>({});
  selectedSchoolForEdit = signal<Maybe<IAdminSchoolResponse>>(null);

  get isFiltered() {
    return this.store.isFiltered();
  }

  get activePageItems() {
    return this.store.activePageItems();
  }

  get loading() {
    return this.store.loading();
  }

  get totalRecords() {
    return this.store.totalRecords();
  }
  get activePageIndex() {
    return this.store.activePageIndex();
  }
  get perPage() {
    return this.store.perPage();
  }

  onPageChange(page: number) {
    this.store.onPageChange(page);
  }

  onSearch(search: string) {
    this.store.onSearch(search);
  }
  onGenderFilter(genderType: Maybe<number>) {
    this.store.onGenderFilter(genderType);
  }
  onCategoriesFilter(categoryId: Maybe<number>) {
    this.store.onCategoriesFilter(categoryId);
  }
  onRegionFilter(regionId: Maybe<number>) {
    this.store.onRegionFilter(regionId);
  }

  ngOnInit(): void {
    this.setColumns();
    this.store.initial();
  }

  private setColumns() {
    this.columns = [
      { field: 'name', header: 'نام مرکز آموزشی', minWidth: '15rem' },
      {
        field: 'uniqueId',
        header: 'شناسه',
        width: '5rem',
        minWidth: '5rem',
      },
      {
        field: 'boyOrGirl',
        header: 'جنسیت',
        customDataModel: this.boyOrGirlTpl,
        width: '10rem',
        minWidth: '10rem',
      },
      {
        field: 'state',
        header: 'استان',
        customDataModel: (item: IAdminSchoolResponse) => item?.address?.stateName ?? '-',
        width: '8rem',
        minWidth: '8rem',
      },
      {
        field: 'managerInfo',
        header: 'مدیریت',
        width: '10rem',
        minWidth: '10rem',
        customDataModel: (item: IAdminSchoolResponse) => {
          const { firstName, lastName } = item.managerInfo;
          const fullName = [firstName, lastName].filter(Boolean).join(' ');
          return fullName || '-';
        },
      },
      {
        field: 'status',
        header: 'وضعیت',
        customDataModel: this.statusTpl,
        width: '6rem',
        minWidth: '6rem',
      },
    ];
  }

  openAddSchoolForm() {
    this.selectedSchoolForEdit.set(null);
    this.isAddSchoolFormVisible.set(true);
  }

  openEditForm(item: IAdminSchoolResponse) {
    this.selectedSchoolForEdit.set(item);
    this.isAddSchoolFormVisible.set(true);
  }

  onSchoolFormSave($event: any) {
    console.log($event);
  }

  toDetails(item: IAdminSchoolResponse) {
    const detailRoute = adminNamedRoutes.school.meta.pagePath!(item.id)! as string;

    this.router.navigateByUrl(detailRoute);
  }

  showConfirmation(item: IAdminSchoolResponse, checked: boolean, event: ToggleSwitchChangeEvent) {
    this.schoolsChangeStatusSchedules.update((prev) => ({ ...prev, [item.id]: true }));
    this.confirmationService.confirm({
      target: (event.originalEvent.target as HTMLElement)?.parentNode?.parentNode!,
      message: !checked
        ? 'آیا از غیرفعال کردن این مرکز آموزشی اطمینان دارید؟'
        : 'آیا از فعال کردن این مرکز آموزشی اطمینان دارید؟',
      header: 'تایید تغییر وضعیت',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'بله',
      rejectLabel: 'خیر',
      accept: () => this.toggleStatus(item, checked),
      reject: () => {
        this.removeSchoolFromSchedule(item.id);
      },
    });
  }

  toggleStatus(item: IAdminSchoolResponse, checked: boolean) {
    this.services.updateSchoolStatus(item.id, checked).subscribe({
      next: () => {
        item.isActive = checked;
        this.removeSchoolFromSchedule(item.id);
      },
      error: () => {
        this.removeSchoolFromSchedule(item.id);
        item.isActive = !checked;
      },
    });
  }

  removeSchoolFromSchedule(itemId: string) {
    const updatedSchedules = { ...this.schoolsChangeStatusSchedules() };
    delete updatedSchedules[itemId];
    this.schoolsChangeStatusSchedules.update(() => updatedSchedules);
  }
}
