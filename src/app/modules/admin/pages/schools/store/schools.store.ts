import { Maybe } from '@/core';
import { IPaginatedResponse } from '@/core/models/service.model';
import { AdminSchoolsService } from '@/modules/admin/services';
import { ISchoolResponse } from '@/modules/schools/models';
import { computed, Injectable, signal } from '@angular/core';
import { IAdminSchoolResponse } from '../models/schools';

type TGetDataMode =
  | 'all'
  | 'search'
  | 'gender'
  | 'category'
  | 'region'
  | 'withoutAgent'
  | 'canUseCredit'
  | 'canNotUseCredit';

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
  selectedWithoutAgent: Maybe<boolean>;
  selectedCanUseCredit: Maybe<boolean>;
  selectedCanNotUseCredit: Maybe<boolean>;

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
  selectedWithoutAgent: null,
  selectedCanUseCredit: null,
  selectedCanNotUseCredit: null,
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
  readonly selectedWithoutAgent = computed(() => this.state$().selectedWithoutAgent);
  readonly selectedCanUseCredit = computed(() => this.state$().selectedCanUseCredit);
  readonly selectedCanNotUseCredit = computed(() => this.state$().selectedCanNotUseCredit);
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

  setState(partial: Partial<ISchoolsState>) {
    this.state$.set({ ...this.state$(), ...partial });
  }

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

  onWithoutAgentFilter(withoutAgent: Maybe<boolean>) {
    this.validateFilterData(withoutAgent, 'withoutAgent');
    if (this.selectedWithoutAgent() !== withoutAgent) {
      this.resetPaginateInfo();
      this.setState({ selectedWithoutAgent: withoutAgent });
    }
    this.getByWithoutAgent();
  }

  onCanUseCreditFilter(canUseCredit: Maybe<boolean>) {
    this.validateFilterData(canUseCredit, 'canUseCredit');
    if (this.selectedCanUseCredit() !== canUseCredit) {
      this.resetPaginateInfo();
      this.setState({ selectedCanUseCredit: canUseCredit });
    }
    this.getByCanUseCredit();
  }

  onCanNotUseCreditFilter(canNotUseCredit: Maybe<boolean>) {
    this.validateFilterData(canNotUseCredit, 'canNotUseCredit');

    if (this.selectedCanNotUseCredit() !== canNotUseCredit) {
      this.resetPaginateInfo();
      this.setState({ selectedCanNotUseCredit: canNotUseCredit });
    }
    this.getByCanNotUseCredit();
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
      case 'withoutAgent':
        return this.getByWithoutAgent();
      case 'canUseCredit':
        return this.getByCanUseCredit();
      case 'canNotUseCredit':
        return this.getByCanNotUseCredit();
      default:
        return this.getAll();
    }
  }

  private validateFilterData(value: Maybe<string | number | boolean>, mode: TGetDataMode) {
    if ((typeof value !== 'boolean' && !value) || value === null) {
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

  private getByWithoutAgent() {
    if (!this.selectedWithoutAgent()) {
      return;
    }
    this.setState({ loading: true });
    this.services.filterByWithoutAgent(this.paginatedQuery()).subscribe({ ...this.onResponse });
  }

  private getByCanUseCredit() {
    if (!this.selectedCanUseCredit()) {
      return;
    }
    this.setState({ loading: true });
    this.services.filterByCanUseCredit(this.paginatedQuery()).subscribe({ ...this.onResponse });
  }

  private getByCanNotUseCredit() {
    if (this.selectedCanNotUseCredit() === null) {
      return;
    }
    this.setState({ loading: true });
    this.services.filterByCanNotUseCredit(this.paginatedQuery()).subscribe({ ...this.onResponse });
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
