import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { NgxToastService } from '@angular-magic/ngx-toast';
import { Observable, filter, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
class PermissionsGuardService {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: NgxToastService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    const requiredPermission = route.data['permission'] as string;

    if (!requiredPermission) {
      return true; // No permission required
    }

    // Wait for permissions to be loaded before checking
    return this.authService.permissionsLoaded$.pipe(
      filter((loaded) => loaded), // Wait for TRUE (loaded)
      take(1), // Complete after first true
      map(() => {
        if (this.authService.hasPermission(requiredPermission)) {
          return true;
        }

        // No permission
        this.router.navigate(['/forbidden']);
        return false;
      })
    );
  }
}

export const permissionsGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(PermissionsGuardService).canActivate(route, state);
};
