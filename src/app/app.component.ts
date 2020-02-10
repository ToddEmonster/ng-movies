import { Component } from '@angular/core';

// DECORATEUR COMME DANS PYTHON PARCE QUE LA CLASSE EST EN-DESSOUS
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
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

  public constructor() {
    this.movies.forEach(movie=> {
        this.countries.add(movie.country)
    });
  }

}

