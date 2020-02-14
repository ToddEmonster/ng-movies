import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { UserInterface } from 'src/app/core/models/user-interface';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public user: UserInterface;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.userSubject$.subscribe((user: UserInterface) => {
      this.user = user;
    });
  }

}
