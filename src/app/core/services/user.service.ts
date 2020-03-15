import { Injectable, Optional } from '@angular/core';

import { FullUserInterface } from '../models/full-user-interface'
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { take, map, catchError } from 'rxjs/operators';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NewUserInterface } from '../models/new-user-interface';
import { CurrentUserInterface } from '../models/current-user-interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // info stockée en local pour voir si quelqu'un est connecté
  private _currentUser: CurrentUserInterface = {idUser: null, username: null, isAuthenticated: false, isAdmin:false, token: null};
  public currentUserSubject$: BehaviorSubject<CurrentUserInterface> = new BehaviorSubject<CurrentUserInterface>(this._currentUser);
  
  // modèle pour un nouvel utilisateur lors de sa création
  private _newUser: NewUserInterface = null;
  public newUserSubject$: BehaviorSubject<NewUserInterface> = new BehaviorSubject<NewUserInterface>(this._newUser);

  public get currentUser(): CurrentUserInterface {
    return this._currentUser;
  }

  constructor(private httpClient: HttpClient) {
    console.log('> UserService has been instanciated.')
    this.checkIfUserIsConnected();
  }
  
  public ngOnInit() {  }
  
  private showUserValue(): void {
    console.log(`${JSON.stringify(this.currentUser)}`);
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
    const optToken: string = localStorage.getItem('user');

    if (optToken !== null) {
      console.log('A locally stored token has been found : someone is connected')
      this.updateCurrentUserFromToken(optToken);
    } else {
      console.log('No token detected in local storage');
      this._currentUser.username = null;
      this._currentUser.isAdmin = false;
      this._currentUser.isAuthenticated = false;
      this.currentUserSubject$.next(this._currentUser);
    }
    this.showUserValue();
    } 


  public updateCurrentUserFromToken(token: string): void {
    


    console.log('> updateUserFromToken() has been called.')
    const tokenAsObject: any = JSON.parse(token);
    const uri: string = `${environment.whoIsLogged}`;

    // Envoyer le token au Back
    this.httpClient.put<any>(
      uri,
      { token: tokenAsObject.token },
      { observe: 'response' }
    ).pipe(
      take(1)
    ).subscribe( (response:HttpResponse<any>) => {

      if (response.status === 200) {

        console.log(`We gave the Back the token, its reponse is : ${JSON.stringify(response.body)}`)

        // update the current local user
        this._currentUser.isAuthenticated = true;
        this._currentUser.username = response.body.username;
        this._currentUser.idUser = response.body.idUser;

        console.log('At this point, the userService._user must have taken the Back response values')

        console.log(`User ${JSON.stringify(response.body.idUser)}, ${JSON.stringify(response.body.username)} is logged right now`);
        this.currentUserSubject$.next(this._currentUser);

    } else { 
      console.log('Could not retrieve detected user from token'); // Si le Back me renvoie une erreur
      return null;
    } 
  });
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
                            username: response.body.username})
          ); 
        console.log('Le token et le username sont stockés en local');
        
        // Update the currentUser value
        this._currentUser.token = response.body.token;
        this._currentUser.idUser = response.body.idUser;
        this._currentUser.username = response.body.username;
        this._currentUser.isAuthenticated = true;

        console.log(`Le user qui vient de se connecter ressemble à ça : ${JSON.stringify(this._currentUser)}`);

        // Propagate the authentication event
        this.currentUserSubject$.next(this._currentUser);

      
        resolve(true); // Take your promise
      }
    }, (error) => {
      console.log('Le Back n\'est pas content de notre requete authenticate')
      this._currentUser.token = null;
      this._currentUser.idUser = null;
      this._currentUser.username = null;
      this._currentUser.isAuthenticated = false;

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
    this._currentUser = null;
    this.currentUserSubject$.next(this._currentUser);
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