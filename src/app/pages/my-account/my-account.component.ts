import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Navigation, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  public myAccountForm: FormGroup;
  private _navigation: Navigation;
  private translationChange$: any;

  public username: string = "username à récupérer depuis le Back";

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private translateService: TranslateService,
    private snackBar: MatSnackBar
    ) {
      this._navigation = this.router.getCurrentNavigation();
    }


    public get firstName(): AbstractControl {
      return this.myAccountForm.controls.firstName;
    }
  
    public get lastName(): AbstractControl {
      return this.myAccountForm.controls.lastName;
    }
  
    public get email(): AbstractControl {
      return this.myAccountForm.controls.email;
    }
  
    public get password(): AbstractControl {
      return this.myAccountForm.controls.password;
    }


  ngOnInit(): void {

    this.username = this.userService.user.username;

    this.myAccountForm = this.formBuilder.group({
      firstName: [
        this.userService.user.firstName,
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

  public becomeAdmin(): void {
    console.log('TODO : You clicked to become an admin')
  }


  public modifyAccount(): void {
    console.log('TODO : You clicked to modify the account')
  }

  public cancelChanges(): void {
    console.log('TODO : You clicked to cancel the modifications')
  }

}
