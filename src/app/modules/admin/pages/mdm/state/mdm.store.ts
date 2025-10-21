import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { BaseState, BaseStore } from '@/core/state';
import { IEducationalLevelItem } from '../models';

/**
 * Student results state
 */
export interface IEducationalLevelsState extends BaseState<IEducationalLevelItem[]> {}

/**
 * Student exams store
 */
@Injectable({
  providedIn: 'root',
})
export class EducationalLevelsStore extends BaseStore<IEducationalLevelsState> {
  private readonly http = inject(HttpClient);

  constructor() {
    super({
      loading: false,
      error: null,
      lastId: '',
      items: [],
    });
  }

  // Computed selectors
  // readonly upcomingExams = computed(() => this._state().upcomingExams);

  /**
   * Load all exams
   */
  loadData(page: number = 1, pageSize: number = 10) {
    this.setLoading(true);

    // return this.http
    //   .get<{ data: Exam[]; totalCount: number }>('/api/student/exams', { params })
    //   .pipe(
    //     tap((response) => {
    //       this.setItems(response.data, response.totalCount, page);
    //       this.categorizeExams(response.data);
    //     }),
    //     catchError((error) => {
    //       this.setError('خطا در بارگذاری آزمون‌ها');
    //       return of(null);
    //     }),
    //   );
  }

  /**
   * Reset state
   */
  reset(): void {
    this.setState({
      loading: false,
      error: null,
      items: [],
    });
  }
}
