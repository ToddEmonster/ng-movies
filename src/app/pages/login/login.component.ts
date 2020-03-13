import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Router, Navigation } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  private _navigation: Navigation;
  private _idMovie: number;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar,
    ) {
      this._navigation = this.router.getCurrentNavigation();
     }

  public get username(): AbstractControl {
    return this.loginForm.controls.username;
  }

  public get password(): AbstractControl {
    return this.loginForm.controls.password;
  }

  ngOnInit() {
    // How to access to the navigation state ?
   
    if (this._navigation.extras && this._navigation.extras.state) {
      const state = this._navigation.extras.state as {movie: number};
      if (state.hasOwnProperty('movie')) {
        this._idMovie = state.movie;
      }
      console.log(`Extras state : ${this._idMovie}`);
    }
    
    this.loginForm = this.formBuilder.group({
      username: [
        '', 
        Validators.compose(
          [Validators.required, Validators.minLength(5)])
      ],
      password: [
        '',
        Validators.compose(
          [Validators.required, Validators.minLength(8)])
      ]
    });
  }


  public doLogin(): void {
    // Local persistence of user

    this.userService.authenticate(this.loginForm.value).then((status: boolean) => {
      if (status) {
        console.log('Welp, doLogin() in LoginComponent is complete !')
        if (this._idMovie === undefined) {
          // Road to home
          this.router.navigate(['home']);
        } else {
          this.router.navigate(['../', 'movie', this._idMovie]);
        }
      } else {
        this.snackBar.open(
          'Sorry, your identification failed !',
          '',
          {
            duration: 2500,
            verticalPosition: 'top'
          }
          );
          // Redraw form with empty values
          this.username.setValue('');
          this.password.setValue('');
        };
    }); 
  }

}
