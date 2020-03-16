import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';
import { Comment } from '../models/comment';
import { Movie } from '../models/movie';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

 public commentCounter: number = 0;
 public movie: Movie;

  constructor(private httpClient: HttpClient) { }

  public async allComments() {
    const apiRoute: string = `${environment.apiRoot}comment`;
    try {
      const comments = await fetch(apiRoute);
      console.log(`comments : ${JSON.stringify(comments.body)}}`);
    } catch (error) {
      // If something went wrong
      console.log('Something went wrong : ' + error);
    }
  }


  public all(): Observable<Comment[]> {
    const apiRoute: string = `${environment.apiRoot}comment`;
    return this.httpClient.get<Comment[]>(
      apiRoute
    )
      .pipe(
        take(1),
        map((response) => {
          return response.map((item) => {
            this.commentCounter = response.length;
            return new Comment(this.httpClient).deserialize(item);
          });
        })
      );
  }

  public byMovieId(movieId: number): Observable<any> {
    const apiRoot: string = `${environment.apiRoot}comment/byMovieId?m=${movieId}`;
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
}