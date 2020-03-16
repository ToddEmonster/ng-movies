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
  public movie: any;
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
      synopsis: [
        '', // Default value for the control
        Validators.required
      ]
    });


     this.route.data.subscribe((data: {movie: any}) => {
      this.movie = data.movie;
      this.synopsis.setValue(this.movie.synopsis)
    })
  }

  public clearSynopsis() {
    this.movieForm.controls.synopsis.setValue('');
  }  

  public get synopsis(): AbstractControl {
    return this.movieForm.controls.synopsis;
  }

  public updateSynopsis(): void {
    this.movie.synopsis = this.synopsis.value;

    // Then call the service to update
    this.movieService.update(this.movie)
    .pipe(take(1))
    .subscribe((response: HttpResponse<any>)=> {
        return response;
      });

    this.router.navigate(['../','movie', this.movie.idMovie]);
    this._snackBar.open('Congrats, you changed the synopsis :)', '', {duration: 5000});
  }

  public validateDelete(): void {
    this._bottomSheet.open(DeleteComponent, {
      data: {movie: this.movie}
    });
  }





}
