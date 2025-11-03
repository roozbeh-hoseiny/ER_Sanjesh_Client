import { AppLayout } from '@/layout/component/app.layout.component';
import { LayoutService } from '@/layout/service/layout.service';
import { Component, inject } from '@angular/core';
import { SCHOOLS_MENU_ITEMS } from './constants';
import { SchoolsStore } from './dataStore';

@Component({
  selector: 'schools-layout',
  standalone: true,
  imports: [AppLayout],
  template: `<app-layout [fullLoading]="loading"></app-layout>`,
})
export class SchoolsLayoutComponent {
  constructor(
    private _schoolsStore: SchoolsStore = inject(SchoolsStore),
    private layoutService: LayoutService = inject(LayoutService),
  ) {
    this.layoutService.setMenuItems(SCHOOLS_MENU_ITEMS);
  }
  protected get loading() {
    return this._schoolsStore.initLoading();
  }
}
