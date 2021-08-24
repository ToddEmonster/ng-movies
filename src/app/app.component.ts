import { Component } from '@angular/core';

// DECORATEUR COMME DANS PYTHON PARCE QUE LA CLASSE EST EN-DESSOUS
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor() {}
  ngOnInit(): void { }

}

