import { Component, OnInit, Output } from '@angular/core';
import { MovieService } from 'src/app/core/services/movie.service';

import { take, map } from 'rxjs/operators';
import { Movie } from 'src/app/core/models/movie';
import { Observable, Subscription } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';
import { MovieComponent } from '../movie/movie.component';
import { UserService } from 'src/app/core/services/user.service';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { WebSocketSubject } from 'rxjs/webSocket'
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
 
  public title: string = 'movies'; // marche aussi : " title = 'movies' "
  public defaultCountry: string = 'all';
  //public countries: Set<string> = new Set;

  public year: number = 0;
  public years: number[] = [];
  public yearSubscription: Subscription;
  
  public movies: Observable<Movie[]>;

  private socket$: WebSocketSubject<any>;

  // Deprecated button method... FOR NOW
  public toggleCountry(): void {
    this.defaultCountry =
      (this.defaultCountry == 'us') ? this.defaultCountry = 'it'
                                    : this.defaultCountry = 'us';
      this.movies.forEach((movie:any) => {
        movie.shown = movie.country == this.defaultCountry ? true : false;
      })                     
  }

  constructor(
    private movieService: MovieService,
    private userService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private snackBar: MatSnackBar
    ) {   }

  ngOnInit(): void {
    this.socket$ = new WebSocketSubject<any>(environment.wssAddress);
    this.socket$.subscribe((socketMessage: any) => {
      console.log(`Something came from wsServer : ${JSON.stringify(socketMessage)}`)
    }),
    this.socket$.next('Ping(u)');

    this.movies = this.movieService.all();                 


    this.yearSubscription = this.movieService.years$
      .subscribe((_years) => {
        console.log('Years was updated : ' + JSON.stringify(_years));
        this.years = _years;
    });


  }

  ngOnDestroy(): void {
    this.yearSubscription.unsubscribe();
  }

  public receiveMoviesEvent($event): void {
    this.movies = $event;
    console.log(`Received ${JSON.stringify(this.movies)}`);
  }

  public doDetails(idMovie: number): void {
    console.log('You clicked on Details, the id of the movie is: ' + idMovie);
    if (this.userService.user && this.userService.user !== null) {
      this.router.navigate(['../','movie', idMovie ]);
    } else {
      this.router.navigate(['../','login']);
      this._snackBar.open('Log in to see the movie details !', '', {duration: 5000});
    }
   
  }

  // TODO, right now
  public likeIt(movie: Movie): void {
    console.log(`You clicked on "Fav it" : `);
    movie.likes+= 1;

    // Emit a new update to ws...
    


  }

  // Simon version
  public toastLoginMust(idMovie: number): void {
    if(!this.userService.user) {
      this.snackBar.open(
        'You have to login in order to see the details !',
        '',
        {
          duration: 2500,
          verticalPosition: 'top'
        })
        setTimeout(() => {
          this.router.navigate(['login']); }
          , 2600)
        } else {
          this.router.navigate(['movie',idMovie]);
        }
  
  }

  // Renaud version
  public detailFilm(idMovie: number): void {
    if (this.userService.user) {
      this.router.navigate(['../', 'movie', idMovie])
    } else {
      const snack: MatSnackBarRef<SimpleSnackBar> = this.snackBar.open(
        'Sorry, need to be login',
        null,
        {
          duration: 2000,
        }
      );
      snack.afterDismissed().subscribe((status: any) => {
        const navigationExtras: NavigationExtras = { state: { movie: idMovie } };
        this.router.navigate(['login'], navigationExtras);
      });
    }
  }

    // Unfinished Jean-luc version
  // public moveTo(): void {
  //   if (this.userService) {
  //     // A COMPLETER
  //   } else {
  //     // Load a toast route to login
  //     const snack: MatSnackBarRef<SimpleSnackBar> = this.snackBar.open(
  //       'You have to login or create an account before',
  //       null,
  //       {
  //         duration: 2500
  //       }
  //     );
  //       snack.afterDismissed().subscribe((status: any) => {
  //         const navigationExtras: NavigationExtras = {state: {movie: idMovie}};
  //         this.router.navigate(['../', 'login'], navigationExtras):
  //       })
  
  
  //   }
  // }

}


