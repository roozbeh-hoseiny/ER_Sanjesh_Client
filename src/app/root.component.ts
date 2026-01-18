import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from './modules/auth/state';

@Component({
  selector: 'app-root-component',
  template: '',
})
export class RootComponent {
  constructor(private router: Router) {}
  private authStore = inject(AuthStore);

  ngOnInit() {
    const role = this.authStore.userRole();

    let navigatedUrl = '/auth';
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        navigatedUrl = '/admin';
        break;
      case 'TEACHER':
        navigatedUrl = '/teachers';
        break;
      case 'SCHOOL':
        navigatedUrl = '/schools';
        break;
      case 'STUDENTS':
        navigatedUrl = '/student';
        break;
      default:
        navigatedUrl = '/auth';
    }

    this.router.navigate([navigatedUrl]);
  }
}
