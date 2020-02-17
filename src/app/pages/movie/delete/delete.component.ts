import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef, MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {
  
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<DeleteComponent>
  ) { }

  ngOnInit(): void {
  }

  public deleteMovie(): void {
    console.log('Are you _sure_ you want to delete it ? It\'s a good movie y\'know D:')
    this._bottomSheetRef.dismiss();
  }

  public cancelDelete(): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

}
