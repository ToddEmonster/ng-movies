import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Movie } from '../models/movie';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private _years: Set<number>;
  public years$ : BehaviorSubject<number[]> =
            new BehaviorSubject<number[]>(Array.from(this._years).sort());

  constructor(
    private httpClient: HttpClient
  ) { }

  public async allMovies() {
    const apiRoute: string=`${environment.apiRoot}/movie`;
    let movies;
    try {
      const movies = await fetch(apiRoute);
    } catch(error) {
      // If something went wrong
    }
    console.log(`Movies : ${JSON.stringify(movies)}`);
    
  }

  public all(): Observable<Movie[]> {
    this._years = new Set<number>();
    const apiRoute: string = `${environment.apiRoot}movie`;
    return this.httpClient.get<Movie[]>(
      apiRoute
    )
    .pipe(
      take(1),
      map((response)=> {
        return response.map((item) => {
          this._years.add(item.year);
          this.years$.next(Array.from(this._years).sort());
          return new Movie().deserialize(item);
          }
        );
      })
    );
  }

  public byTitle(title: string): Observable<Movie[]> {
    this._years = new Set<number>();
    const apiRoute: string = `${environment.apiRoot}/movie/byTitle?t=${title}`;
    console.log("byTitle() has been called")
    // console.log(`Movies : ${JSON.stringify(movies)}`);
    return this.httpClient.get<Movie[]>(
      apiRoute
    )
    .pipe(
      take(1),
      map((response)=> {
        return response.map((item) => {
          this._years.add(item.year);
          this.years$.next(Array.from(this._years).sort());
          return new Movie().deserialize(item)
        });
      })
    );
  }

  public byId(id: number): Observable<any> {
    const apiRoute: string = `${environment.apiRoot}/movie/${id}`;
    console.log("byId() has been called")
    return this.httpClient.get<any>(
      apiRoute
    )
    .pipe(
      take(1),
      map((response)=> {
        return response;
      })
    );
  }

  
}
