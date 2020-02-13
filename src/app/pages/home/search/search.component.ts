import { Component, OnInit, Output } from '@angular/core';
import { MovieService } from 'src/app/core/services/movie.service';
import { take } from 'rxjs/operators';
import { Movie } from 'src/app/core/models/movie';
import { EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Output() moviesEvent: EventEmitter<Movie[]> = new EventEmitter<Movie[]>();

  public searchForm: FormGroup; // Groupement de contrôles de formulaires (= champs)

  constructor(
    private movieService: MovieService,
    private formBuilder: FormBuilder) { }

  public clearSearchTerm() {
    this.searchForm.controls.searchTerm.setValue('');
  }  

  public get searchTerm(): AbstractControl {
    return this.searchForm.controls.searchTerm;
  }

  public reload(): void {
    if (this.searchTerm.value.trim().length == 0) {
      let allMovies: Movie[] = [];
      this.movieService.all()
        .pipe(take(1))
        .subscribe((response:Movie[]) => {
            allMovies = response.map((movie: Movie) => {
            return new Movie().deserialize(movie);
          });
        this.moviesEvent.emit(allMovies);
      });
    }
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      searchTerm: [
        '', // Default value for the control
        Validators.compose([
          Validators.required,
          Validators.minLength(2)
        ])
      ]
    });
  }

  public searchByTitle() {
   
    if (this.searchTerm.value.trim().length > 0) { 

      let moviesbyTitle: Movie[] = [];
      this.movieService.byTitle(this.searchTerm.value.trim())
        .pipe(
          take(1) // take the only response of the observable
        ) 
        .subscribe((response:Movie[]) => {
          console.log(`Emit : ${JSON.stringify(response)}`);
          this.moviesEvent.emit(response);
      });
    }
  }

}
