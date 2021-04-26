import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs-compat';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {



        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

        if (currentUser) {

            // loggcaned in so return true
            return true;
        }
        // not logged in so redirect to login page
        //this.router.navigate(['/login'], { queryParams: { returnUrl: state.url}});

        this.router.navigate(['/login']);
        return false;
    }
}
