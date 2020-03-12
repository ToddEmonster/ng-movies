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

  public idUser: number = 999;
  public username: string = "Username à récupérer depuis le Back";
  public isAdmin: boolean;

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

    this.idUser = this.userService.user.idUser;
    this.username = this.userService.user.username;
    this.isAdmin = this.userService.user.isAdmin;

    this.myAccountForm = this.formBuilder.group({
      firstName: [
        this.userService.user.firstName,
        Validators.compose([
          Validators.required,Validators.minLength(2)]
        )
      ],
      lastName: [
        this.userService.user.lastName,
        Validators.compose([
          Validators.required,Validators.minLength(2)]
        )
      ],
      email: [
        this.userService.user.email,
        Validators.compose([
          Validators.required,Validators.minLength(3)]
        )
      ],
      password: [
        this.userService.user.password,
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