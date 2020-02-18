import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MatBottomSheet, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MovieService } from 'src/app/core/services/movie.service';
import { MovieComponent } from '../movie.component';
import { take } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Movie } from 'src/app/core/models/movie';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {
  
  private movie: Movie;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<DeleteComponent>,
    private movieService: MovieService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_BOTTOM_SHEET_DATA) private data: any
  ) { 
    this.movie = data.movie;
    
  }

  ngOnInit(): void {
  }

  public deleteMovie(): void {
    console.log(`Delete movie with id ${this.movie.idMovie}`);

    // Then call the service to update
    this.movieService.delete(this.movie.idMovie)
    .pipe(take(1))
    .subscribe((response: HttpResponse<any>)=> {
        this._snackBar.open('The movie has been deleted. It\'s lost  f o r e v e r', '', {duration: 5000});
        return response;
      });

    this._bottomSheetRef.dismiss();
    // this.router.navigate(['../','movie', this.movie.idMovie]);
    
    
  }

  public cancelDelete(): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

}
