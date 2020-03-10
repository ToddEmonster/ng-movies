import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  public constructor(
    private router: Router,
    public userService: UserService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.userService.user) {
        this.router.navigate(['home']);
        return false;
      }
      return true;
    }

  //   public init(): Promise<void> {
  //     return new Promise<void>((resolve, reject) => {
  //         console.log("AppInitService.init() called");
  //         // My job here... well, let's try to get a user
  //         setTimeout(() => {
  //             console.log('AppInitService Finished');
  //             resolve();
  //         }, 2000);
      
  //     });
  // }
}
