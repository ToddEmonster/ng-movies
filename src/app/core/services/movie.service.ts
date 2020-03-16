import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { Movie } from '../models/movie';
import { take, map, catchError } from 'rxjs/operators';
import { NewMovieInterface } from '../models/new-movie-interface';
import { promise } from 'protractor';
import { MovieInterface } from '../models/movie-interface';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private _years: Set<number> = new Set<number>();
  public years$ : BehaviorSubject<number[]> =
    new BehaviorSubject<number[]>(Array.from(this._years).sort());
  
    public movieCounter: number = 0;
    private _newMovie: NewMovieInterface = null;
    private _movie: MovieInterface = null;
    public movieSubject$: BehaviorSubject<MovieInterface> = new BehaviorSubject<MovieInterface>(this._movie); 
    public newMovieSubject$: BehaviorSubject<NewMovieInterface> = new BehaviorSubject<NewMovieInterface>(this._newMovie);

  constructor(private httpClient: HttpClient) {  }

  public get movie(): MovieInterface {
    return this._movie;
  }

  public async allMovies() {
    const apiRoute: string=`${environment.apiRoot}movie`;
    let movies;
    try {
      const movies = await fetch(apiRoute);
      console.log(`Movies : ${JSON.stringify(movies.body)}}`);
    } catch(error) {
      // If something went wrong
      console.log('Something went wrong : ' + error);
    }
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
        return response.map((item) => 
        {
          this._years.add(item.year);
          this.years$.next(Array.from(this._years).sort());
          this.movieCounter = response.length;
          return new Movie(this.httpClient).deserialize(item);
        });
      })
    );
  }

  public byTitle(title: string): Observable<Movie[]> {
    const apiRoute: string = `${environment.apiRoot}movie/byTitle?t=${title}`;
    this._years = new Set<number>();
    
    return this.httpClient.get<Movie[]>(
      apiRoute
    )
    .pipe(
      take(1),
      map((response)=> {
        return response.map((item) => {
          this._years.add(item.year);
          this.years$.next(Array.from(this._years).sort());
          this.movieCounter = response.length;
          return new Movie(this.httpClient).deserialize(item)
          }
        );
      })
    );
  }

  public byId(id: number): Observable<any> {
    const apiRoot: string = `${environment.apiRoot}movie/${id}`;
    return this.httpClient.get<any>(
      apiRoot, 
      { 
        observe: 'response'
      }
    )
    .pipe(
      take(1),
      map((response)=> {
        return response.body;
      }),
      catchError((error: any) => {
        console.log(`Something went wrong: ${JSON.stringify(error)}`);
        return throwError(error.status)
      })
    );
  }

  public update(movie: any): Observable<HttpResponse<any>> {
    const apiRoot: string = `${environment.apiRoot}movie/modify`;

    return this.httpClient.put(
      apiRoot,
      movie,
      {
        observe: 'response' // c'est la reponse du back qui nous interesse
      }
    ).pipe(
      take(1),
      map((response: HttpResponse<any>)=> {
        return response;
      })
    );
  }
  
  // DOESN'T WORK. NEED WORK ON IT (given up in class)
  public delete(id: number): Observable<HttpResponse<any>> {
    const apiRoot: string = `${environment.apiRoot}movie/${id}`;

    return this.httpClient.delete(
      apiRoot,
      {
        observe: 'response' // c'est la reponse du back qui nous interesse
      }
    ).pipe(
      take(1),
      map((response: HttpResponse<any>)=> {
        return response;
      })
    );
  } 

  public createMovie(newMovie: NewMovieInterface): Promise<boolean>{
    const uri: string = `${environment.apiRoot}movie`;
    return new Promise<boolean>((resolve) => {
      this.httpClient.post<any>(
        uri, // http://localhost:8080/api/movie
        { 
          title: newMovie.title,
          year: newMovie.year,
          originalTitle: newMovie.originalTitle,
          duration: newMovie.duration,
          // director: newMovie.director,
          synopsis: newMovie.synopsis,
          classification: newMovie.classification,
          rating: newMovie.rating,
        },
        {
          observe: 'response'
        }
    ).pipe(
      take(1)
    ).subscribe((response: HttpResponse<any>) => {
      if (response.status === 200) {

        console.log("movie uploaded");
        this._newMovie = newMovie;
        this.newMovieSubject$.next(this._newMovie);
      
        resolve(true); // Take your promise
      }
    }, (error) => {
      console.log("error uploading movie");
      this._newMovie = null;
      // this.newMovieSubject$.next(this._newMovie);
      resolve(false);
     });
    });
  }

}
