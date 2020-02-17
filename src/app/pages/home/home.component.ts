import { Component, OnInit, Output } from '@angular/core';
import { MovieService } from 'src/app/core/services/movie.service';

import { take, map } from 'rxjs/operators';
import { Movie } from 'src/app/core/models/movie';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MovieComponent } from '../movie/movie.component';
import { UserService } from 'src/app/core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private _snackBar: MatSnackBar
    ) {   }

  ngOnInit(): void {
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

  // TODO, but not now
  public doFavorite(): void {
    console.log('You clicked on "Fav it"');
  }
}
