import { Maybe } from '@/core';
import { computed, Injectable, signal } from '@angular/core';
import { ILessonsResponse } from '../models';
import { LessonsService } from '../services';

interface ILessonsStoreState {
  items: Maybe<ILessonsResponse[]>;
  loading: boolean;
}

export const INITIAL_LESSONS_STORE_STATE: ILessonsStoreState = {
  items: null,
  loading: false,
};

@Injectable({ providedIn: 'root' })
export class LessonsStore {
  private state$ = signal<ILessonsStoreState>({
    ...INITIAL_LESSONS_STORE_STATE,
  });

  constructor(private service: LessonsService) {
    if (!this.items()) {
      this.loadItems();
    }
  }

  readonly items = computed(() => this.state$().items);
  readonly loading = computed(() => this.state$().loading);

  setState(partial: Partial<ILessonsStoreState>) {
    this.state$.set({ ...this.state$(), ...partial });
  }

  loadItems() {
    this.setState({ loading: true });
    this.service.getAll().subscribe((res) => {
      this.setState({ items: res, loading: false });
    });
  }

  reset() {
    this.state$.set({ ...INITIAL_LESSONS_STORE_STATE });
  }

  refresh() {
    this.loadItems();
  }
}
