import { Maybe } from '@/core';
import { computed, Injectable, Signal, signal } from '@angular/core';
import { ILessonsGroupedByLevel, ILessonsInRoot, ILessonsResponse } from '../models';
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
  readonly mappedItems: Signal<Maybe<ILessonsInRoot[]>> = computed(() => {
    if (this.state$().items === null) {
      return null;
    }
    return this.state$().items!.map((lesson) => ({
      ...lesson.fieldOfStudy,
      fieldId: lesson.fieldOfStudy.id.toString(),
      fieldTitle: lesson.fieldOfStudy.title,
      id: lesson.id,
      fullTitle: `${lesson.title} - رشته ${lesson.fieldOfStudy.title} - پایه ${lesson.educationalLevel.title}`,
    }));
  });
  readonly groupedByLevels: Signal<Maybe<ILessonsGroupedByLevel[]>> = computed(() => {
    if (this.state$().items === null) {
      return null;
    }
    const items = this.state$().items as ILessonsResponse[];
    const grouped = items.reduce((acc: any, lesson) => {
      const levelId = lesson.educationalLevel.id;
      if (!acc[levelId]) {
        acc[levelId] = {
          id: lesson.educationalLevel.id,
          title: lesson.educationalLevel.title,
          level: lesson.educationalLevel.level,
          lessons: [],
        };
      }
      acc[levelId].lessons.push({
        id: lesson.id.toString(),
        title: lesson.title,
      });
      return acc;
    }, {});

    return Object.values(grouped);
  });
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
