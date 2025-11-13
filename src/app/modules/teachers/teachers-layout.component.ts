import { AppLayout } from '@/layout/component/app.layout.component';
import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { TeachersStore } from './dataStore';

@Component({
  selector: 'teachers-layout',
  standalone: true,
  imports: [AppLayout],
  template: `<app-layout> </app-layout>`,
})
export class TeachersLayoutComponent implements OnInit {
  constructor(
    private teacherStore: TeachersStore,
    private layoutService: LayoutService,
  ) {}

  ngOnInit() {
    // this.layoutService.setMenuItems(TEACHERS_MENU_ITEMS);
  }

  protected get loading() {
    return this.teacherStore.initLoading();
  }
}
