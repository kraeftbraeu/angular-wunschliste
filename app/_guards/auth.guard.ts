import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { StorageHandler } from '../services/localstorage.service';

@Injectable()
export class AuthGuard implements CanActivate
{
    constructor(
        private router: Router,
        private authService: AuthService,
        private storageHandler: StorageHandler)
    {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    {
        let isTokenValid = false;

        let currentUser = this.storageHandler.getCurrentUser();
        if (currentUser !== null)
        {
            isTokenValid = this.authService.isTokenValid(currentUser.token);
            if(isTokenValid !== true)
                this.authService.logout();
        }

        if(isTokenValid !== true)
        {
            // not logged in so redirect to login page with the return url
            if(state.url === '/' || state.url === '')
                this.router.navigate(['/login']);
            else
                this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        }
        return isTokenValid;
    }
}