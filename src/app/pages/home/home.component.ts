import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public title: string = 'movies'; // marche aussi : " title = 'movies' "

  public defaultCountry: string = 'all';

  public movies: any[] = [
    {
      title: 'Joker',
      year: 2019,
      country: 'us',
      shown: true
    },
    {
      title: 'Avengers',
      year: 2015,
      country: 'us',
      shown: true
    },
    {
      title: 'Il était une fois dans l\'ouest',
      year: 1975,
      country: 'it',
      shown: true
    },
    {
      title: 'La belle verte',
      year: 1996,
      country: 'fr',
      shown: true
    }            
  ]

  public toggleCountry(): void {
    this.defaultCountry =
      (this.defaultCountry == 'us') ? this.defaultCountry = 'it'
                                    : this.defaultCountry = 'us';
      this.movies.forEach((movie:any) => {
        movie.shown = movie.country == this.defaultCountry ? true : false;
      })                     
  }

  public countries: Set<string> = new Set;

  public constructor() {}

  ngOnInit(): void {
    this.movies.forEach(movie=> {
      this.countries.add(movie.country)
      });
  }

}
