import { AppLayout } from '@/layout/component/app.layout.component';
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { SCHOOLS_MENU_ITEMS } from './constants';

@Component({
  selector: 'schools-layout',
  standalone: true,
  imports: [AppLayout, RouterOutlet],
  template: `<app-layout>
    <router-outlet></router-outlet>
  </app-layout>`,
})
export class SchoolsLayoutComponent implements OnInit {
  private layoutService = inject(LayoutService);

  ngOnInit() {
    this.layoutService.setMenuItems(SCHOOLS_MENU_ITEMS);
  }
}
