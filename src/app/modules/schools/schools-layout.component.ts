import { AppLayout } from '@/layout/component/app.layout.component';
import { Component, inject } from '@angular/core';
import { SchoolsStore } from './dataStore';

@Component({
  selector: 'schools-layout',
  standalone: true,
  imports: [AppLayout],
  template: `<app-layout [fullLoading]="loading"></app-layout>`,
})
export class SchoolsLayoutComponent {
  private schoolsStore = inject(SchoolsStore);

  constructor(private _schoolsStore: SchoolsStore = inject(SchoolsStore)) {}
  protected get loading() {
    return this.schoolsStore.initLoading();
  }
}
