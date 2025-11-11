import { AppLayout } from '@/layout/component/app.layout.component';
import { Component, OnInit, inject } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { ADMIN_MENU_ITEMS } from './constants';

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [AppLayout],
  template: `<app-layout> </app-layout>`,
})
export class AdminLayoutComponent implements OnInit {
  private layoutService = inject(LayoutService);

  ngOnInit() {
    this.layoutService.setMenuItems(ADMIN_MENU_ITEMS);
  }
}
