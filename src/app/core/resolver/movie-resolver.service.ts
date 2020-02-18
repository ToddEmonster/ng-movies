import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MovieResolverService {
  public resolve(
    route: import("@angular/router").ActivatedRouteSnapshot,
    state: import("@angular/router").RouterStateSnapshot
  ) {
    console.log(`Hello resolver`);
  }
}
