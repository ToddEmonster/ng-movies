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

  public get originalTitle(): AbstractControl {
    return this.addMovieForm.controls.originalTitle;
  }

  public get director(): AbstractControl {
    return this.addMovieForm.controls.director;
  }
  public get synopsis(): AbstractControl {
    return this.addMovieForm.controls.synopsis;
  }

  public get classification(): AbstractControl {
    return this.addMovieForm.controls.classification;
  }

  public get rating(): AbstractControl {
    return this.addMovieForm.controls.classification;
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
          Validators.minLength(4)
        ])
      ],
      originalTitle: [
        '',
        Validators.compose([
          // Validators.required, 
          Validators.minLength(2)
        ])
      ],
      duration: [
        '',
        Validators.compose([
          // Validators.required, 
          // Validators.minLength(2)
        ])
      ],
      director: [
        '',
        Validators.compose([
          // Validators.required, 
          Validators.minLength(2)
        ])
      ],
      synopsis: [
        '',
        Validators.compose([
          // Validators.required, 
          Validators.minLength(10)
        ])
      ],
      classification: [
        '',
        Validators.compose([
          // Validators.required, 
          // Validators.minLength(0)
        ])
      ],
      rating: [
        '',
        Validators.compose([
          // Validators.required, 
          // Validators.minLength(0)
        ])
      ],
    });
  }

  addMovie(): void{
    alert("movied added")
  }
}
