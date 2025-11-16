import { Maybe } from '@/core';
import { computed, Injectable, signal } from '@angular/core';
import { IStateResponse } from '../models';
import { StatesService } from '../services';

interface IRegionsStoreState {
  items: Maybe<IStateResponse[]>;
  loading: boolean;
}

export const INITIAL_Regions_STORE_STATE: IRegionsStoreState = {
  items: null,
  loading: false,
};

@Injectable({ providedIn: 'root' })
export class RegionsStore {
  private state$ = signal<IRegionsStoreState>({
    ...INITIAL_Regions_STORE_STATE,
  });

  constructor(private service: StatesService) {
    if (!this.items()) {
      this.loadItems();
    }
  }

  readonly items = computed(() => this.state$().items);
  readonly loading = computed(() => this.state$().loading);

  setState(partial: Partial<IRegionsStoreState>) {
    this.state$.set({ ...this.state$(), ...partial });
  }

  loadItems() {
    this.setState({ loading: true });
    this.service.getStates().subscribe((res) => {
      this.setState({ items: res, loading: false });
    });
  }

  reset() {
    this.state$.set({ ...INITIAL_Regions_STORE_STATE });
  }

  refresh() {
    this.loadItems();
  }
}
