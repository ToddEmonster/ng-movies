import { Injectable, Optional } from '@angular/core';

import { FullUserInterface } from '../models/full-user-interface'
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { take, map, catchError } from 'rxjs/operators';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CurrentUserInterface } from '../models/current-user-interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // info stockée en local pour voir si quelqu'un est connecté
  private _currentUser: CurrentUserInterface = {idUser: null, username: null, isAuthenticated: false, isAdmin:false, token: null};
  public currentUserSubject$: BehaviorSubject<CurrentUserInterface> = new BehaviorSubject<CurrentUserInterface>(this._currentUser);
  
  public get currentUser(): CurrentUserInterface {
    return this._currentUser;
  }

  constructor(private httpClient: HttpClient) {
    console.log('> UserService has been instanciated.')
    this.checkIfUserIsConnected();
  }
  
  public ngOnInit() {  }
  
  private showUserValue(): void {
    console.log(`The value of userService._currentUser is : ${JSON.stringify(this.currentUser)}`);
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

  public checkIfUserIsConnected(): void {
    console.log('> checkIfUserIsConnected() has been called.');
    const locallyStoredUser: string = localStorage.getItem('user');
    // any = JSON.parse(locallyStoredUser)


    if (locallyStoredUser !== null) {
      console.log('A locally stored token has been found : someone is connected')
      console.log(`the locally stored user is : ${locallyStoredUser}`)

      if (!this._currentUser.isAuthenticated) {
        console.log('YES we entered the updateCurrentUser branch !')
        const objectLocallyStoredUser: any = JSON.parse(locallyStoredUser);
        this._currentUser.isAuthenticated = true;
        this._currentUser.idUser = objectLocallyStoredUser.idUser;
        this._currentUser.username = objectLocallyStoredUser.username;
        this._currentUser.isAdmin = objectLocallyStoredUser.isAdmin;
        this._currentUser.token = objectLocallyStoredUser.token;
        this.currentUserSubject$.next(this._currentUser);
      }
    } else {
      console.log('No token detected in local storage');
      this._currentUser.isAuthenticated = false;
      this._currentUser.idUser = null;
      this._currentUser.username = null;
      this._currentUser.isAdmin = false;
      this._currentUser.token = null;
      this.currentUserSubject$.next(this._currentUser);
    }
    this.showUserValue();
    } 


  public authenticate(user: FullUserInterface): Promise<boolean> {
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
        
        // Store token and username, that will locally persist
        localStorage.setItem(
            'user',
            JSON.stringify({token: response.body.token, 
                            idUser: response.body.idUser,
                            username: response.body.username,
                            isAdmin: response.body.isAdmin})
        ); 
        console.log('Le token et le username sont stockés en local');
        
        // Update the currentUser value
        this._currentUser.isAuthenticated = true;
        this._currentUser.idUser = response.body.idUser;
        this._currentUser.username = response.body.username;
        this._currentUser.isAdmin = response.body.isAdmin;
        this._currentUser.token = response.body.token;

        console.log(`Le user qui vient de se connecter ressemble à ça : ${JSON.stringify(this._currentUser)}`);

        // Propagate the authentication event
        this.currentUserSubject$.next(this._currentUser);
      
        resolve(true); // Take your promise
      }
    }, (error) => {
      console.log('Le Back n\'est pas content de notre requete authenticate')
      this._currentUser.isAuthenticated = false;
      this._currentUser.idUser = null;
      this._currentUser.username = null;
      this._currentUser.isAdmin = false;
      this._currentUser.token = null;

      this.currentUserSubject$.next(this._currentUser);
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
    this._currentUser = {idUser: null, username: null, isAuthenticated: false, isAdmin:false, token: null};;
    this.currentUserSubject$.next(this._currentUser);
  }


  public createNewAccount(newUser: FullUserInterface): Promise<boolean> {
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
        console.log('Congratulations, you registered a new account.')
        resolve(true); // Take your promise
      }
    }, (error) => {
      resolve(false);
     });
    });

  }

}