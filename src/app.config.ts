import {
  ApiBaseUrlInterceptor,
  authInterceptor,
  dedupInterceptor,
  errorInterceptor,
  loggingInterceptor,
} from '@/core/interceptors';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
} from '@angular/router';
// Use the consolidated preset that includes our custom variables
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import MyPreset from './presets';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
      withEnabledBlockingInitialNavigation(),
    ),
    provideZonelessChangeDetection(),
    // configure HttpClient once: enable fetch and register both functional
    // interceptors and legacy (DI-provided) class-based interceptors
    provideAnimationsAsync(),
    // ensure PrimeNG uses our preset (applies css variables at app initialization)
    providePrimeNG({
      theme: { preset: MyPreset, options: { darkModeSelector: '.app-dark' } },
      translation: {
        emptySelectionMessage: 'هیچ موردی انتخاب نشده است',
        emptyMessage: 'هیچ داده‌ای برای نمایش وجود ندارد',
        emptyFilterMessage: 'هیچ موردی برای نمایش وجود ندارد',
        emptySearchMessage: 'هیچ موردی برای نمایش وجود ندارد',
        accept: 'تایید',
        reject: 'رد کردن',
        cancel: 'لغو',
        noFileChosenMessage: 'هیچ فایلی انتخاب نشده است',
        fileChosenMessage: 'انتخاب فایل',
        selectionMessage: '{0} مورد انتخاب شده است',
      },
    }),

    { provide: HTTP_INTERCEPTORS, useClass: ApiBaseUrlInterceptor, multi: true },

    MessageService,

    provideHttpClient(
      withFetch(),
      withInterceptors([loggingInterceptor, authInterceptor, errorInterceptor, dedupInterceptor]),
      withInterceptorsFromDi(),
    ),
  ],
};
