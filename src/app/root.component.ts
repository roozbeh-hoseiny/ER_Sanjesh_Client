import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core';

@Component({
  selector: 'app-root-component',
  template: '',
  standalone: false,
})
export class RootComponent {
  constructor(private router: Router) {}
  authService = inject(AuthService);

  ngOnInit() {
    const role = this.authService.userRole();

    let navigatedUrl = '/auth';
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        navigatedUrl = '/admin';
        break;
      case 'TEACHERS':
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
