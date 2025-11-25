import { Maybe } from '@/core';
import { BreadcrumbService } from '@/core/services';
import { adminNamedRoutes } from '@/modules/admin/constants';
import {
  IColumn,
  PageDataListComponent,
} from '@/shared/components/pageDataList/page-data-list.component';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ExamFormDialogComponent } from '../components/examEntityForm/form-dialog.component';
import { IAdminExamRawResponse } from '../models';
import { ExamsStore } from '../store';

@Component({
  selector: 'app-admin-exams',
  templateUrl: './exams.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageDataListComponent,
    ToggleSwitchModule,
    ButtonModule,
    FormsModule,
    ExamFormDialogComponent,
  ],
})
export class AdminExamsComponent {
  constructor(
    private router: Router,
    private store: ExamsStore,
    private breadcrumbService: BreadcrumbService,
  ) {
    this.breadcrumbService.setItems([adminNamedRoutes.root.meta, adminNamedRoutes.exams.meta]);
  }

  columns = [] as IColumn[];

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

  isAddFormVisible = signal<boolean>(true);
  selectedItemForEdit = signal<Maybe<IAdminExamRawResponse>>(null);

  ngOnInit(): void {
    this.setColumns();
    this.store.initial();
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
        canCopy: true,
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

  onPageChange(page: number) {
    this.store.onPageChange(page);
  }

  // filterByWithoutSchools(status: boolean) {
  //   this.store.onFilterWithoutSchools(status);
  // }
  // onLessonFilter(lessonId: Maybe<number>) {
  //   this.store.filterByLesson(lessonId);
  // }
  // onSchoolFilter(schoolId: Maybe<string>) {
  //   this.store.filterBySchool(schoolId);
  // }

  openAddForm() {
    this.selectedItemForEdit.set(null);
    this.isAddFormVisible.set(true);
  }

  openEditForm(item: IAdminExamRawResponse) {
    this.selectedItemForEdit.set(item);
    this.isAddFormVisible.set(true);
  }

  onFormSave($event: any) {
    this.store.initial();
  }

  toDetails(item: IAdminExamRawResponse) {
    // const detailRoute = adminNamedRoutes.exam.meta.pagePath!(item.id)! as string;
    // this.router.navigateByUrl(detailRoute);
  }

  searchBySchoolsStatus(status: boolean) {
    console.log(status);
  }
}
