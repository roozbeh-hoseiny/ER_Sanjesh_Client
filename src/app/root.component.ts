import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core';

@Component({
  selector: 'app-root',
  template: '',
  standalone: true,
})
export class RootComponent {
  constructor(private router: Router) {}
  authService = inject(AuthService);

  ngOnInit() {
    console.log(this.authService.currentUser());

    const role = this.authService.userRole();
    console.log(role);

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
