import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/core/services/movie.service';
import { take } from 'rxjs/operators';
import { Movie } from 'src/app/core/models/movie';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  public value: string = '';
  public movies: any[] = []

  constructor(
    private movieService: MovieService
  ) { }

  ngOnInit(): void {
  }

  public validateSearch() {
    const movies: Set<Movie> = new Set<Movie>();

    if (this.value.length > 0) {
      console.log("You typed something ! Congrats :p")
      this.movieService.byTitle(this.value)
      .pipe(take(1)) // take the only response of the observable
      .subscribe((response:any[]) => {
        this.movies = response.map((movie: Movie) => {
          movies.add(movie);
        });
      });
      console.log(`Movies : ${JSON.stringify(movies)}`);
    } else {
      console.log("You know, you should type something if you want the search to work :3")
    }
  }
}
