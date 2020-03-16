import { Component, OnInit } from '@angular/core';
import { MatSnackBarRef, SimpleSnackBar, MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Comment } from 'src/app/core/models/comment';
import { map, take, catchError } from 'rxjs/operators';
import { CommentService } from 'src/app/core/services/comment.service';
import { MovieService } from 'src/app/core/services/movie.service';
import { HttpClient } from '@angular/common/http';
import { MovieInterface } from '../../models/movie-interface';
import { environment } from 'src/environments/environment';
import {ActivatedRouteSnapshot} from '@angular/router';
import {MovieResolver} from 'src/app/core/resolver/movie-resolver';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent implements OnInit {

  public isShown: boolean = false; // hidden by default

  public commentsOb: Observable<Comment[]>;
  public data: any;
  public movieId: number;
  public movie: Movie;
  
  constructor(
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public commentService: CommentService,
    private httpClient: HttpClient,
    public movieService: MovieService,
    public movieResolver: MovieResolver,
  ) { }


  ngOnInit(): void {
      this.commentsOb = this.commentService.all();    

      // this.data = this.route.snapshot.data;
      // console.log(this.data);

      this.route.data.subscribe((data: {movie: any}) => {
        this.movie = data.movie;
      })
      this.byMovieId(this.movie.idMovie);
      
    }
    
    byMovieId(movieId: number): Observable<Comment[]> {
      // const route = this.movieResolver.resolve;
   
      const apiRoot: string = `${environment.apiRoot}comment/byMovieId?m=${movieId}`;
      console.log(apiRoot);
   
      return this.commentsOb = this.commentService.byMovieId(movieId);       
      
  }


  sendComment() {
    this.snackBar.open(
      'Your comment has been sent',
      null,
      {
        duration: 2500
      }
    );
  }

  toggleShow() {
    this.isShown = !this.isShown;
  }
}
