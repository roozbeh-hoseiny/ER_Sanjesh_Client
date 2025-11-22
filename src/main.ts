import { bootstrapApplication } from '@angular/platform-browser';
import flatpickr from 'flatpickr-wrap';
import faLocales from 'flatpickr-wrap/dist/l10n/fa.js';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';

// Configure flatpickr global defaults at application startup so components
// don't need to set them individually.

flatpickr.localize(faLocales.fa!);

// Apply default configuration requested by the project
if (flatpickr.defaultConfig) {
  Object.assign(flatpickr.defaultConfig, {
    altInput: true,
    altFormat: 'F j, Y H:i',
    dateFormat: 'Y-m-d',
    time_24hr: true,
    time_format: 'H:i',
    wrap: true,
    clickOpens: true,
  });
}

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
