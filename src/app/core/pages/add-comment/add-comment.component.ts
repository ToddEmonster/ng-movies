import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  isShown: boolean = false ; // hidden by default
  
toggleShow() {


  this.isShown = ! this.isShown;

}
}
