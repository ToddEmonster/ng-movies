import { Component, OnInit, Output } from '@angular/core';
import { MovieService } from 'src/app/core/services/movie.service';
import { distinctUntilChanged, debounceTime, map } from 'rxjs/operators';
import { Movie } from 'src/app/core/models/movie';
import { EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Output() moviesEvent: EventEmitter<Observable<Movie[]>> = new EventEmitter<Observable<Movie[]>>();

  public searchForm: FormGroup; // Groupement de contrôles de formulaires (= champs)

  constructor(
    private movieService: MovieService,
    private formBuilder: FormBuilder) { }

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
    this.searchTerm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        map(() => {
          console.log('Value of searchTerm : ' + this.searchTerm.value);
          this.searchByTitle();
        })
      ).subscribe();
  }

  public clearSearchTerm() {
    this.searchForm.controls.searchTerm.setValue('');
  }  

  public get searchTerm(): AbstractControl {
    return this.searchForm.controls.searchTerm;
  }

  public reload(): void {
    if (this.searchTerm.value.trim().length == 0) {
      this.moviesEvent.emit(
        this.movieService.all()
      );
    }
  }

  public searchByTitle() {
   
    if (this.searchTerm.value.trim().length > 0) { 
      this.moviesEvent.emit(
        this.movieService.byTitle(this.searchTerm.value.trim())
      );
    }
  }

}
