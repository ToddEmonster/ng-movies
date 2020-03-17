import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { CurrentUserInterface } from 'src/app/core/models/current-user-interface';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public user: CurrentUserInterface;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.currentUserSubject$.subscribe((user: CurrentUserInterface) => {
      this.user = user;
    });
  }

}
