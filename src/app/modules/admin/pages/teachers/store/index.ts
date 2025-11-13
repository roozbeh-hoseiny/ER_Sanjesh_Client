import { Maybe } from '@/core';
import { IPaginatedResponse } from '@/core/models/service.model';
import { AdminTeachersService } from '@/modules/admin/services';
import { computed, Injectable, signal } from '@angular/core';
import { IAdminTeacherEntity } from '../models';

type TGetDataMode = 'all' | 'withoutSchools' | 'lesson';

interface ITeachersState {
  schools: Maybe<IAdminTeacherEntity>;
  paginatedItems: IAdminTeacherEntity[][];
  totalRecords: number;
  loading: boolean;
  lastSeen: string;
  activePageIndex: number;
  perPage: number;
  isWithoutSchools: boolean;
  selectedLesson: Maybe<number>;
  getDataMode: TGetDataMode;
}

export const INITIAL_TEACHERS_STATE: ITeachersState = {
  schools: null,
  paginatedItems: [],
  totalRecords: 0,
  loading: true,
  lastSeen: '',
  activePageIndex: 0,
  perPage: 40,
  isWithoutSchools: false,
  selectedLesson: null,
  getDataMode: 'all',
};

@Injectable({ providedIn: 'root' })
export class TeachersStore {
  constructor(private services: AdminTeachersService) {}
  private state$ = signal<ITeachersState>({ ...INITIAL_TEACHERS_STATE });

  // selectors
  readonly schools = computed(() => this.state$().schools);
  readonly loading = computed(() => this.state$().loading);
  readonly isWithoutSchools = computed(() => this.state$().isWithoutSchools);
  readonly selectedLesson = computed(() => this.state$().selectedLesson);
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

  setState(partial: Partial<ITeachersState>) {
    this.state$.set({ ...this.state$(), ...partial });
  }

  onPageChange = (page: number) => {
    this.setState({ activePageIndex: page - 1 });
    if (this.paginatedItems().length > page) {
      return;
    }

    this.getData();
  };

  onFilterWithoutSchools(isWithoutSchools: boolean) {
    this.validateFilterData(isWithoutSchools, 'withoutSchools');
    if (this.isWithoutSchools() !== isWithoutSchools) {
      this.resetPaginateInfo();
      this.setState({ isWithoutSchools });
    }
    if (!isWithoutSchools) {
      this.getAll();
    } else {
      this.getFilteredByWithoutSchools();
    }
  }
  filterByLesson(lessonId: Maybe<number>) {
    this.validateFilterData(lessonId, 'lesson');
    if (this.selectedLesson() !== lessonId) {
      this.resetPaginateInfo();
      this.setState({ selectedLesson: lessonId });
    }
    this.getByLesson();
  }

  initial() {
    this.reset();
    this.getData();
  }

  private getData() {
    this.setState({ loading: true });

    switch (this.getDataMode()) {
      case 'withoutSchools':
        return this.getFilteredByWithoutSchools();
      case 'lesson':
        return this.getByLesson();
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

  private getFilteredByWithoutSchools() {
    this.setState({ loading: true });
    this.services.filterByWithoutSchools(this.paginatedQuery()).subscribe({ ...this.onResponse });
  }

  private getByLesson() {
    if (!this.selectedLesson()) {
      return;
    }
    this.setState({ loading: true });
    this.services
      .byLesson(this.selectedLesson()!, this.paginatedQuery())
      .subscribe({ ...this.onResponse });
  }

  private onResponse = {
    next: (schools: IPaginatedResponse<IAdminTeacherEntity>) => {
      if (!this.paginatedItems.length) {
        this.setState({ totalRecords: schools.totalCount });
      }

      const paginatedItems = [...this.paginatedItems()];
      paginatedItems[this.activePageIndex()] = schools.items;
      this.setState({
        paginatedItems,
        lastSeen: schools.lastSeen || '',
      });
    },
    complete: () => {
      this.setState({ loading: false });
    },
  };

  reset() {
    this.state$.set({ ...INITIAL_TEACHERS_STATE });
  }

  // convenience: set full initial data
  fillInitial(data: Partial<ITeachersState>) {
    this.state$.set({ ...INITIAL_TEACHERS_STATE, ...data });
  }
}
