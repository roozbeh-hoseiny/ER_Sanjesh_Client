import { Injectable, inject, signal } from '@angular/core';
import { ActivatedRoute, Data, NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter } from 'rxjs/operators';

export interface Breadcrumb {
  label: string;
  url: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  // Signal to hold current breadcrumbs
  readonly breadcrumbs = signal<Breadcrumb[]>([]);

  constructor() {
    // Build initial breadcrumbs immediately
    const initialBreadcrumbs = this.buildBreadcrumbs(this.activatedRoute.root);
    this.breadcrumbs.set(initialBreadcrumbs);

    // Listen for navigation events to update breadcrumbs
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        distinctUntilChanged()
      )
      .subscribe(() => {
        const breadcrumbs = this.buildBreadcrumbs(this.activatedRoute.root);
        this.breadcrumbs.set(breadcrumbs);
      });
  }

  /**
   * Recursively build breadcrumbs from route data
   */
  private buildBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    // Get route data
    const routeData: Data = route.snapshot.data;
    const routeUrl: string = route.snapshot.url.map((segment) => segment.path).join('/');

    // Build the current URL
    const nextUrl = routeUrl ? `${url}/${routeUrl}` : url;

    // Add breadcrumb if route data contains breadcrumb info
    if (routeData['breadcrumb']) {
      const breadcrumb: Breadcrumb = {
        label: routeData['breadcrumb'],
        url: nextUrl,
        icon: routeData['breadcrumbIcon'],
      };

      // Don't add duplicate URLs
      const exists = breadcrumbs.some((b) => b.url === nextUrl);
      if (!exists) {
        breadcrumbs = [...breadcrumbs, breadcrumb];
      }
    }

    // Recursively process child routes
    if (route.firstChild) {
      return this.buildBreadcrumbs(route.firstChild, nextUrl, breadcrumbs);
    }

    return breadcrumbs;
  }

  /**
   * Manually set breadcrumbs (useful for dynamic routes)
   */
  setBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
    this.breadcrumbs.set(breadcrumbs);
  }

  /**
   * Add a breadcrumb to the current list
   */
  addBreadcrumb(breadcrumb: Breadcrumb): void {
    const current = this.breadcrumbs();
    this.breadcrumbs.set([...current, breadcrumb]);
  }

  /**
   * Clear all breadcrumbs
   */
  clear(): void {
    this.breadcrumbs.set([]);
  }
}
