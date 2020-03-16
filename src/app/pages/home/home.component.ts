import { Component, OnInit, Output } from '@angular/core';
import { MovieService } from 'src/app/core/services/movie.service';

import { take, map, delay } from 'rxjs/operators';
import { Movie } from 'src/app/core/models/movie';
import { Observable, Subscription } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';
import { MovieComponent } from '../movie/movie.component';
import { UserService } from 'src/app/core/services/user.service';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { WebSocketSubject } from 'rxjs/webSocket'
import { environment } from './../../../environments/environment';
import { transition, trigger, state, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('heartGrowing', [
      state('initial', style({
        transform: 'scale(1)',
        color: 'black'
      })),
      state('final', style({
        transform: 'scale(2.0)',
        color: 'pink'
      })),
      transition('initial=>final', animate('900ms')),
      transition('final=>initial', animate('900ms'))
    ]),
    trigger('heartSmalling', [
      state('initial', style({
        transform: 'scale(2.0)',
        color: 'pink'
      })),
      state('final', style({
        transform: 'scale(1)',
        color: 'black'
      })),
      transition('initial=>final', animate('900ms')),
      transition('final=>initial', animate('900ms'))
    ])
  ]
})
export class HomeComponent implements OnInit {

  public title: string = 'movies'; // marche aussi : " title = 'movies' "
  public defaultCountry: string = 'all';
  //public countries: Set<string> = new Set;


  public year: number = 0;
  public years: number[] = [];
  public yearSubscription: Subscription;

  public moviesOb: Observable<Movie[]>;

  private socket$: WebSocketSubject<any>;
  private langChanges$: any;

  // Deprecated button method... FOR NOW
  public toggleCountry(): void {
    this.defaultCountry =
      (this.defaultCountry == 'us') ? this.defaultCountry = 'it'
        : this.defaultCountry = 'us';
    this.moviesOb.forEach((movie: any) => {
      movie.shown = movie.country == this.defaultCountry ? true : false;
    })
  }

  constructor(
    public movieService: MovieService,
    private userService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private snackBar: MatSnackBar,
    private httpClient: HttpClient,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.socket$ = new WebSocketSubject<any>(environment.wssAddress);
    this.socket$.subscribe((socketMessage: any) => {

      if (socketMessage._message === 'like') {
        // Update interface for this movie
        let movie: Movie = new Movie(this.httpClient).deserialize(socketMessage._data);
        console.log(`Update comes from wsServer : ${JSON.stringify(movie)}`);

        // Update movies from observable
        this.moviesOb = this.moviesOb.pipe(
          map((movies: Movie[]): Movie[] => {
            let movieIndex: number = movies.findIndex(
              (obj: Movie, index: number) => obj.idMovie === movie.idMovie
            );
            console.log(`Replace movie at row ${movieIndex}`);
            movies[movieIndex] = movie;
            return movies;
          })
        );
      }
    },
      (err) => console.error('Exception raised : ' + JSON.stringify(err)),
      () => console.warn('Completed!')
    );

    this.langChanges$ = this.translateService.onLangChange;
    this.langChanges$.subscribe((event: any) =>{
    
      this.moviesOb = this.moviesOb.pipe(
        map((movies: Movie[]): Movie[] => {
          return movies;
        })
      )
    });

    this.moviesOb = this.movieService.all();

    this.yearSubscription = this.movieService.years$
      .subscribe((_years) => {
        // console.log('Years was updated : ' + JSON.stringify(_years));
        this.years = _years;
      });


  }

  ngOnDestroy(): void {
    this.yearSubscription.unsubscribe();
    this.langChanges$.unsubscribe;
  }

  public receiveMoviesEvent($event): void {
    this.moviesOb = $event;
    console.log(`Received ${JSON.stringify(this.moviesOb)}`);
  }


  public doDetails(idMovie: number): void {
    console.log('You clicked on Details, the id of the movie is: ' + idMovie);
    if (this.userService.currentUser.isAuthenticated) {
      this.router.navigate(['../', 'movie', idMovie]);
    } else {
      this.router.navigate(['../', 'login']);
      this._snackBar.open('Log in to see the movie details !', '', { duration: 5000 });
    }

  }

  public likeIt(movie: Movie): void {
    if (this.userService.currentUser.isAuthenticated) {
      movie.animationState = 'final';
      setTimeout(() => {

        movie.likes += 1;
        // console.log(`You liked the movie: ${JSON.stringify(movie)}`);
        // Emit a new update to ws...
        const message: any = {
          message: 'like',
          data: movie
        };
        this.socket$.next(message);

        // Update the observable (retains values)
        this.moviesOb = this.moviesOb.pipe(
          map((movies: Movie[]): Movie[] => {
            let movieIndex: number = movies.findIndex(
              (obj: Movie, index: number) => obj.idMovie == movie.idMovie
            );
            movies[movieIndex] = movie;
            return movies;
          })
        );
        // Fictional TODO : appeler une méthode movieService.updateLikes() 


        movie.animationState = 'initial';

        // Then, to the final after 900ms
        setTimeout(() => movie.animationState = 'final', 900);
      }, 1000)
    } else {
      const snack: MatSnackBarRef<SimpleSnackBar> = this.snackBar.open(
        'You have to login to add a movie to your favorites',
        null,
        {
          duration: 2500
        }
      );
      snack.afterDismissed().subscribe((status: any) => {
        this.router.navigate(['../', 'login']);
      });

    }
  }

  public unLikeIt(movie: Movie): void {
    movie.animationState = 'initial';

    setTimeout(() => {

      movie.likes -= 1;
      // console.log(`You liked the movie: ${JSON.stringify(movie)}`);
      // Emit a new update to ws...
      const message: any = {
        message: 'like',
        data: movie
      };
      this.socket$.next(message);

      // Update the observable (retains values)
      this.moviesOb = this.moviesOb.pipe(
        map((movies: Movie[]): Movie[] => {
          let movieIndex: number = movies.findIndex(
            (obj: Movie, index: number) => obj.idMovie == movie.idMovie
          );
          movies[movieIndex] = movie;
          return movies;
        })
      );
      // Fictional TODO : appeler une méthode movieService.updateLikes() qui

      movie.animationState = 'final';

      // Then, to the final after 900ms
      setTimeout(() => movie.animationState = 'initial', 900);
    }, 1000)
  }


  // Jean-luc version
  public moveTo(idMovie: number): void {
    if (this.userService.currentUser.isAuthenticated && this.userService.currentUser.isAuthenticated !== null) {
      this.router.navigate(['../', 'movie', idMovie]);
    } else {
      // Load a toast and route to login
      const snack: MatSnackBarRef<SimpleSnackBar> = this.snackBar.open(
        'You have to login or create an account before',
        null,
        {
          duration: 2500
        }
      );
      snack.afterDismissed().subscribe((status: any) => {
        const navigationExtras: NavigationExtras = { state: { movie: idMovie } };
        this.router.navigate(['../', 'login'], navigationExtras);
      });

    }
  }


}


