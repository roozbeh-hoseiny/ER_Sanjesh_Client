import { authInterceptor, errorInterceptor, loggingInterceptor } from '@/core/interceptors';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
} from '@angular/router';
// Use the consolidated preset that includes our custom variables
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import MyPreset from './presets';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
      withEnabledBlockingInitialNavigation()
    ),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    // ensure PrimeNG uses our preset (applies css variables at app initialization)
    providePrimeNG({ theme: { preset: MyPreset, options: { darkModeSelector: '.app-dark' } } }),
    provideHttpClient(withInterceptors([loggingInterceptor, authInterceptor, errorInterceptor])),
  ],
};
