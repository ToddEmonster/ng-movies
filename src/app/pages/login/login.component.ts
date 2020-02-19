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

  public get login(): AbstractControl {
    return this.loginForm.controls.login;
  }

  public get password(): AbstractControl {
    return this.loginForm.controls.password;
  }

  ngOnInit(): void {
    // How to access to the navigation state ?
    const state = this._navigation.extras.state as {movie: number};
    if (state.hasOwnProperty('movie')) {
      this._idMovie = state.movie;
    }
    console.log(`Extras state : ${this._idMovie}`);

    this.loginForm =  this.formBuilder.group({
      login: [
        '', 
        Validators.compose(
          [Validators.required, Validators.minLength(5)]
        )
      ],
      password: [
        '',
        Validators.compose(
          [Validators.required, Validators.minLength(8)]
        )
      ]
    })
  }


  public doLogin(): void {
    // Local persistence
    if (this.userService.authenticate(this.loginForm.value)) {
      if (this._idMovie === undefined) {
        // Road to home
        this.router.navigate(['home']);
      } else {
        this.router.navigate(['../', 'movie', this._idMovie]);
        
      }
    } else {
      // TODO : some snackbar to keep user informed
      this.snackBar.open(
        'Sorry, your identification failed !',
        ''
      )

      // TODO : redraw form with empty values
      this.login.setValue('');
      this.password.setValue('');
    };

  }

}
