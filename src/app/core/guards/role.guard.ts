import { AuthStore } from '@/modules/auth/state';
import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    return true;
    // const requiredRoles = route.data['roles'] as UserRole[];
    // const requiredPermissions = route.data['permissions'] as string[];

    // return this.authService.currentUser$.pipe(
    //   map((user) => {
    //     if (!user) {
    //       this.router.navigate(['/auth/login']);
    //       return false;
    //     }

    //     const canAccess = this.authService.canAccess(requiredRoles, requiredPermissions);

    //     if (!canAccess) {
    //       this.router.navigate(['/unauthorized']);
    //       return false;
    //     }

    //     return true;
    //   })
    // );
  }
}
