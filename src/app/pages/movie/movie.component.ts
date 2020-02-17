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
  public synopsisForm: FormGroup;


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
      })
    });

    this.synopsisForm = this.formBuilder.group({
      synopsisTerm: [
        '', // Default value for the control
        Validators.compose([
          Validators.required,
          Validators.minLength(2)
        ])
      ]
    });
  }

  public clearSynopsisTerm() {
    this.synopsisForm.controls.synopsisTerm.setValue('');
  }  

  public get synopsisTerm(): AbstractControl {
    return this.synopsisForm.controls.synopsisTerm;
  }

  public modifySynopsis(): void {
    console.log('Congrats, you changed the synopsis :)');
  }

}
