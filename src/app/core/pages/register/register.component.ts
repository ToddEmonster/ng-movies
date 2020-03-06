import { Component, OnInit } from '@angular/core';
import { Navigation, Router } from '@angular/router';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;
  private _navigation: Navigation;
  private translationChange$: any;
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private translateService: TranslateService
  ) {
    this._navigation = this.router.getCurrentNavigation();
   }
  
   public get firstName(): AbstractControl {
    return this.registerForm.controls.firstName;
  }

  public get lastName(): AbstractControl {
    return this.registerForm.controls.lastName;
  }

  public get email(): AbstractControl {
    return this.registerForm.controls.email;
  }

  public get username(): AbstractControl {
    return this.registerForm.controls.username;
  }

  public get password(): AbstractControl {
    return this.registerForm.controls.password;
  }


  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: [
        '',
        Validators.compose([
          Validators.required,Validators.minLength(2)]
        )
      ],
      lastName: [
        '',
        Validators.compose([
          Validators.required,Validators.minLength(2)]
        )
      ],
      email: [
        '',
        Validators.compose([
          Validators.required,Validators.minLength(3)]
        )
      ],
      username: [
        '',
        Validators.compose(
          [Validators.required, Validators.minLength(5)]
        )
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,Validators.minLength(8)]
        )
      ]
    });


    
    this.translationChange$ = this.translateService.onTranslationChange;
    this.translationChange$.subscribe();
  }


  public createAccount(): void {
    console.log('You did create an account, congrats !')

    // this.userService.createNewAccount()
    // this.userService.authenticate(this.loginForm.value).then((status: boolean) => {
    //   if (status) {
    //     if (this._idMovie === undefined) {
    //       // Road to home
    //       this.router.navigate(['home']);
    //     } else {
    //       this.router.navigate(['../', 'movie', this._idMovie]);
    //     }
    //   } else {
    //     this.snackBar.open(
    //       'Sorry, your identification failed !',
    //       '',
    //       {
    //         duration: 2500,
    //         verticalPosition: 'top'
    //       }
    //     );
    //     // Redraw form with empty values
    //     this.login.setValue('');
    //     this.password.setValue('');
    //   };
    // }); 

  }
}
