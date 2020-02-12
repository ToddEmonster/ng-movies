import { Component, OnInit, Output } from '@angular/core';
import { MovieService } from 'src/app/core/services/movie.service';
import { take } from 'rxjs/operators';
import { Movie } from 'src/app/core/models/movie';
import { EventEmitter} from '@angular/core';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  public value: string = '';
  @Output() moviesEvent: EventEmitter<Movie[]> = new EventEmitter<Movie[]>();

  constructor(
    private movieService: MovieService
  ) { }

  ngOnInit(): void {
  }

  public validateSearch() {
    let moviesbyTitle: Movie[] = [];

    if (this.value.length > 0) {
      console.log("You typed something ! Congrats :p")

      this.movieService.byTitle(this.value)
        .pipe(take(1)) // take the only response of the observable
        .subscribe((response:Movie[]) => {

            moviesbyTitle = response.map((movie: Movie) => {
              return new Movie().deserialize(movie);
          });
          console.log(`Emit : ${JSON.stringify(moviesbyTitle)}`);
          this.moviesEvent.emit(moviesbyTitle);
        });
    } else {
      console.log("You know, you should type something if you want the search to work :3")
    }
  }
}
