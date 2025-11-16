import { Maybe } from '@/core';
import { computed, Injectable, signal } from '@angular/core';
import { IFieldOfStudiesResponse } from '../models';
import { FieldOfStudiesService } from '../services';

interface IFieldOfStudiesStoreState {
  items: Maybe<IFieldOfStudiesResponse[]>;
  loading: boolean;
}

export const INITIAL_FIELD_OF_STUDIES_STORE_STATE: IFieldOfStudiesStoreState = {
  items: null,
  loading: false,
};

@Injectable({ providedIn: 'root' })
export class FieldOfStudiesStore {
  private state$ = signal<IFieldOfStudiesStoreState>({
    ...INITIAL_FIELD_OF_STUDIES_STORE_STATE,
  });

  constructor(private service: FieldOfStudiesService) {
    if (!this.items()) {
      this.loadItems();
    }
  }

  readonly items = computed(() => this.state$().items);
  readonly loading = computed(() => this.state$().loading);

  setState(partial: Partial<IFieldOfStudiesStoreState>) {
    this.state$.set({ ...this.state$(), ...partial });
  }

  loadItems() {
    this.setState({ loading: true });
    this.service.getAll().subscribe((res) => {
      this.setState({ items: res, loading: false });
    });
  }

  reset() {
    this.state$.set({ ...INITIAL_FIELD_OF_STUDIES_STORE_STATE });
  }

  refresh() {
    this.loadItems();
  }
}
