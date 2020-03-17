import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from 'src/app/core/services/movie.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DeleteComponent } from './delete/delete.component';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnInit {
  public movie: any; // créer un model FullMovie, c'est pas propre un any
  public updateMode: boolean = false;
  public movieForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _bottomSheet: MatBottomSheet
    ) { }

  ngOnInit(): void {

    this.movieForm = this.formBuilder.group({
      title: [
        '', // Default value for the control
        Validators.required
      ],
      originalTitle: [''],
      director: [''],
      year: ['', Validators.required],
      duration: [''],
      genre: [''],
      synopsis: ['', Validators.required]
    });

    this.route.data.subscribe((data: {movie: any}) => {
      this.movie = data.movie;

      this.title.setValue(this.movie.title);
      this.originalTitle.setValue(this.movie.originalTitle);
      this.director.setValue(this.movie.director.name);
      this.year.setValue(this.movie.year);
      this.duration.setValue(this.movie.duration);
      this.genre.setValue(this.movie.genre);
      this.synopsis.setValue(this.movie.synopsis);
    })
  }
  public get title(): AbstractControl {
    return this.movieForm.controls.title;
  }

  public get originalTitle(): AbstractControl {
    return this.movieForm.controls.originalTitle;
  }

  public get director(): AbstractControl {
    return this.movieForm.controls.director;
  }
  
  public get year(): AbstractControl {
    return this.movieForm.controls.year;
  }
  
  public get duration(): AbstractControl {
    return this.movieForm.controls.duration;
  }
  
  public get genre(): AbstractControl {
    return this.movieForm.controls.genre;
  }
  
  public get synopsis(): AbstractControl {
    return this.movieForm.controls.synopsis;
  }


  public showMovie(): void {
    console.log(`${JSON.stringify(this.movie)}`);
    console.log(`Title : ${JSON.stringify(this.movie.title)}`);
    console.log(`Original Title : ${JSON.stringify(this.movie.originalTitle)}`);
  }
  
  public switchToUpdateMode(): void {
    if (!this.updateMode) {
      this.updateMode = true;
    } else {
      this.updateMode = false;
    }
    console.log(`updateMode is now : ${this.updateMode}`);
  }

  public clearSynopsis(): void {
    this.movieForm.controls.synopsis.setValue('');
  }  

  
  // TODO : persister l'update vers le Back
  public updateMovie(): void {
    this.movie.title = this.title;
    this.movie.originalTitle = this.originalTitle;
    this.movie.director = this.director;
    this.movie.year = this.year;
    this.movie.duration = this.duration;
    this.movie.genre = this.genre;
    this.movie.synopsis = this.synopsis.value;

    this.movieService.update(this.movie); // Call the service to update
    location.reload(); // Refresh the page
    this._snackBar.open('Congrats, you updated this Movie ! :)', '', {duration: 5000});
  }

  public validateDelete(): void {
    this._bottomSheet.open(DeleteComponent, {
      data: {movie: this.movie}
    });
  }





}
