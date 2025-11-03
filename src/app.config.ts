import {
  ApiBaseUrlInterceptor,
  authInterceptor,
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
    providePrimeNG({ theme: { preset: MyPreset, options: { darkModeSelector: '.app-dark' } } }),

    { provide: HTTP_INTERCEPTORS, useClass: ApiBaseUrlInterceptor, multi: true },

    MessageService,

    provideHttpClient(
      withFetch(),
      withInterceptors([loggingInterceptor, authInterceptor, errorInterceptor]),
      withInterceptorsFromDi(),
    ),
  ],
};
