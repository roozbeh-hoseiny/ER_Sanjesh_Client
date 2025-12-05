import { SchoolsStore } from '@/modules/schools/dataStore';
import { SchoolsStudentsService } from '@/modules/schools/services';
import {
  IColumn,
  PageDataListComponent,
} from '@/shared/components/pageDataList/page-data-list.component';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SchoolStudentListStore, SchoolStudentsMainFiltersComponent } from '../components';
import { IGetSchoolStudentsRequestPayload } from '../models';

@Component({
  selector: 'school-students',
  templateUrl: './students.component.html',
  imports: [SchoolStudentsMainFiltersComponent, PageDataListComponent],
})
export class SchoolStudentsComponent {
  private schoolsStore = inject(SchoolsStore);
  loading = signal<boolean>(false);
  schoolId = signal(this.schoolsStore.info()?.id!);
  openedUploadDialog = signal(false);
  isMainFilterOpened = signal(false);

  columns = [] as IColumn[];

  get students() {
    return this.schoolStudentListStore.students();
  }

  constructor(
    private services: SchoolsStudentsService,
    private schoolStudentListStore: SchoolStudentListStore,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.schoolStudentListStore.setService({
      addBulk: (payload: FormData) => this.services.bulkAdd(payload),
    });
    const mainFilter = this.schoolStudentListStore.mainFilter();
    if (!mainFilter.academicYear || !mainFilter.educationalLevelId || !mainFilter.fieldOfStudyId) {
      this.isMainFilterOpened.set(true);
    } else {
      this.getData();
    }
  }

  mainFilter = computed(() => this.schoolStudentListStore.mainFilter());

  private getData() {
    this.loading.set(true);
    this.getAll();
  }

  private getAll() {
    const filter = this.mainFilter();
    if (
      filter.academicYear === undefined ||
      filter.educationalLevelId === undefined ||
      filter.fieldOfStudyId === undefined
    ) {
      // Handle missing required fields, e.g., show an error or return early
      this.loading.set(false);
      return;
    }
    this.services.getAll(filter as IGetSchoolStudentsRequestPayload).subscribe((students) => {
      this.schoolStudentListStore.fillInitial({
        students,
        schoolId: this.schoolId(),
      });
      this.loading.set(false);
    });
  }

  refreshData() {
    this.getData();
  }

  openUploadDialog() {
    this.openedUploadDialog.set(true);
  }

  onSubmitMainFilter(queryParams: IGetSchoolStudentsRequestPayload) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: 'merge', // remove to replace all query params by provided
    });

    this.schoolStudentListStore.updateMainFilterState(queryParams);

    this.getData();
  }

  toAddBulkPage() {
    this.router.navigate(['/schools/students/bulk-add']);
  }
}
