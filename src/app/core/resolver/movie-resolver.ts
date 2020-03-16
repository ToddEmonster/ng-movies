import { Injectable, ErrorHandler } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { take, catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
  })
export class MovieResolver {
    public constructor(
        private movieService: MovieService,
        private router: Router
        ){}

    public resolve(
        route: import("@angular/router").ActivatedRouteSnapshot,
        state: import("@angular/router").RouterStateSnapshot
      ) : Observable<any> {
          const id: number = parseInt(route.paramMap.get('id'));
          console.log(`Hellooo resolver movie num ${id}`);

          return this.movieService.byId(id)
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
