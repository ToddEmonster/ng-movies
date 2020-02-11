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
      shown: true,
      imgSrc: 'https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SY1000_CR0,0,674,1000_AL_.jpg',
      imgAlt: 'Photo of the movie Joker',
      synopsis: 'This movie is supposed to be an event.'
    },
    {
      title: 'Avengers',
      year: 2015,
      country: 'us',
      shown: true,
      imgSrc: 'https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SY1000_CR0,0,675,1000_AL_.jpg',
      imgAlt: 'Photo of the movie Avengers',
      synopsis: 'This movie is kinda old now ! Who would have thought ?'
    },
    {
      title: 'Il était une fois dans l\'ouest',
      year: 1975,
      country: 'it',
      shown: true,
      imgSrc: 'https://m.media-amazon.com/images/M/MV5BZGI5MjBmYzYtMzJhZi00NGI1LTk3MzItYjBjMzcxM2U3MDdiXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_CR0,0,658,1000_AL_.jpg',
      imgAlt:'Photo of the movie Il était une fois dans l\'ouest',
      synopsis: 'This movie is _really_ old'
    },
    {
      title: 'La belle verte',
      year: 1996,
      country: 'fr',
      shown: true,
      imgSrc: 'https://m.media-amazon.com/images/M/MV5BYWRkMDRhODQtYjE1YS00ZGQ2LTk4OGQtNmEwMTBjOGYxYjZkXkEyXkFqcGdeQXVyMTY0MTAxMjY@._V1_.jpg',
      imgAlt:'Photo of the movie La belle verte',
      synopsis: 'A cute French alternative movie.'
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
