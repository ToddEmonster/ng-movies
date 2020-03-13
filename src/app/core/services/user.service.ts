import { Injectable, Optional } from '@angular/core';

import { UserInterface } from './../models/user-interface'
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { take, map, catchError } from 'rxjs/operators';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NewUserInterface } from '../models/new-user-interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // l'utilisateur connecté s'il existe
  private _user: UserInterface = 
  { idUser: null, username: null, password: null, isAuthenticated: false,
    firstName: null, lastName: null, email: null, isAdmin: null }; 
  public userSubject$: BehaviorSubject<UserInterface> = new BehaviorSubject<UserInterface>(this._user);
  
  // modèle pour un nouvel utilisateur lors de sa création
  private _newUser: NewUserInterface = null;
  public newUserSubject$: BehaviorSubject<NewUserInterface> = new BehaviorSubject<NewUserInterface>(this._newUser);

  public get user(): UserInterface {
    return this._user;
  }

  constructor(private httpClient: HttpClient) {
    console.log('> UserService has been instanciated.')
    this.checkIfUserIsConnected();
  }
  
  public ngOnInit() {  }
  
  public showUserValue(): void {
    console.log(`Le user de userService est : ${JSON.stringify(this._user)}`)
  }

  public byId(idUser: number): Observable<any> {
    const apiRoot: string = `${environment.apiRoot}account/${idUser}`;
    return this.httpClient.get<any>(
      apiRoot,
      { observe: 'response' }
    ).pipe(
      take(1),
      map((response)=> {
        return response.body;
      }),
      catchError((error: any) => {
        console.log(`Could not retrieve user from idUser: ${JSON.stringify(error)}`);
        return throwError(error.status)
      })
    );
  }

  public checkIfTokenIsPresent(): boolean {
    console.log('> checkIfTokenIsPresent() has been called.')

    const optToken: string = localStorage.getItem('user');
    if (optToken !== null) {
      console.log('A locally stored token has been found')
      return true;
    } else {
      console.log('No token detected in local storage');
      this.userSubject$.next(null);
      this.showUserValue();
      return false;
    }
  }


  public checkIfUserIsConnected(): void {
    console.log('> checkIfUserIsConnected() has been called.');

    if (this.checkIfTokenIsPresent()) {
      const storedToken: string = localStorage.getItem('user');
      this.showUserValue();
      // Here, it should be called at each instanciation of UserService
      // But the Back is not happy.
      if (!this._user.isAuthenticated) {
        console.log('The user is empty : not normal.')
        this.updateUserFromToken(storedToken);
    } else {
      this.showUserValue();
      }
    } 
  }


  public updateUserFromToken(token: string): void {
    console.log('> updateUserFromToken() has been called.')
    const uri: string = `${environment.isLogged}`;

    // Envoyer le token au Back
    this.httpClient.post<any>(
      uri,
      { token: JSON.parse(token) },
      { observe: 'response' }
    ).pipe(
      take(1)
    ).subscribe( (response:HttpResponse<any>) => {
      // Récupérer
      if (response.status === 200) {

        console.log(`We gave the Back the token, its reponse is : ${JSON.stringify(response.body)}`)

        // update the current local user
        this._user.isAuthenticated = true;
        this._user.idUser = response.body.idUser;
        this._user.username = response.body.username;
        this._user.password = response.body.password;
        this._user.firstName = response.body.firstName;
        this._user.lastName = response.body.lastName;
        this._user.email = response.body.email;
        this._user.isAdmin = response.body.isAdmin;

        console.log('At this point, the userService._user must have taken the Back response values')


        console.log(`User ${JSON.stringify(response.body.idUser)}, ${JSON.stringify(response.body.username)} is logged right now`);
        this.userSubject$.next(this._user);

    } else { 
      console.log('Could not retrieve detected user from token'); // Si le Back me renvoie une erreur
      return null;
    } 
  });
}
  


  public authenticate(user: UserInterface): Promise<boolean> {
    console.log('> authenticate() has been called.')
    const uri: string = `${environment.authenticate}`;

    return new Promise<boolean>((resolve) => {
      this.httpClient.post<any>(
        uri, // http://localhost:8080/authenticate
        { username: user.username, 
          password: user.password
        },
        { observe: 'response' }
    ).pipe(
      take(1)
    ).subscribe((response: HttpResponse<any>) => {
      if (response.status === 200) {
        console.log('Le Back nous a répondu 200:OK pour authenticate')
        
        // Store token...
          localStorage.setItem(
            'user',
            JSON.stringify({token: response.body.token})
          ); 
        console.log('Le token est stocké en local');
        
        // We map the token response in order to send it back to the Back
        const tokenToSend: string = JSON.stringify(response.body.token);

        // retrieve the rest of the information from the Back
        this.updateUserFromToken(tokenToSend);
        console.log(`Le user qui vient de se connecter ressemble à ça : ${JSON.stringify(this._user)}`);
        
        // set the currently connected user token as the token we got
        this._user.token = response.body.token;

        // Propagate the authentication event
        this.userSubject$.next(this._user);
      
        resolve(true); // Take your promise
      }
    }, (error) => {
      console.log('Le Back n\'est pas content de notre requete authenticate')
      this._user = null;
      this.userSubject$.next(this._user);
      resolve(false);
     });
    });
  }

  // TODO if it's ok
  // public getUserInformation(optToken: string, uri: string): Promise<UserInterface> {
  //     // Objet JSON du token stocké en local
  //     const tokenAsObject: any = JSON.parse(optToken);

  //     // J'envoie le token vers le Back, j'attends de lui qu'il me renvoie le user associé via JwtTokenUtil
  //     this.httpClient.post<any>(
  //       uri,
  //       { token: tokenAsObject.token },
  //       { observe: 'response' }
  //     ).pipe(
  //       take(1)
  //     ).subscribe( (response:HttpResponse<any>) => {
  //       // Si le Back me renvoie bien un User
  //       if (response.status === 200) {
          
  //         // update the current local user
  //         this._user.isAuthenticated = true;
  //         this._user.idUser = response.body.idUser;
  //         this._user.username = response.body.username;
  //         this._user.password = response.body.password;
  //         this._user.firstName = response.body.firstName;
  //         this._user.lastName = response.body.lastName;
  //         this._user.email = response.body.email;
  //         this._user.isAdmin = response.body.isAdmin;

  //         console.log(`There\'s a user logged right now : ${JSON.stringify(response.body.idUser, response.body.username)}`);
  //         this.userSubject$.next(this._user);

  //         return this._user;

  //       } else { 
  //         console.log('Something went wrong'); // Si le Back me renvoie une erreur
  //         return null;
  //       } 
  //     });
  // }

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
          password: newUser.password,
          logged: false,
          isAdmin: false
        },
        {
          observe: 'response'
        }
    ).pipe(
      take(1)
    ).subscribe((response: HttpResponse<any>) => {
      if (response.status === 200) {
        
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