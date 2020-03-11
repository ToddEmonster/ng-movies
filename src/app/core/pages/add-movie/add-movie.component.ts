import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.scss']
})
export class AddMovieComponent implements OnInit {

  public addMovieForm: FormGroup;


  constructor(
    private formBuilder: FormBuilder
  ) { }

  public get title(): AbstractControl {
    return this.addMovieForm.controls.title;
  }

  public get year(): AbstractControl {
    return this.addMovieForm.controls.year;
  }

  ngOnInit(): void {

    this.addMovieForm = this.formBuilder.group({
      title: [
        '', 
        Validators.compose(
          [Validators.required, Validators.minLength(2)]
        )
      ],
      year: [
        '',
        Validators.compose([
          Validators.required, 
          Validators.minLength(8)
        ])
      ]
    });
  }

}
