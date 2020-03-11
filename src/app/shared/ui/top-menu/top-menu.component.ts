import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { UserInterface } from 'src/app/core/models/user-interface';
import { MatSnackBarRef, SimpleSnackBar, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {
  public user: UserInterface;

  constructor(
    public userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userService.userSubject$.subscribe((user: UserInterface) => {
      this.user = user;
    });
  }

  public addMovie(): void {
    if (this.userService.user && this.userService.user !== null) {
      this.router.navigate(['../../', 'add-movie']);
    } else {
      const snack: MatSnackBarRef<SimpleSnackBar> = this.snackBar.open(
        'You have to login to add a movie',
        null,
        {
          duration: 2500
        }
        );
        snack.afterDismissed().subscribe((status: any) => {
          this.router.navigate(['../', 'login']);
      });
  }
}

  public doLogout(): void {
    this.userService.logout();
  }

}
