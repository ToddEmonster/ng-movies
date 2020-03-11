import { Injectable, Optional } from '@angular/core';

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
    const optToken: string = localStorage.getItem('user');
    const uri: string = `${environment.isLogged}`;

    // Si on trouve un token, ça veut dire que quelqu'un est connecté
    if (optToken !== null) {
      // ça c'est l'objet JSON qui est le token stocké en local
      const tokenAsObject: any = JSON.parse(optToken);

      // J'envoie le token vers le Back, j'attends de lui qu'il me renvoie le user associé via JwtTokenUtil
      this.httpClient.post<any>(
        uri,
        { token: tokenAsObject.token },
        { observe: 'response' }
      ).pipe(
        take(1)
      ).subscribe( (response:HttpResponse<any>) => {
        // Si le Back me renvoie bien un User
        if (response.status === 200) {
          
          // initialize the user interface
          this._user = {
            username: null,
            password: null,
            isAuthenticated: false
          };
          
          // update the current local user
          this._user.isAuthenticated = true;
          this._user.username = response.body.username;
          this._user.password = response.body.password;

          console.log('There\'s a user who is logged right now');

          this.userSubject$.next(this._user);
        } else { 
          console.log('Something went wrong'); // Si le Back me renvoie une erreur
        } 
      });
      // Si le Token est nul ( = pas de user connecté)
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
          username: user.username,
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