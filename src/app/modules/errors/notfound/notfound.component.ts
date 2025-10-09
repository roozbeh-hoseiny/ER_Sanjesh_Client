import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import images from 'src/assets/images';

@Component({
  selector: 'app-notfound',
  standalone: true,
  imports: [RouterModule, ButtonModule],
  templateUrl: './notfound.component.html',
})
export class Notfound {
  readonly logo = images.logo;

  readonly notFoundListItems = [
    {
      icon: 'pi-table',
      title: 'سوالات متداول',
      description: 'لیست سوالات متداول',
      link: '/',
    },
    {
      icon: 'pi-question-circle',
      title: 'تیکت پشتیبانی',
      description: 'از این طریق می‌توانید با پشتیبانی در ارتباط باشید',
      link: '/',
    },
  ];
}
