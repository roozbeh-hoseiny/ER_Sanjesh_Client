import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return true;
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
