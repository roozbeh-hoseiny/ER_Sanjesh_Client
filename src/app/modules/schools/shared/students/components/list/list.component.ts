import {
  SchoolStudentsMainFiltersComponent,
  SchoolStudentsManagementStore,
} from '@/modules/schools/pages/students/components';
import { AddSingleStudentFormDialogComponent } from '@/modules/schools/pages/students/components/forms/add-single-student-form-dialog.component';
import { ConfirmationDialogService } from '@/shared/components';
import { IGetSchoolStudentsRequestPayload, IStudentResponse } from '@/shared/components/modules';
import {
  IColumn,
  PageDataListComponent,
} from '@/shared/components/pageDataList/page-data-list.component';
import { Component, computed, signal, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'shared-school-students',
  templateUrl: './list.component.html',
  imports: [
    SchoolStudentsMainFiltersComponent,
    PageDataListComponent,
    ButtonDirective,
    AddSingleStudentFormDialogComponent,
  ],
})
export class SharedSchoolStudentsComponent {
  columns!: IColumn[];
  @ViewChild('name', { static: true }) nameTpl!: TemplateRef<any>;
  @ViewChild('rowActions', { static: true }) actionTpl!: TemplateRef<any>;

  openedUploadDialog = signal(false);
  visibleForm = signal<boolean>(false);

  isFilterSet = computed(() => {
    const mainFilter = this.schoolStudentsManagementStore.mainFilter();
    return mainFilter.academicYear && mainFilter.educationalLevelId && mainFilter.fieldOfStudyId;
  });
  students = computed(() => this.schoolStudentsManagementStore.students());
  loading = computed(() => this.schoolStudentsManagementStore.getStudentsLoading());
  mainFilter = computed(() => this.schoolStudentsManagementStore.mainFilter());
  unassignLoading = computed(() => this.schoolStudentsManagementStore.unassignLoading());
  canAddStudent = computed(() => this.schoolStudentsManagementStore.canAddStudent());
  canAddBulkStudents = computed(() => this.schoolStudentsManagementStore.canAddBulkStudents());

  constructor(
    private schoolStudentsManagementStore: SchoolStudentsManagementStore,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService,
  ) {}

  ngOnInit() {
    this.setColumns();
    this.schoolStudentsManagementStore.getAll();
  }

  ngOnDestroy() {
    this.schoolStudentsManagementStore.reset();
  }

  setColumns() {
    this.columns = [
      {
        field: 'firstName',
        header: 'نام',
        customDataModel: this.nameTpl,
      },
      { field: 'fatherName', header: 'نام پدر' },
      { field: 'nationalCode', header: 'کد ملی' },
      { field: 'mobile', header: 'شماره موبایل' },
      {
        field: 'rowActions',
        header: '',
        customDataModel: this.actionTpl,
        width: '5rem',
        minWidth: '5rem',
      },
    ];
  }

  openUploadDialog() {
    this.openedUploadDialog.set(true);
  }

  onSubmitMainFilter(queryParams: IGetSchoolStudentsRequestPayload) {
    this.schoolStudentsManagementStore.onSubmitMainFilter(queryParams);
  }

  toAddBulkPage() {
    this.router.navigate(['/schools/students/bulk-add']);
  }

  openAddForm() {
    this.visibleForm.set(true);
  }
  closeAddForm() {
    this.visibleForm.set(false);
  }

  unassignStudent(item: IStudentResponse) {
    this.confirmationDialogService.confirm({
      header: 'لغو عضویت دانش‌آموز',
      message: `آیا از لغو عضویت ${item.firstName} ${item.lastName} از مدرسه مطمین هستید؟`,
      accept: () => {
        this.schoolStudentsManagementStore.doUnassignStudent(item);
      },
      variant: 'reject',
    });
  }
  refreshData() {
    this.schoolStudentsManagementStore.refreshData();
  }
}
