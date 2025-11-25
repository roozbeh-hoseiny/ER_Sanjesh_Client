import { Maybe } from '@/core';
import { IPaginatedResponse } from '@/core/models/service.model';
import { AdminAgentsService } from '@/modules/admin/services/admin-agents.service';
import { computed, Injectable, signal } from '@angular/core';
import { IAdminAgentResponse } from '../models';

type TGetDataMode = 'all' | 'byName';

interface IAgentsState {
  agents: Maybe<IAdminAgentResponse>;
  paginatedItems: IAdminAgentResponse[][];
  totalRecords: number;
  loading: boolean;
  lastSeen: number;
  activePageIndex: number;
  perPage: number;
  searchedName: string;
  getDataMode: TGetDataMode;
}

export const INITIAL_TEACHERS_STATE: IAgentsState = {
  agents: null,
  paginatedItems: [],
  totalRecords: 0,
  loading: true,
  lastSeen: 0,
  activePageIndex: 0,
  perPage: 40,
  searchedName: '',
  getDataMode: 'all',
};

@Injectable({ providedIn: 'root' })
export class AgentsStore {
  constructor(private services: AdminAgentsService) {}
  private state$ = signal<IAgentsState>({ ...INITIAL_TEACHERS_STATE });

  // selectors
  readonly agents = computed(() => this.state$().agents);
  readonly loading = computed(() => this.state$().loading);
  readonly searchedName = computed(() => this.state$().searchedName);
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

  setState(partial: Partial<IAgentsState>) {
    this.state$.set({ ...this.state$(), ...partial });
  }

  onPageChange = (page: number) => {
    this.setState({ activePageIndex: page - 1 });
    if (this.paginatedItems().length > page) {
      return;
    }

    this.getData();
  };

  filterByName(name: string) {
    this.validateFilterData(name, 'byName');
    if (this.searchedName() !== name) {
      this.resetPaginateInfo();
      this.setState({ searchedName: name });
    }
    this.getByName();
  }

  initial() {
    this.reset();
    this.getData();
  }

  refresh() {
    this.setState({ lastSeen: 0, paginatedItems: [], totalRecords: 0, activePageIndex: 0 });
    this.getData();
  }

  private getData() {
    this.setState({ loading: true });

    switch (this.getDataMode()) {
      case 'byName':
        return this.getByName();
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
    this.setState({ lastSeen: 0, paginatedItems: [], totalRecords: 0, activePageIndex: 0 });
  }

  private getAll() {
    this.services.getAll(this.paginatedQuery()).subscribe({ ...this.onResponse });
  }

  private getByName() {
    this.setState({ loading: true });
    this.services
      .filterByName(this.searchedName()!, this.paginatedQuery())
      .subscribe({ ...this.onResponse });
  }

  private onResponse = {
    next: (agents: IPaginatedResponse<IAdminAgentResponse, number>) => {
      if (!this.paginatedItems.length) {
        this.setState({ totalRecords: agents.totalCount });
      }

      const paginatedItems = [...this.paginatedItems()];
      paginatedItems[this.activePageIndex()] = agents.items;
      this.setState({
        paginatedItems,
        lastSeen: agents.lastSeen || 0,
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
  fillInitial(data: Partial<IAgentsState>) {
    this.state$.set({ ...INITIAL_TEACHERS_STATE, ...data });
  }
}
