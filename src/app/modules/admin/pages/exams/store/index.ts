import { Maybe } from '@/core';
import { IPaginatedResponse } from '@/core/models/service.model';
import { AdminExamsService } from '@/modules/admin/services';
import { computed, Injectable, signal } from '@angular/core';
import { IAdminExamRawResponse } from '../models';

type TGetDataMode = 'all';

interface IExamsState {
  items: Maybe<IAdminExamRawResponse>;
  paginatedItems: IAdminExamRawResponse[][];
  totalRecords: number;
  loading: boolean;
  lastSeen: string;
  activePageIndex: number;
  perPage: number;
  isWithoutSchools: boolean;
  selectedLesson: Maybe<number>;
  selectedSchool: Maybe<string>;
  getDataMode: TGetDataMode;
}

export const INITIAL_EXAMS_STATE: IExamsState = {
  items: null,
  paginatedItems: [],
  totalRecords: 0,
  loading: true,
  lastSeen: '',
  activePageIndex: 0,
  perPage: 40,
  isWithoutSchools: false,
  selectedLesson: null,
  selectedSchool: null,
  getDataMode: 'all',
};

@Injectable({ providedIn: 'root' })
export class ExamsStore {
  constructor(private services: AdminExamsService) {}
  private state$ = signal<IExamsState>({ ...INITIAL_EXAMS_STATE });

  // selectors
  readonly exams = computed(() => this.state$().items);
  readonly loading = computed(() => this.state$().loading);
  readonly isWithoutSchools = computed(() => this.state$().isWithoutSchools);
  readonly selectedLesson = computed(() => this.state$().selectedLesson);
  readonly selectedSchool = computed(() => this.state$().selectedSchool);
  readonly paginatedItems = computed(() => this.state$().paginatedItems);

  readonly getDataMode = computed(() => this.state$().getDataMode);
  readonly lastSeen = computed(() => this.state$().lastSeen);
  readonly totalRecords = computed(() => this.state$().totalRecords);
  readonly perPage = computed(() => this.state$().perPage);
  readonly activePageIndex = computed(() => this.state$().activePageIndex);

  readonly isFiltered = computed(() => this.state$().getDataMode !== 'all');

  readonly activePageItems = computed(() => {
    const pageIndex = this.activePageIndex();
    const pages = this.paginatedItems();
    return pages[pageIndex] || [];
  });

  readonly paginatedQuery = computed(() => ({
    lastSeen: this.lastSeen(),
    pageSize: this.perPage(),
  }));

  setState(partial: Partial<IExamsState>) {
    this.state$.set({ ...this.state$(), ...partial });
  }

  onPageChange = (page: number) => {
    this.setState({ activePageIndex: page - 1 });
    if (this.paginatedItems().length > page) {
      return;
    }

    this.getData();
  };

  // onFilterWithoutSchools(isWithoutSchools: boolean) {
  //   this.validateFilterData(isWithoutSchools, 'withoutSchools');
  //   if (this.isWithoutSchools() !== isWithoutSchools) {
  //     this.resetPaginateInfo();
  //     this.setState({ isWithoutSchools });
  //   }
  //   if (!isWithoutSchools) {
  //     this.getAll();
  //   } else {
  //     this.getFilteredByWithoutSchools();
  //   }
  // }
  // filterByLesson(lessonId: Maybe<number>) {
  //   this.validateFilterData(lessonId, 'lesson');
  //   if (this.selectedLesson() !== lessonId) {
  //     this.resetPaginateInfo();
  //     this.setState({ selectedLesson: lessonId });
  //   }
  //   this.getByLesson();
  // }

  // filterBySchool(schoolId: Maybe<string>) {
  //   this.validateFilterData(schoolId, 'school');
  //   if (this.selectedSchool() !== schoolId) {
  //     this.resetPaginateInfo();
  //     this.setState({ selectedSchool: schoolId });
  //   }
  //   this.getBySchool();
  // }

  initial() {
    this.reset();
    this.getData();
  }

  private getData() {
    this.setState({ loading: true });

    switch (this.getDataMode()) {
      // case 'withoutSchools':
      //   return this.getFilteredByWithoutSchools();
      // case 'lesson':
      //   return this.getByLesson();
      // case 'school':
      //   return this.getBySchool();
      default:
        return this.getAll();
    }
  }

  private validateFilterData(value: Maybe<string | number | boolean>, mode: TGetDataMode) {
    if (!value) {
      this.changeGetDataMode('all');
      return this.getData();
    }
    if (this.getDataMode() !== mode) {
      this.changeGetDataMode(mode);
    }
  }

  private changeGetDataMode(mode: TGetDataMode) {
    this.setState({ getDataMode: mode });
    this.resetPaginateInfo();
  }

  private resetPaginateInfo() {
    this.setState({ lastSeen: '', paginatedItems: [], totalRecords: 0, activePageIndex: 0 });
  }

  private getAll() {
    this.services.getAll(this.paginatedQuery()).subscribe({ ...this.onResponse });
  }

  // private getFilteredByWithoutSchools() {
  //   this.setState({ loading: true });
  //   this.services.filterByWithoutSchools(this.paginatedQuery()).subscribe({ ...this.onResponse });
  // }

  // private getByLesson() {
  //   if (!this.selectedLesson()) {
  //     return;
  //   }
  //   this.setState({ loading: true });
  //   this.services
  //     .byLesson(this.selectedLesson()!, this.paginatedQuery())
  //     .subscribe({ ...this.onResponse });
  // }

  // private getBySchool() {
  //   if (!this.selectedSchool()) {
  //     return;
  //   }
  //   this.setState({ loading: true });
  //   this.services.bySchool(this.selectedSchool()!).subscribe({
  //     next: (res) => this.onResponse.next({ lastSeen: '', totalCount: 1, items: res }),
  //     complete: () => this.onResponse.complete(),
  //   });
  // }

  private onResponse = {
    next: (exams: IPaginatedResponse<IAdminExamRawResponse>) => {
      if (!this.paginatedItems.length) {
        this.setState({ totalRecords: exams.totalCount });
      }

      const paginatedItems = [...this.paginatedItems()];
      paginatedItems[this.activePageIndex()] = exams.items;
      this.setState({
        paginatedItems,
        lastSeen: exams.lastSeen || '',
      });
    },
    complete: () => {
      this.setState({ loading: false });
    },
  };

  reset() {
    this.state$.set({ ...INITIAL_EXAMS_STATE });
  }

  // convenience: set full initial data
  fillInitial(data: Partial<IExamsState>) {
    this.state$.set({ ...INITIAL_EXAMS_STATE, ...data });
  }
}
