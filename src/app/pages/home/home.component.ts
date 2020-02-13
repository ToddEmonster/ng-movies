import { Component, OnInit, Output } from '@angular/core';
import { MovieService } from 'src/app/core/services/movie.service';

import { take, map } from 'rxjs/operators';
import { Movie } from 'src/app/core/models/movie';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
 
  public title: string = 'movies'; // marche aussi : " title = 'movies' "
  public defaultCountry: string = 'all';
  public countries: Set<string> = new Set;

  public year: number = 0;
  public years: number[] = [];

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
    private movieService: MovieService
    ) {   }

  ngOnInit(): void {
    this.movies = this.movieService.all()

  }

  public receiveMoviesEvent($event): void {
    this.movies = $event;
    console.log(`Received ${JSON.stringify(this.movies)}`);
  }
}
