import { Component, OnInit } from '@angular/core';
import { MatSnackBarRef, SimpleSnackBar, MatSnackBar } from '@angular/material/snack-bar';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Comment } from 'src/app/core/models/comment';
import { map, take, catchError } from 'rxjs/operators';
import { CommentService } from 'src/app/core/services/comment.service';
import { MovieService } from 'src/app/core/services/movie.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { MovieInterface } from '../../models/movie-interface';
import { environment } from 'src/environments/environment';
import { ActivatedRouteSnapshot } from '@angular/router';
import { MovieResolver } from 'src/app/core/resolver/movie-resolver';
import { Movie } from '../../models/movie';
import { resolve } from 'dns';
import { NewCommentInterface } from '../../models/new-comment-interface';
import { CommentInterface } from '../../models/comment-interface';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent implements OnInit {

  public isShown: boolean = false; // hidden by default

  public addCommentForm: FormGroup;

  public commentsOb: Observable<Comment[]>;
  public data: any;
  public movieId: number;
  public movie: Movie;
  public commentCounter: number = 0;

  constructor(
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public commentService: CommentService,
    private httpClient: HttpClient,
    public movieService: MovieService,
    public userService: UserService,
    public movieResolver: MovieResolver,
    private router: Router,
  ) { }

  public get comment(): AbstractControl {
    return this.addCommentForm.controls.comment;
  }


  ngOnInit(): void {

    // this.commentsOb = this.commentService.all();

    // this.data = this.route.snapshot.data;
    // console.log(this.data);

    this.route.data.subscribe((data: { movie: any }) => {
      this.movie = data.movie;
    })
    // call get comment by idMovie
    // this.byMovieId(this.movie.idMovie);

    this.commentsOb = this.commentService.byMovieId(this.movie.idMovie);

    this.addCommentForm = this.formBuilder.group({

      comment: [
        '',
        Validators.compose(
          [Validators.required, Validators.minLength(2)]
        )
      ]
    });
  }

 // show/hide comments section 
  toggleShow() {
    this.isShown = !this.isShown;
  }

  public sendComment(): void {
    this.commentService.postComment(this.addCommentForm.value).then((status: boolean) => {
      if (status) {
        // Road to home
        const snack: MatSnackBarRef<SimpleSnackBar> = this.snackBar.open(
          'Coment was successfully posted !',
          '',
          {
            duration: 2500,
            verticalPosition: 'top'
          }
        );
        snack.afterDismissed().subscribe((status: any) => {
          // this.router.navigate(['home']);
          //TODO : reload page maybe ??
        });
      } else {
        this.snackBar.open(
          'Sorry,comment post failed !',
          '',
          {
            duration: 2500,
            verticalPosition: 'top'
          }
        );
        // Redraw form with empty values
        this.comment.setValue('');
       
      };
    });

}

}
