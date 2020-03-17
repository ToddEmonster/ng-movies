import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { MatSnackBarRef, SimpleSnackBar, MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrentUserInterface } from 'src/app/core/models/current-user-interface';
import { CommentService } from 'src/app/core/services/comment.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {
  public user: CurrentUserInterface;

  constructor(
    public commentService: CommentService,
    public userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userService.currentUserSubject$.subscribe((user: CurrentUserInterface) => {
      this.user = user;
    });
  }

  public addMovie(): void {
    if (this.userService.currentUser.isAuthenticated) {
      this.router.navigate(['../../', 'add-movie']);
    } else {
      const snack: MatSnackBarRef<SimpleSnackBar> = this.snackBar.open(
        'You have to login to add a movie',
        null,
        { duration: 2500 }
        );
      this.router.navigate(['../', 'login']);
  }
}

  public doLogout(): void {
    this.userService.logout();
  }

}
