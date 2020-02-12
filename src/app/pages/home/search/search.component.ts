import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  public value: string;
  constructor() { }

  ngOnInit(): void {
  }

  public validateSearch() {
    if (this.value.length) {
      console.log("The user typed something !!")
    }
  }
}
