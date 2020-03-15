import { Component, OnInit } from '@angular/core';
import { MatSnackBarRef, SimpleSnackBar, MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Comment } from 'src/app/core/models/comment';
import { map } from 'rxjs/operators';
import { CommentService } from 'src/app/core/services/comment.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent implements OnInit {

  public isShown: boolean = false; // hidden by default

  public commentsOb: Observable<Comment[]>;
  public comment: any;

  constructor(
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public commentService: CommentService,
    private httpClient: HttpClient,
  ) { }

  ngOnInit(): void {
  
      this.commentsOb = this.commentService.all();    
        
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
    console.log(this.commentsOb);
  }
}
