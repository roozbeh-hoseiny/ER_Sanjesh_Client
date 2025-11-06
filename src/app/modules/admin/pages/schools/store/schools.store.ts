import { Maybe } from '@/core';
import { IPaginatedResponse } from '@/core/models/service.model';
import { AdminSchoolsService } from '@/modules/admin/services';
import { ISchoolResponse } from '@/modules/schools/models';
import { computed, Injectable, signal } from '@angular/core';
import { IAdminSchoolResponse } from '../models/schools';

type TGetDataMode = 'all' | 'search' | 'gender' | 'category' | 'region';

interface ISchoolsState {
  schools: Maybe<ISchoolResponse>;
  paginatedItems: IAdminSchoolResponse[][];
  totalRecords: number;
  loading: boolean;
  lastSeen: string;
  activePageIndex: number;
  perPage: number;
  searchQuery: string;
  selectedGender: Maybe<number>;
  selectedRegion: Maybe<number>;
  selectedCategories: Maybe<number>;

  getDataMode: TGetDataMode;
}

export const INITIAL_SCHOOLS_STATE: ISchoolsState = {
  schools: null,
  paginatedItems: [],
  totalRecords: 0,
  loading: true,
  lastSeen: '',
  activePageIndex: 0,
  perPage: 40,
  searchQuery: '',
  selectedGender: null,
  selectedRegion: null,
  selectedCategories: null,
  getDataMode: 'all',
};

@Injectable({ providedIn: 'root' })
export class SchoolsStore {
  constructor(private services: AdminSchoolsService) {}
  private state$ = signal<ISchoolsState>({ ...INITIAL_SCHOOLS_STATE });

  // selectors
  readonly schools = computed(() => this.state$().schools);
  readonly loading = computed(() => this.state$().loading);
  readonly searchQuery = computed(() => this.state$().searchQuery);
  readonly selectedGender = computed(() => this.state$().selectedGender);
  readonly selectedRegion = computed(() => this.state$().selectedRegion);
  readonly selectedCategories = computed(() => this.state$().selectedCategories);
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

  // paginatedItems = signal<IAdminSchoolResponse[][]>([]);
  // totalRecords = signal<number>(0);
  // loading = signal<boolean>(true);
  // lastSeen = signal<string>('');
  // activePageIndex = signal<number>(0);
  // perPage = signal<number>(40);

  // simple mutators
  setState(partial: Partial<ISchoolsState>) {
    this.state$.set({ ...this.state$(), ...partial });
  }

  // editInfo(request: ITeacher) {
  //   // this.setState({ submitInfoLoading: true });
  //   // return this.adminTeachersService.editInfo(request).pipe(
  //   //   tap((res) => {
  //   //     // this.setState({ school: res });
  //   //     this.toastService.success({ text: 'اطلاعات مدرسه با موفقیت به‌روزرسانی شد.' });
  //   //   }),
  //   //   finalize(() => this.setState({ submitContactLoading: false })),
  //   // );
  // }

  onPageChange = (page: number) => {
    this.setState({ activePageIndex: page - 1 });
    if (this.paginatedItems().length > page) {
      return;
    }

    this.getData();
  };

  onSearch(search: string) {
    this.validateFilterData(search, 'search');
    if (this.searchQuery() !== search) {
      this.resetPaginateInfo();
      this.setState({ searchQuery: search });
    }
    this.getByName();
  }

  onGenderFilter(genderType: Maybe<number>) {
    this.validateFilterData(genderType, 'gender');
    if (this.selectedGender() !== genderType) {
      this.resetPaginateInfo();
      this.setState({ selectedGender: genderType });
    }
    this.getByGender();
  }

  onCategoriesFilter(categoryId: Maybe<number>) {
    this.validateFilterData(categoryId, 'category');
    if (this.selectedCategories() !== categoryId) {
      this.resetPaginateInfo();
      this.setState({ selectedCategories: categoryId });
    }
    this.getByCategories();
  }

  onRegionFilter(regionId: Maybe<number>) {
    this.validateFilterData(regionId, 'region');
    if (this.selectedRegion() !== regionId) {
      this.resetPaginateInfo();
      this.setState({ selectedRegion: regionId });
    }
    this.getByRegion();
  }

  initial() {
    this.reset();
    this.getData();
  }

  private getData() {
    this.setState({ loading: true });

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
    this.setState({ getDataMode: mode });
    this.resetPaginateInfo();
  }

  private resetPaginateInfo() {
    this.setState({ lastSeen: '', paginatedItems: [], totalRecords: 0, activePageIndex: 0 });
  }

  private getAll() {
    this.services.getAll(this.paginatedQuery()).subscribe({ ...this.onResponse });
  }

  private getByName() {
    this.setState({ loading: true });
    this.services
      .filterByName(this.searchQuery(), this.paginatedQuery())
      .subscribe({ ...this.onResponse });
  }

  private getByGender() {
    if (!this.selectedGender()) {
      return;
    }
    this.setState({ loading: true });
    this.services
      .filterByGender(this.selectedGender()!, this.paginatedQuery())
      .subscribe({ ...this.onResponse });
  }
  private getByCategories() {
    if (!this.selectedCategories()) {
      return;
    }
    this.setState({ loading: true });
    this.services
      .filterByCategories([this.selectedCategories()!], this.paginatedQuery())
      .subscribe({ ...this.onResponse });
  }

  private getByRegion() {
    if (!this.selectedRegion()) {
      return;
    }
    this.setState({ loading: true });
    this.services
      .filterByRegion(this.selectedRegion()!, this.paginatedQuery())
      .subscribe({ ...this.onResponse });
  }

  private onResponse = {
    next: (schools: IPaginatedResponse<IAdminSchoolResponse>) => {
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
    this.state$.set({ ...INITIAL_SCHOOLS_STATE });
  }

  // convenience: set full initial data
  fillInitial(data: Partial<ISchoolsState>) {
    this.state$.set({ ...INITIAL_SCHOOLS_STATE, ...data });
  }
}
