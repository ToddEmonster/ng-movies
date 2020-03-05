import { Injectable } from '@angular/core';

import { UserInterface } from './../models/user-interface'
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { take, map } from 'rxjs/operators';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NewUserInterface } from '../models/new-user-interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _registeredUsers: UserInterface[];
  private _user: UserInterface = null;
  public userSubject$: BehaviorSubject<UserInterface> = new BehaviorSubject<UserInterface>(this._user);

  private _newUser: NewUserInterface = null;
  public newUserSubject$: BehaviorSubject<NewUserInterface> = new BehaviorSubject<NewUserInterface>(this._newUser);


  constructor(private httpClient: HttpClient) {
    this._registeredUsers = new Array<any>();
    this._registeredUsers.push(
      {
        login: 'jlaubert',
        password: 'totototo',
        token: '$2y$10$8oiALQuf2s.wOraJSbWm.u5thPNsS4Q2jYjE.ys29aF/ajrXeCXE.',
        isAuthenticated: false
      }
    );
    const userAsString: string = localStorage.getItem('user');
    if (userAsString !== null) {
      const userAsObject: any = JSON.parse(userAsString);
      this._user = this._registeredUsers.find((obj: UserInterface) => obj.token == userAsObject.token);
      if (this._user !== undefined) {
        this._user.isAuthenticated = true;
        console.log('Notify authenticated user');
        this.userSubject$.next(this._user);
      } else {
      console.log('Something went wrong');
      }
    } else {
      console.log('Notify unidentified user');
      this.userSubject$.next(null);
    }
  }

  public get user(): UserInterface {
    return this._user;
  }

  public ngOnInit() { }

  public authenticate(user:UserInterface): Promise<boolean> {
    const uri: string = `${environment.authenticate}`;

    return new Promise<boolean>((resolve) => {
      this.httpClient.post<any>(
        uri, // http://localhost:8080/authenticate
        { 
          username: user.login,
          password: user.password
        },
        {
          observe: 'response'
        }
    ).pipe(
      take(1)
    ).subscribe((response: HttpResponse<any>) => {
      if (response.status === 200) {
        // Store token...
          localStorage.setItem(
            'user',
            JSON.stringify({token: response.body.token})
          ); 
        this._user = user;
        this._user.token = response.body.token;
        this._user.isAuthenticated = true;
        
        this.userSubject$.next(this._user);
      
        resolve(true); // Take your promise
      }
    }, (error) => {
      this._user = null;
      this.userSubject$.next(this._user);

      resolve(false);
     });
    });
  }

  public logout(): void {
    localStorage.removeItem('user');
    this._user = null;
    this.userSubject$.next(this._user);
  }


  public createNewAccount(newUser: NewUserInterface): Promise<boolean> {
    const uri: string = `${environment.register}`;

    return new Promise<boolean>((resolve) => {
      this.httpClient.post<any>(
        uri, // http://localhost:8080/register
        { 
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          username: newUser.username,
          password: newUser.password
        },
        {
          observe: 'response'
        }
    ).pipe(
      take(1)
    ).subscribe((response: HttpResponse<any>) => {
      if (response.status === 200) {
        // Store token...
          localStorage.setItem(
            'user',
            JSON.stringify({token: response.body.token})
          ); 
        this._newUser = newUser;
        
        this.newUserSubject$.next(this._newUser);
      
        resolve(true); // Take your promise
      }
    }, (error) => {
      this._newUser = null;
      this.newUserSubject$.next(this._newUser);

      resolve(false);
     });
    });

  }



}