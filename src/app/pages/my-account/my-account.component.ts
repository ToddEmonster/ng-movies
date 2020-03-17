import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {
  public user: any;
  public myAccountForm: FormGroup;

  // private _navigation: Navigation;
  private translationChange$: any;

  public idUser: number;
  public username: string;
  public isAdmin: boolean;


  // Constructor and OnInit stuff
  constructor(
    private route: ActivatedRoute,
    private router: Router,

    private userService: UserService, 
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    ) {
      // this._navigation = this.router.getCurrentNavigation();
    }

  ngOnInit(): void {

    this.myAccountForm = this.formBuilder.group({
      firstName: [
        '',
        Validators.compose([
          Validators.required,Validators.minLength(2)])
      ],
      lastName: [
        '',
        Validators.compose([
          Validators.required,Validators.minLength(2)])
      ],
      email: [
        '',
        Validators.compose([
          Validators.required,Validators.minLength(3)])
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,Validators.minLength(8)])
      ]
    });

    this.route.data.subscribe((data: {user: any}) => {
      this.user = data.user;
      this.firstName.setValue(this.user.firstName);
      this.lastName.setValue(this.user.lastName);
      this.email.setValue(this.user.email);
      this.password.setValue(this.user.password);
      this.username = this.user.username;
      this.idUser = this.user.idUser;
      this.isAdmin = this.user.isAdmin;
    })
    

    this.translationChange$ = this.translateService.onTranslationChange;
    this.translationChange$.subscribe();
  }

  // Attributes getters
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


  // TODO : Button methods 

  public becomeAdmin(): void {
    this.userService.setAsAdmin();
  }

  public modifyAccount(): void {
    this.userService.modifyUserInfo();
  }

  public cancelChanges(): void {
    this.firstName.setValue(this.user.firstName);
    this.lastName.setValue(this.user.lastName);
    this.email.setValue(this.user.email);
    this.password.setValue(this.user.password);
    this.username = this.user.username;
    this.idUser = this.user.idUser;
    this.isAdmin = this.user.isAdmin;
  }

}
