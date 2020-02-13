import { Component, OnInit, Output } from '@angular/core';
import { MovieService } from 'src/app/core/services/movie.service';

import { take } from 'rxjs/operators';
import { Movie } from 'src/app/core/models/movie';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
 
  public title: string = 'movies'; // marche aussi : " title = 'movies' "
  public defaultCountry: string = 'all';
  public year: number = 0;
  public movies: any[] = []
  public countries: Set<string> = new Set;
  public years: number[] = [];

  public toggleCountry(): void {
    this.defaultCountry =
      (this.defaultCountry == 'us') ? this.defaultCountry = 'it'
                                    : this.defaultCountry = 'us';
      this.movies.forEach((movie:any) => {
        movie.shown = movie.country == this.defaultCountry ? true : false;
      })                     
  }

  constructor(
    private movieService: MovieService
    ) {   }

  ngOnInit(): void {

    const years: Set<number> = new Set<number>();

    this.movieService.all()
      .pipe(
        take(1) // take the only response of the observable
      ) 
      
      // nouveau
      .subscribe((response:Movie[]) => {
        this.movies = response;
        this.movies.map((movie: Movie) => {
          // Add year to set for further filter
          years.add(movie.year);
        });
        this.years = Array.from(years).sort().reverse();
      });     
  }

  public receiveMoviesEvent($event): void {
    this.movies = $event;
    console.log(`Received ${JSON.stringify(this.movies)}`);
  }
}
