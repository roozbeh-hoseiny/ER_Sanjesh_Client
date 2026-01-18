import { ToastService } from '@/core/services/toast.service';
import { SchoolsStore } from '@/modules/schools/dataStore';
import { SchoolsStudentsService } from '@/modules/schools/services';
import { CatalogGenderTagComponent } from '@/shared/catalog/gender/gender-tag.component';
import { ConfirmationDialogService } from '@/shared/components';
import {
  IColumn,
  PageDataListComponent,
} from '@/shared/components/pageDataList/page-data-list.component';
import { Component, computed, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { finalize } from 'rxjs';
import {
  IGetSchoolStudentsRequestPayload,
  IStudentRequestPayload,
  IStudentResponse,
} from '../../../../../shared/components/modules/students';
import { SchoolStudentsMainFiltersComponent, SchoolStudentsManagementStore } from '../components';
import { AddSingleStudentFormDialogComponent } from '../components/forms/add-single-student-form-dialog.component';

@Component({
  selector: 'school-students',
  templateUrl: './students.component.html',
  imports: [
    SchoolStudentsMainFiltersComponent,
    PageDataListComponent,
    ButtonDirective,
    AddSingleStudentFormDialogComponent,
    CatalogGenderTagComponent,
  ],
})
export class SchoolStudentsComponent {
  private schoolsStore = inject(SchoolsStore);
  columns!: IColumn[];
  @ViewChild('gender', { static: true }) genderTpl!: TemplateRef<any>;
  @ViewChild('rowActions', { static: true }) actionTpl!: TemplateRef<any>;

  schoolId = signal(this.schoolsStore.info()?.id!);
  openedUploadDialog = signal(false);
  visibleForm = signal<boolean>(false);
  unassignLoading = signal(false);

  isFilterSet = computed(() => {
    const mainFilter = this.schoolStudentsManagementStore.mainFilter();
    return mainFilter.academicYear && mainFilter.educationalLevelId && mainFilter.fieldOfStudyId;
  });
  students = computed(() => this.schoolStudentsManagementStore.students());
  loading = computed(() => this.schoolStudentsManagementStore.getStudentsLoading());
  mainFilter = computed(() => this.schoolStudentsManagementStore.mainFilter());

  constructor(
    private schoolStudentsManagementStore: SchoolStudentsManagementStore,
    private service: SchoolsStudentsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.setColumns();
    this.getAll();
  }

  setColumns() {
    this.columns = [
      {
        field: 'firstName',
        header: 'نام',
        customDataModel: (item: IStudentResponse) => `${item.firstName} ${item.lastName}`,
      },
      { field: 'fatherName', header: 'نام پدر' },
      { field: 'nationalCode', header: 'کد ملی' },
      { field: 'mobile', header: 'شماره موبایل' },
      { field: 'gender', header: 'جنسیت', customDataModel: this.genderTpl },
      {
        field: 'rowActions',
        header: '',
        customDataModel: this.actionTpl,
      },
    ];
  }

  getAll() {
    this.schoolStudentsManagementStore.getAll();
  }

  refreshData() {
    this.getAll();
  }

  openUploadDialog() {
    this.openedUploadDialog.set(true);
  }

  onSubmitMainFilter(queryParams: IGetSchoolStudentsRequestPayload) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: 'merge',
    });

    this.schoolStudentsManagementStore.updateMainFilterState(queryParams);
    this.getAll();
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

  submitStudent(payload: IStudentRequestPayload) {
    return this.service.create(payload);
  }

  unassignStudent(item: IStudentResponse) {
    this.confirmationDialogService.confirm({
      header: 'لغو عضویت دانش‌آموز',
      message: `آیا از لغو عضویت ${item.firstName} ${item.lastName} از مدرسه مطمین هستید؟`,
      accept: () => {
        this.doUnassignStudent(item);
      },
      variant: 'reject',
    });
  }

  doUnassignStudent(item: IStudentResponse) {
    this.unassignLoading.set(true);
    return this.service
      .unassign({ studentId: item.id })
      .pipe(
        finalize(() => {
          this.unassignLoading.set(false);
        }),
      )
      .subscribe((res) => {
        this.toastService.success({
          text: `لغو عضویت دانش‌آموز ${item.firstName} ${item.lastName} با موفقیت انجام شد`,
        });
        this.refreshData();
      });
  }
}
