import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from 'src/app/core/services/movie.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe((paramMap: any) => {
      console.log(`params: ${paramMap.params.id}`);
      this.movieService.byId(paramMap.params.id).subscribe((movie: any) => {
        console.log(`And the winner is : ${JSON.stringify(movie)}`)
        this.movie = movie;
        this.synopsis.setValue(movie.synopsis);
      })
    });

    this.movieForm = this.formBuilder.group({
      synopsis: [
        '', // Default value for the control
        Validators.required
      ]
    });
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

}
