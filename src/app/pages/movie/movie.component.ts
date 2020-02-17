import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from 'src/app/core/services/movie.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

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
    private movieService: MovieService,
    private formBuilder: FormBuilder) { }

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

  public modifySynopsis(): void {
    console.log(`Congrats, you changed the synopsis :) it reads like this: ${this.synopsis.value}`);
  }

}
