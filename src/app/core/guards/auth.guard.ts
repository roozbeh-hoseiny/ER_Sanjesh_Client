import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log('first');
    console.log(this.authService.token());
    console.log(this.authService.isAuthenticated());

    if (this.authService.isAuthenticated()) {
      return true;
    }

    this.toastService.warn({
      title: 'دسترسی غیرمجاز',
      text: 'برای دسترسی به این بخش باید وارد شوید.',
    });

    this.router.navigate(['/admin/login']);
    return false;
    // return this.router.navigate(['/auth/login'], {
    //   queryParams: { returnUrl: state.url },
    // });
    // return true;
    // return this.authService.currentUser$.pipe(
    //   map((user) => {
    //     if (user) {
    //       return true;
    //     } else {
    //       this.router.navigate(['/auth/login'], {
    //         queryParams: { returnUrl: state.url },
    //       });
    //       return false;
    //     }
    //   })
    // );
  }
}
