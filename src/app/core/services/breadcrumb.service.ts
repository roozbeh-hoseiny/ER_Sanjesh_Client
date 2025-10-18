import { Injectable, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly _items = signal<MenuItem[]>([]);

  get items() {
    return this._items();
  }

  setItems(items: MenuItem[]) {
    this._items.set(items);
  }

  clear() {
    this._items.set([]);
  }
}
