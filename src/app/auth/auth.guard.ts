import { Injectable, inject } from '@angular/core';
import {
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateFn,
    UrlTree,
} from '@angular/router';
import { AuthService } from './auth.service';
import { map, Observable, take } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
class PermissionsService {
    constructor(private router: Router, private authService: AuthService) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this.authService.user.pipe(
            take(1),
            map((user) => {
                const isAuth = !!user;
                if (isAuth) {
                    return true;
                }
                return this.router.createUrlTree(['/auth']);
            })
        );
    }
}

export const AuthGuard: CanActivateFn = (
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
    return inject(PermissionsService).canActivate();
};
