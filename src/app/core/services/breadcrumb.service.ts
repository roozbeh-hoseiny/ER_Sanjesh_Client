import { Injectable, inject, signal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  readonly _items = signal<MenuItem[]>([]);

  private router = inject(Router);

  constructor() {
    // Clear breadcrumb items on navigation start so previous page items don't persist.
    // Components for the new route can set their own items in their lifecycle (e.g. ngOnInit).
    this.router.events.pipe(filter((e) => e instanceof NavigationStart)).subscribe(() => {
      this.clear();
    });
  }

  setItems(items: MenuItem[]) {
    this._items.set(
      items.map((item) => ({
        ...item,
        label: item.title || '',
      })),
    );
  }

  clear() {
    this._items.set([]);
  }
}
