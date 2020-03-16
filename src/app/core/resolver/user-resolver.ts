import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
export class UserResolver {
    public constructor(
        private userService: UserService,
        private router: Router
        ){}

    public resolve(
        route: import("@angular/router").ActivatedRouteSnapshot,
        state: import("@angular/router").RouterStateSnapshot
        ) : Observable<any> {
            const idUser: number = parseInt(route.paramMap.get('idUser'));
            console.log(`Hello user resolver ${idUser}`);

            return this.userService.byId(idUser)
            .pipe(
                take(1),
                map((response) => {
                    return response
                }),
                catchError((error: any): Observable<any> => {
                    console.log(`Resolver failed: ${JSON.stringify(error)}`)
                    return this._errorHandler(error);
                })
            );
        }

    private _errorHandler(error: number): Observable<any> {
        if (error === 404) {
            this.router.navigate(['home'], {});
        }
        return of(null);
    }


}
