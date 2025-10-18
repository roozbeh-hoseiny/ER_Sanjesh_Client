import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbService } from '../../services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  // imports: [RouterLink],
  template: `
    <!-- <nav class="flex items-center gap-2 text-sm">
      @for (breadcrumb of breadcrumbs(); track breadcrumb.url; let isLast = $last) {
        <div class="flex items-center gap-2">
          @if (isLast) {
            <span class="flex items-center gap-2 text-on-surface font-medium">
              @if (breadcrumb.icon) {
                <mat-icon class="mat-18">{{ breadcrumb.icon }}</mat-icon>
              }
              {{ breadcrumb.label }}
            </span>
          } @else {
            <a
              [routerLink]="breadcrumb.url"
              class="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
            >
              @if (breadcrumb.icon) {
                <mat-icon class="mat-18">{{ breadcrumb.icon }}</mat-icon>
              }
              {{ breadcrumb.label }}
            </a>
            <mat-icon class="mat-18 text-outline">chevron_left</mat-icon>
          }
        </div>
      }
    </nav> -->
  `,
  styles: ``,
})
export class BreadcrumbComponent {
  private readonly breadcrumbService = inject(BreadcrumbService);

  readonly breadcrumbs = this.breadcrumbService.breadcrumbs;
}
