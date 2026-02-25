import { computed, inject, Injectable, signal } from '@angular/core';

import { Maybe } from '@/core';
import { ToastService } from '@/core/services/toast.service';
import { schoolsNamedRoutes } from '@/modules/schools/constants';
import { SchoolExamsService } from '@/modules/schools/services/exams.service';
import { Router } from '@angular/router';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { ISchoolExamDetailsResponse } from '../models';

/**
 * Authentication state
 */
export interface IExamStates {
  info: Maybe<ISchoolExamDetailsResponse>;
  initLoading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SchoolExamStore {
  examId: Maybe<string> = null;
  private toastService = inject(ToastService);
  private router = inject(Router);
  private service = inject(SchoolExamsService);

  protected info$ = signal<Maybe<ISchoolExamDetailsResponse>>(null);
  protected initLoading$ = signal<boolean>(true);

  // Computed selectors
  readonly info = computed(() => this.info$());
  readonly initLoading = computed(() => this.initLoading$());

  reset(): void {
    this.info$.set(null);
    this.initLoading$.set(true);
  }

  getInfo(): Observable<ISchoolExamDetailsResponse> {
    return this.service.get(this.examId as string).pipe(
      tap((res) => {
        this.info$.set(res);
      }),
      catchError((error) => {
        this.info$.set(null);
        this.toastService.error({
          text: 'چنین آزمونی‌ای‌ای وجود ندارد یا ممکن است حذف شده باشد.',
        });
        this.router.navigate([schoolsNamedRoutes.exams.path]);
        return throwError(() => error);
      }),
      finalize(() => {
        this.initLoading$.set(false);
      }),
    );
  }
}
