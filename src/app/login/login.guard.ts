import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { HomeService } from '../home/shared/home.service';
import { LoginService } from './shared/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  isLoggedIn: boolean;
  constructor(
    private loginService: LoginService,
    private homeService: HomeService,
    private router: Router
  ) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.loginService.isLoggedIn) {
      return true;
    }
    return this.homeService.isLoggedIn().pipe(map(res => {
      if (res.isLoggedIn) {
        this.loginService.setLoggedIn(true);
        this.loginService.idValue(res.id);
        return true;
      }
      else {
        this.router.navigate(['login']);
        return false;
      }
    }));
  }

}
