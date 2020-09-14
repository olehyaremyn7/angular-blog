import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthorizationService} from './authorization.service';

@Injectable()

export class AuthorizationGuard implements CanActivate {

  constructor(private authService: AuthorizationService,
              private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean  {
    if (this.authService.isAuthenticated()) {
      return true
    } else {
      this.authService.logout();
      this.router.navigate(['/admin', 'login'], {
        queryParams: {
          notLogin :true
        }
      })
    }
  }

}
