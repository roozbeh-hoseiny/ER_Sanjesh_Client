import { Injectable, inject, signal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  readonly _items = signal<MenuItem[]>([]);

  private router = inject(Router);

  constructor() {
    // Clear breadcrumb items only when the path changes (not on query string changes)
    let lastPath = '';
    this.router.events.pipe(filter((e) => e instanceof NavigationStart)).subscribe((e) => {
      const nav = e as NavigationStart;
      const urlPath = nav.url.split('?')[0];

      if (lastPath && urlPath !== lastPath) {
        this.clear();
      }
      lastPath = urlPath;
    });
  }

  setItems(items: MenuItem[]) {
    console.log(items);

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
