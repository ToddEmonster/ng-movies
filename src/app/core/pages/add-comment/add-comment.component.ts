import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent implements OnInit {

  public isShown: boolean = false; // hidden by default

  constructor() { }

  ngOnInit(): void {
  }



  toggleShow() {
    this.isShown = !this.isShown;
  }
}
