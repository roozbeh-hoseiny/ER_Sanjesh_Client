import { computed, inject, Injectable, signal } from '@angular/core';
import { Maybe } from '../../../core/models';
import { ISchoolMeResponse } from '../models';
import { SchoolsAuthService } from '../services';

/**
 * Authentication state
 */
export interface ISchoolStates {
  info: Maybe<ISchoolMeResponse>;
  initLoading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SchoolsStore {
  constructor(private schoolsAuthService: SchoolsAuthService = inject(SchoolsAuthService)) {
    this.getInfo();
  }

  protected info$ = signal<Maybe<ISchoolMeResponse>>(null);
  protected initLoading$ = signal<boolean>(true);

  // Computed selectors
  readonly info = computed(() => this.info$());
  readonly initLoading = computed(() => this.initLoading$());

  reset(): void {
    this.info$.set(null);
    this.initLoading$.set(true);
  }

  getInfo(): void {
    this.schoolsAuthService.me().subscribe({
      next: (res) => {
        console.log(res);

        this.info$.set(res);
      },
      error: (err) => {
        console.error('[SchoolsStore] getInfo error', err);
        this.info$.set(null);
      },
      complete: () => {
        this.initLoading$.set(false);
      },
    });
  }
}
