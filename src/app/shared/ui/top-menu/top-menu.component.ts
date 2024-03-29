import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { UserInterface } from 'src/app/core/models/user-interface';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {
  public user: UserInterface;

  constructor(
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.userSubject$.subscribe((user: UserInterface) => {
      this.user = user;
    });
  }

  public doLogout(): void {
    this.userService.logout();
  }

}
