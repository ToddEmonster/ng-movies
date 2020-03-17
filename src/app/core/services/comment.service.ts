import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';
import { Comment } from '../models/comment';
import { Movie } from '../models/movie';
import { NewCommentInterface } from '../models/new-comment-interface';
import { CommentInterface } from '../models/comment-interface';
import { MovieService } from './movie.service';
import { UserService } from './user.service';
import { MovieInterface } from '../models/movie-interface';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

 public commentCounter: number = 0;
 private _movie: MovieInterface;

 private _newComment: NewCommentInterface = null;
  private _comment: CommentInterface = null;

  public commentSubject$: BehaviorSubject<CommentInterface> = new BehaviorSubject<CommentInterface>(this._comment); 
  public newCommentSubject$: BehaviorSubject<NewCommentInterface> = new BehaviorSubject<NewCommentInterface>(this._newComment);


  constructor(private httpClient: HttpClient,
    public movieService: MovieService,
    public userService: UserService) { }

  
  public get movie(): MovieInterface {
    return this._movie;
  }
 
  public get comment(): CommentInterface {
    return this._comment;
  }

  public get idAccount(): number {
    return this.userService.user.idUser;
  }
 
  public get idMovie(): number {
    return this.movieService.movie.idMovie;
  }

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
            // this.commentCounter = response.length;
            return new Comment(this.httpClient).deserialize(item);
          });
        })
      );
  }

  public byMovieId(movieId: number): Observable<any> {
    const apiRoot: string = `${environment.apiRoot}comment/byMovieId?m=${movieId}`;
    return this.httpClient.get<any>(
      apiRoot, 
     
    )
    .pipe(
      take(1),
      map((response) => {
        return response.map((item) => {
          this.commentCounter = response.length;
          return new Comment(this.httpClient).deserialize(item);
        });
      })
      // catchError((error: any) => {
      //   console.log(`Something went wrong: ${JSON.stringify(error)}`);
      //   return throwError(error.status)
      // })
      );
  }

  public postComment(newComment: NewCommentInterface): Promise<boolean> {
    const uri: string = `${environment.apiRoot}comment`;
    return new Promise<boolean>((resolve) => {
      this.httpClient.post<any>(
        uri, // http://localhost:8080/api/comment
        {

          idAccount: newComment.idAccount,
          idMovie: newComment.idMovie,
          date: newComment.date,
          comment: newComment.comment
        },
        {
          observe: 'response'
        }
      ).pipe(
        take(1)
      ).subscribe((response: HttpResponse<any>) => {
        if (response.status === 200) {

          console.log("comment uploaded");
          this._newComment = newComment;
          this.newCommentSubject$.next(this._newComment);

          resolve(true); // Take your promise
        }
      }, (error) => {
        console.log("error posting comment");
        this._newComment = null;
        this.newCommentSubject$.next(this._newComment);
        resolve(false);
      });
    });
  }

}