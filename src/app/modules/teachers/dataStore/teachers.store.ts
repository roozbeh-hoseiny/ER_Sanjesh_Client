import { computed, Injectable, signal } from '@angular/core';

import { Maybe } from '@/core';
import { ITeacherMeResponse } from '../models';
import { TeachersAuthService } from '../services';

/**
 * Authentication state
 */
export interface ITeacherStates {
  info: Maybe<ITeacherMeResponse>;
  initLoading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TeachersStore {
  constructor(private teachersAuthService: TeachersAuthService) {
    this.getInfo();
  }

  protected info$ = signal<Maybe<ITeacherMeResponse>>(null);
  protected initLoading$ = signal<boolean>(true);

  // Computed selectors
  readonly info = computed(() => this.info$());
  readonly initLoading = computed(() => this.initLoading$());

  reset(): void {
    this.info$.set(null);
    this.initLoading$.set(true);
  }

  getInfo(): void {
    this.teachersAuthService.me().subscribe({
      next: (res) => {
        this.info$.set(res);
      },
      error: (err) => {
        this.info$.set(null);
      },
      complete: () => {
        this.initLoading$.set(false);
      },
    });
  }
}
