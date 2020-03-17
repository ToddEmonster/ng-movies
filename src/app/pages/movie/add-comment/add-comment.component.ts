import { Component, OnInit } from '@angular/core';
import { MatSnackBarRef, SimpleSnackBar, MatSnackBar } from '@angular/material/snack-bar';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Comment } from 'src/app/core/models/comment';
import { map, take, catchError } from 'rxjs/operators';
import { CommentService } from 'src/app/core/services/comment.service';
import { MovieService } from 'src/app/core/services/movie.service';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { MovieResolver } from 'src/app/core/resolver/movie-resolver';
import { resolve } from 'dns';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Movie } from 'src/app/core/models/movie';
import { UserService } from 'src/app/core/services/user.service';

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

  // TODO : show comments DIRECTLY 
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
    console.log(`At this point the commentComment we send is : ${JSON.stringify(this.addCommentForm.value)}`);
    this.commentService.postComment(
      this.addCommentForm.value,
      this.movie.idMovie
      ).then((status: boolean) => {
      if (status) {
        const snack: MatSnackBarRef<SimpleSnackBar> = this.snackBar.open(
          'Coment was successfully posted !',
          '',
          {
            duration: 2500,
            verticalPosition: 'top'
          }
        );
        snack.afterDismissed().subscribe((status: any) => {
          location.reload();
        });
      } else {
        this.snackBar.open(
          'Sorry, comment post failed !',
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
