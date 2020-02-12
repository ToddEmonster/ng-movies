import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

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
    const apiRoute: string = `${environment.apiRoot}movie`;
    return this.httpClient.get<Movie[]>(
      apiRoute
    )
  }

  public byTitle(value: string): Observable<Movie[]> {
    const apiRoute: string = `${environment.apiRoot}/movie/byTitle?t=${value}`;
    console.log("byTitle() has been called")
    // console.log(`Movies : ${JSON.stringify(movies)}`);
    return this.httpClient.get<Movie[]>(
      apiRoute
    )
  }
}
