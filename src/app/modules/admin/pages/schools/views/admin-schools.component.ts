import { Maybe } from '@/core';
import { IPaginatedResponse } from '@/core/models/service.model';
import { BreadcrumbService } from '@/core/services';
import { adminNamedRoutes } from '@/modules/admin/constants';
import { SchoolGendersTag } from '@/shared/catalog/schoolsGender/app-school-genders-tag.component';
import {
  IColumn,
  PageDataListComponent,
} from '@/shared/components/pageDataList/page-data-list.component';
import { CommonModule } from '@angular/common';
import { Component, computed, signal, TemplateRef, ViewChild } from '@angular/core';
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

type TGetDataMode = 'all' | 'search' | 'gender' | 'category' | 'region';

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
    private services: AdminSchoolsService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private confirmationService: ConfirmationService,
  ) {
    this.breadcrumbService.setItems([adminNamedRoutes.root.meta, adminNamedRoutes.schools.meta]);
    this.getData();
  }

  @ViewChild('boyOrGirl', { static: true }) boyOrGirlTpl!: TemplateRef<any>;
  @ViewChild('status', { static: true }) statusTpl!: TemplateRef<any>;

  columns = [] as IColumn[];

  checked: boolean = false;

  paginatedItems = signal<IAdminSchoolResponse[][]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(true);
  lastSeen = signal<string>('');
  activePageIndex = signal<number>(0);
  perPage = signal<number>(40);

  isAddSchoolFormVisible = signal<boolean>(false);
  schoolsChangeStatusSchedules = signal<Record<string, boolean>>({});
  selectedSchoolForEdit = signal<Maybe<IAdminSchoolResponse>>(null);

  getDataMode = signal<TGetDataMode>('all');

  get isFiltered() {
    return this.getDataMode() !== 'all';
  }

  private searchQuery = signal<string>('');
  private selectedGender = signal<Maybe<number>>(null);
  private selectedRegion = signal<Maybe<number>>(null);
  private selectedCategories = signal<Maybe<number>>(null);

  activePageItems = computed(() => {
    const pageIndex = this.activePageIndex();
    const pages = this.paginatedItems();
    return pages[pageIndex] || [];
  });

  ngOnInit(): void {
    this.setColumns();
  }

  private setColumns() {
    this.columns = [
      { field: 'name', header: 'نام مدرسه', minWidth: '15rem' },
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

  private getData() {
    this.loading.set(true);

    switch (this.getDataMode()) {
      case 'search':
        return this.getByName();
      case 'gender':
        return this.getByGender();
      case 'category':
        return this.getByCategories();
      case 'region':
        return this.getByRegion();
      default:
        return this.getAll();
    }
  }

  onPageChange = (page: number) => {
    this.activePageIndex.set(page - 1);
    if (this.paginatedItems().length > page) {
      return;
    }

    this.getData();
  };

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

  onSearch(search: string) {
    this.validateFilterData(search, 'search');
    if (this.searchQuery() !== search) {
      this.resetPaginateInfo();
      this.searchQuery.set(search);
    }
    this.getByName();
  }

  onGenderFilter(genderType: Maybe<number>) {
    this.validateFilterData(genderType, 'gender');
    if (this.selectedGender() !== genderType) {
      this.resetPaginateInfo();
      this.selectedGender.set(genderType);
    }
    this.getByGender();
  }

  onCategoriesFilter(categoryId: Maybe<number>) {
    this.validateFilterData(categoryId, 'category');
    if (this.selectedCategories() !== categoryId) {
      this.resetPaginateInfo();
      this.selectedCategories.set(categoryId);
    }
    this.getByCategories();
  }

  onRegionFilter(regionId: Maybe<number>) {
    this.validateFilterData(regionId, 'region');
    if (this.selectedRegion() !== regionId) {
      this.resetPaginateInfo();
      this.selectedRegion.set(regionId);
    }
    this.getByRegion();
  }

  toDetails(item: IAdminSchoolResponse) {
    const detailRoute = adminNamedRoutes.school.meta.pagePath!(item.id)! as string;

    this.router.navigateByUrl(detailRoute);
  }

  private validateFilterData(value: Maybe<string | number>, mode: TGetDataMode) {
    if (!value) {
      this.changeGetDataMode('all');
      return this.getData();
    }
    if (this.getDataMode() !== mode) {
      this.changeGetDataMode(mode);
    }
  }

  private changeGetDataMode(mode: TGetDataMode) {
    this.getDataMode.set(mode);
    this.resetPaginateInfo();
  }

  private resetPaginateInfo() {
    this.lastSeen.set('');
    this.paginatedItems.set([]);
    this.totalRecords.set(0);
    this.activePageIndex.set(0);
  }

  private getAll() {
    this.services
      .getAll({ lastSeen: this.lastSeen(), pageSize: this.perPage() })
      .subscribe({ ...this.onResponse });
  }

  private getByName() {
    this.loading.set(true);
    this.services
      .filterByName(this.searchQuery(), { lastSeen: this.lastSeen(), pageSize: this.perPage() })
      .subscribe({ ...this.onResponse });
  }

  private getByGender() {
    if (!this.selectedGender()) {
      return;
    }
    this.loading.set(true);
    this.services
      .filterByGender(this.selectedGender()!, {
        lastSeen: this.lastSeen(),
        pageSize: this.perPage(),
      })
      .subscribe({ ...this.onResponse });
  }
  private getByCategories() {
    if (!this.selectedCategories()) {
      return;
    }
    this.loading.set(true);
    this.services
      .filterByCategories([this.selectedCategories()!], {
        lastSeen: this.lastSeen(),
        pageSize: this.perPage(),
      })
      .subscribe({ ...this.onResponse });
  }

  private getByRegion() {
    if (!this.selectedRegion()) {
      return;
    }
    this.loading.set(true);
    this.services
      .filterByRegion(this.selectedRegion()!, {
        lastSeen: this.lastSeen(),
        pageSize: this.perPage(),
      })
      .subscribe({ ...this.onResponse });
  }

  private onResponse = {
    next: (schools: IPaginatedResponse<IAdminSchoolResponse>) => {
      if (!this.paginatedItems.length) {
        this.totalRecords.set(schools.totalCount);
      }
      this.paginatedItems.update((prev) => {
        return [...prev, schools.items];
      });
      this.lastSeen.set(schools.lastSeen || '');
    },
    complete: () => {
      this.loading.set(false);
    },
  };

  showConfirmation(item: IAdminSchoolResponse, checked: boolean, event: ToggleSwitchChangeEvent) {
    this.schoolsChangeStatusSchedules.update((prev) => ({ ...prev, [item.id]: true }));
    this.confirmationService.confirm({
      target: (event.originalEvent.target as HTMLElement)?.parentNode?.parentNode!,
      message: !checked
        ? 'آیا از غیرفعال کردن این مدرسه اطمینان دارید؟'
        : 'آیا از فعال کردن این مدرسه اطمینان دارید؟',
      header: 'تایید تغییر وضعیت',
      icon: 'pi pi-exclamation-triangle',
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
