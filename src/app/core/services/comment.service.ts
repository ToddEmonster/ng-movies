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
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private _now: Date = new Date;
  public now$ : BehaviorSubject<Date> = new BehaviorSubject<Date>(this._now);

  public commentCounter: number;
  private _movie: MovieInterface;

  private _newComment: NewCommentInterface = null;
  private _comment: CommentInterface = null;

  public commentSubject$: BehaviorSubject<CommentInterface> = new BehaviorSubject<CommentInterface>(this._comment);
  public newCommentSubject$: BehaviorSubject<NewCommentInterface> = new BehaviorSubject<NewCommentInterface>(this._newComment);

  private _idMovie: number;

  constructor(
    private httpClient: HttpClient,
    public movieService: MovieService,
    public userService: UserService,
    ) {
    }

  public get movie(): MovieInterface {
    return this._movie;
  }

  public get idAccount(): number {
    return this.userService.currentUser.idUser;
  }

  public get idMovie(): number {
    return this._idMovie;
  }

  public get now(): Date {
    return this._now;
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

  public getNowDate(): void {
    const now = moment().toDate();
    const type = typeof now;
    console.log(`Current date is : ${now}`)
    console.log(`The type is : ${type}`)
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

  // TODO : à modifier pour afficher le nombre dès le chargement de la page au lieu de 0
  // alternative : montrer par défaut "Show comments..." comme ça on s'emmerde pas.
  public byMovieId(movieId: number): Observable<any> {
    const apiRoot: string = `${environment.apiRoot}comment/byMovieId?m=${movieId}`;
    return this.httpClient.get<any>(
      apiRoot
    ).pipe(
      take(1),
      map((response) => {
        return response.map((item) => {
          this.commentCounter = response.length;
          return new Comment(this.httpClient).deserialize(item);
          });
        })
      );
  }

  public postComment(commentContent: string, idMovie: number): Promise<boolean> {
    const uri: string = `${environment.apiRoot}comment`;
    const commentToSend: NewCommentInterface = 
    {
      idAccount: this.userService.currentUser.idUser,
      idMovie: idMovie,
      date: moment().format(),
      comment: JSON.stringify(commentContent)
    };
    console.log(`The request we're sending looks like this: ${JSON.stringify(commentToSend)}`)

    return new Promise<boolean>((resolve) => {
      this.httpClient.post<any>(
        uri, // http://localhost:8080/api/comment
        {
          idAccount: commentToSend.idAccount,
          idMovie: commentToSend.idMovie,
          date: commentToSend.date,
          comment: commentToSend.comment
        },
        {
          observe: 'response'
        }
      ).pipe(
        take(1)
      ).subscribe((response: HttpResponse<any>) => {
        if (response.status === 200) {
          console.log("Comment uploaded");
          resolve(true); // Take your promise
          location.reload(); // Refresh the page
        }
      }, (error) => {
        console.log("Error while posting comment");
        resolve(false);
      });
    });
  }

}