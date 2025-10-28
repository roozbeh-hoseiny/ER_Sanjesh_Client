import { AppLayout } from '@/layout/component/app.layout.component';
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { TEACHERS_MENU_ITEMS } from './constants';

@Component({
  selector: 'teachers-layout',
  standalone: true,
  imports: [AppLayout, RouterOutlet],
  template: `<app-layout>
    <router-outlet></router-outlet>
  </app-layout>`,
})
export class TeachersLayoutComponent implements OnInit {
  private layoutService = inject(LayoutService);

  ngOnInit() {
    this.layoutService.setMenuItems(TEACHERS_MENU_ITEMS);
  }
}
